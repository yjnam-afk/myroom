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
};

export type TextbookSubnote = {
  /** topics.json 의 id (있으면 설명·두음신공이 자동 연결) */
  topicId?: string;
  title: string;
  /** 교재 분류 (CA=컴퓨터구조, OS=운영체제, PM=프로젝트관리, SE=소프트웨어공학, AI=인공지능) */
  course: "CA" | "OS" | "PM" | "SE" | "AI" | "ST" | "DS" | "AL" | "NW";
  /** 교재 '■ 정의' 그대로 */
  definition: string;
  /** 답안 서론용 2줄 정의 — 한 줄 17자 × 2줄 = 34자 이내로 압축한 버전 */
  defShort?: string;
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
    defShort: "명령어 인출→해석→실행→저장을 반복하는 CPU 실행 과정",
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
          ["t0", "MAR ← PC", "PC의 내용을 MAR로 전송"],
          [
            "t1",
            "MBR ← M(MAR) / PC ← PC + 1",
            "해당 주소 기억장치 명령어가 MBR로 적재 / PC의 내용을 1 증가",
          ],
          ["t2", "IR ← MBR", "MBR에 있는 명령어가 IR로 이동"],
        ],
      },
      {
        caption: "명령어 실행 사이클",
        headers: ["주기", "마이크로 연산", "동작"],
        rows: [
          ["t0", "MAR ← IR(addr)", "MBR에 저장될 데이터의 기억장치 주소를 MAR로 전송"],
          ["t1", "MBR ← M(MAR)", "저장할 데이터를 MBR로 이동"],
          ["t2", "AC ← AC + MBR", "MBR 데이터와 AC의 내용을 더하고 결과값을 다시 AC에 저장"],
        ],
      },
    ],
  },
  {
    topicId: "ca-120",
    title: "CISC vs RISC",
    course: "CA",
    definition: "명령어 구성 방식에 따른 CPU 유형",
    defShort: "명령어 구성 방식에 따른 CPU 유형(복잡 명령어 vs 축소 명령어)",
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
          [
            "구성",
            "데이터 경로 ↔ 캐쉬 ↔ 메모리 / 마이크로 프로그램 제어장치",
            "데이터 경로 ↔ 데이터 캐쉬 ↔ 메모리 / Hardwired 제어장치 ↔ 명령 캐쉬",
          ],
          [
            "명령어 세트",
            "2Byte·3Byte·4Byte 등 가변 (OP-, Operand 조합)",
            "OP-CODE + OPERAND1 + OPERAND2, 32비트로 고정",
          ],
          [
            "정의",
            "단순한 명령처리에서 복합적인 명령 수행까지 하나의 명령집합으로 실행할 수 있도록 여러 개의 명령어를 가진 구조",
            "명령의 종류를 적게 하고, 내부회로를 단순하게 만들어 각각의 명령을 고속으로 실행할 수 있도록 향상 시킨 구조",
          ],
          ["사이클", "여러 사이클에 수행되는 복잡한 명령어", "하나의 사이클에 수행되는 단순 명령어"],
          ["메모리", "많은 명령어가 메모리 참조", "메모리는 Load/Store 명령만 처리"],
          ["파이프라인", "파이프라인 기법 사용하기 어려움", "고도의 파이프 라이닝, 슈퍼 스칼라"],
          ["제어기법", "마이크로 프로그램 방식 제어", "하드와이어 방식 제어"],
          ["명령어 형식", "여러가지 형식의 명령어", "고정형식 명령어"],
          ["명령어 길이", "명령어 길이 상이 (가변)", "모든 명령어 길이 동일 (32비트)"],
          ["컴파일러", "컴파일러 복잡", "단순한 컴파일러 구현 가능"],
          ["레지스터", "소수의 레지스터", "다중 레지스터"],
          ["회로구성", "복잡", "단순"],
          ["사례", "Intel 계열 프로세서", "ARM 계열 프로세서"],
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
    defShort: "명령어 처리 과정을 단계로 나눠 동시에 처리하는 기술",
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
        headers: ["유형", "설명"],
        rows: [
          [
            "단일 파이프라인",
            "효과적인 병렬 처리를 위해 몇 가지 동작을 명령어 수행과정에서 각 단계에 한 번만 중첩하는 기술",
          ],
          [
            "슈퍼 파이프라인",
            "몇 가지 동작을 명령 수행과정에서 각 단계를 엇갈리게 중첩하는 기술 / 파이프라인 단계를 더욱 세분화하여 수행 시간 단축",
          ],
          [
            "슈퍼 스칼라",
            "파이프라인 기능 유닛을 여러 개 포함하여 한 사이클 당 여러 개의 명령어가 동시에 처리 될 수 있도록 한 2세대 파이프 라인 기법 / 1 Cycle 마다 한 개 이상의 명령어가 동시에 처리되는 형태",
          ],
          [
            "슈퍼 파이프라인 이용한 슈퍼스칼라",
            "슈퍼 스칼라 기법에 슈퍼 파이프라인 기법을 적용하여 수행 시간을 더 단축 / 명령어의 중첩을 엇갈리게 하면서 중첩 자체를 여러 개로 하여 병렬성을 높임",
          ],
          [
            "VLIW (Very Long Instruction Word)",
            "동시에 수행될 수 있는 명령어들을 컴파일러 수준에서 추출하여 하나의 명령어로 압축 후 수행",
          ],
        ],
      },
    ],
  },
  {
    topicId: "ca-106",
    title: "Pipeline Hazard",
    course: "CA",
    definition: "파이프라인 프로세스에서 명령어 의존성을 발생시킬 수 있는 문제",
    defShort: "파이프라인에서 명령어 의존성으로 발생하는 지연 문제",
    keywords: ["구조적 해저드", "데이터 해저드", "제어 해저드"],
    tables: [
      {
        caption: "유형 (구데제)",
        headers: ["구분", "비교"],
        rows: [
          [
            "구조적 해저드",
            "하드웨어가 동시에 여러 명령 수행을 지원하지 않기 때문에 발생하는 자원 충돌 현상 / IF(명령어)와 MEM(데이터)가 하나의 메모리로 존재하는 폰 노이만 구조에서 발생",
          ],
          [
            "데이터 해저드",
            "현재 수행 중인 명령어가 이전 명령의 결과에 종속될 때 발생 / RAW(Read after Write): 첫번째 파이프 라인 R1 쓰기 완료된 후, 두번째 파이프 라인 R1 읽기 동작 가능 / WAR(Write After Read), WAW(Write After Write)에서도 동일 문제 발생",
          ],
          [
            "제어 해저드",
            "Jump와 같은 분기 명령, 브랜치 명령에 의해 발생 / 분기명령에서 분기가 결정되는 시점에 이미 파이프라인에는 후속명령들이 채워져 있어서 발생(4 Clock 사이클 폐기)",
          ],
        ],
      },
      {
        caption: "해결 방법",
        headers: ["유형", "해결방안"],
        rows: [
          ["구조적 해저드", "리소스 추가 / 하드웨어 추가 / Havard 아키텍처 / 메모리 인터리빙"],
          [
            "데이터 해저드",
            "Register Renaming / Stall (Hardware Interlocks) / Change Clock Cycle / Operand Forwarding / Restrict software",
          ],
          [
            "제어 해저드",
            "Stall / Predict Branch (Taken / Not Taken) / 지연분기(Delayed branch) / Fast branches / Loop Buffer / Branch target buffer",
          ],
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
    defShort: "가상 메모리 주소를 실제 주소로 변환하는 하드웨어 장치",
    keywords: ["가상 주소", "물리주소", "주소변환", "TTB"],
    tables: [
      {
        caption: "주소 변환 과정",
        headers: ["과정", "설명"],
        rows: [
          ["① 가상주소 전달", "CPU에서 메모리 접근을 위하여 MMU에 가상주소를 전달"],
          [
            "② 페이지 테이블 검색",
            "MMU는 가상주소를 전달받아 메모리의 TTB(Translation Table Base Address) 부터 시작하여 페이지 테이블 검색",
          ],
          ["③ 페이지 테이블 엔트리 전달", "검색된 페이지 테이블 안에서 물리주소를 찾아내어 MMU에 전달"],
          ["④ 물리주소 접근", "MMU는 주소신호를 발생(RAS, CAS)"],
          [
            "⑤ 데이터 전달",
            "메모리는 해당 주소 안에 있는 데이터를 출력하여 CPU에 전달하고 가상주소를 통해 데이터 수신",
          ],
        ],
      },
    ],
  },
  {
    topicId: "ca-78",
    title: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)",
    course: "CA",
    definition: "주기억장치에서 필요한 정보를 캐시기억장치에 정보를 교환하는 기법",
    defShort: "주기억장치 정보를 캐시에 대응시키는 기법(직접·연관·집합연관)",
    keywords: [
      "직접 사상(태그, 라인, 단어)",
      "완전 연관 사상(태그, 단어)",
      "집합 연관 사상(태그, 세트, 단어)",
    ],
    tables: [
      {
        caption: "직접 사상(direct mapping) 방식",
        headers: ["구분", "설명"],
        rows: [
          [
            "개요",
            "주기억장치의 블록이 캐시 기억장치의 특정 라인에만 적재 될 수 있기 때문에 캐시의 적중 여부는 그 블록이 적재될 수 있는 라인만 검사하는 사상 기법",
          ],
          ["동작절차 — 캐시 라인 선택", "캐시로 메모리 주소 전달 시 s 비트의 라인번호 기반 캐시 라인 선택"],
          ["동작절차 — 태그 비교", "선택 라인의 태그 비트와 주소 비교"],
          [
            "동작절차 — 캐시 적중/캐시 미스",
            "일치 시 단어 필드 라인 내 단어 인출 / 라인 적재 후 주소 태그를 라인에 기록, 해당 라인에 다른 블록 존재 시 삭제",
          ],
        ],
      },
      {
        caption: "완전-연관 사상(fully-associative mapping) 방식",
        headers: ["구분", "설명"],
        rows: [
          ["개요", "주기억장치 블록이 캐시의 어떤 라인으로든 적재할 수 있는 기법"],
          ["동작절차 — 태그 비교", "캐시의 모든 슬롯들의 태그 영역과 내용을 비교"],
          [
            "동작절차 — 캐시 적중/캐시 미스",
            "일치하는 슬롯이 있으면 캐시 적중 / 일치하는 슬롯이 없으면 캐시 미스",
          ],
        ],
      },
      {
        caption: "집합-연관 사상(set-associative mapping) 방식",
        headers: ["구분", "설명"],
        rows: [
          [
            "개요",
            "주기억장치 블록 그룹이 하나의 캐시 세트를 공유하며, 그 세트에는 두 개 이상의 라인들이 적재되는 사상 방식",
          ],
          ["동작절차 — 세트 선택", "메모리 주소 세트 비트 이용 하나 선택"],
          ["동작절차 — 태그 비교", "세트 내 태그와 비교"],
          [
            "동작절차 — 캐시 적중/캐시 미스",
            "일치 시 캐시 적중으로 CPU로 인출 / 불일치 시 캐시 미스로 메모리 접근, 라인들 중 교체할 라인 결정하여 교체",
          ],
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
    defShort: "자원관리·프로세스 관리·추상화를 수행하는 OS 핵심 프로그램",
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
        caption: "커널의 기능",
        headers: ["번호", "기능"],
        rows: [
          ["①", "프로세스 관리 및 CPU Scheduling"],
          ["②", "메모리 관리"],
          ["③", "I/O Device 관리"],
          ["④", "IPC(Inter Process Communication)"],
          ["⑤", "네트워크"],
          ["⑥", "File System"],
        ],
      },
      {
        caption: "CPU의 2가지 실행 모드",
        headers: ["모드", "설명"],
        rows: [
          [
            "운영 모드(user mode)",
            "사용자 애플리케이션이 실행되는 모드 / 제한된 권한 / 시스템 호출 통해 커널 기능 사용 가능",
          ],
          [
            "시스템 호출(system call)",
            "운영체제의 커널이 제공하는 기능을 사용자 프로그램이 사용할 수 있도록 해주는 인터페이스",
          ],
          [
            "커널 모드(kernel mode)",
            "운영체제 기능을 수행하는 모드 / CPU가 모든 명령어 실행할 수 있는 최고 권한 소유 / 하드웨어 자원 직접 접근 가능",
          ],
        ],
      },
      {
        caption: "모놀리틱 커널과 마이크로 커널의 비교",
        headers: ["구분", "모놀리딕 커널", "마이크로 커널"],
        rows: [
          [
            "정의",
            "프로세스 관리, 동시성 관리, 메모리 관리 등을 관리자 모드에서 작동하여 사용자에게 고수준의 플랫폼을 제공하는 커널",
            "커널이 제공하는 많은 기능을 사용자 영역에 구현을 통하여 제공하고 최소한의 기능만 제공하는 커널",
          ],
          [
            "구성",
            "VFS, 장치 드라이버, IPC, file system, 스케줄러, 메모리 관리 등을 모두 커널 안에서 구성",
            "기본적인 IPC, 스케줄러, 메모리 관리만을 커널에 구성함",
          ],
          [
            "안정성",
            "커널 역할이 크기 때문에 버그 발생 가능성 높음",
            "커널 자체가 작기 때문에 안정성 및 품질 관리는 상대적으로 쉬움",
          ],
          [
            "성능",
            "커널 기능 사용하기 위해 system-call을 호출 → 오버헤드",
            "서버를 구미에 맞게 튜닝하기가 용이하기 때문에 최적화 여지 많음",
          ],
          [
            "활용",
            "다수의 복잡한 애플리케이션을 동적으로 수행할 경우에 활용하기 좋음. 범용적인 PC에서 활용",
            "목적이 분명한 임베디드 시스템이나 성능 최적화가 필요한 (증권 FEP, 네트워크 장비 등) 영역에서 활용",
          ],
        ],
      },
    ],
    notes: [
      "커널의 구조: System Call Interface → 파일 시스템 관리 / I/O 관리(Device Drivers) / 메모리 관리 / 프로세스 관리 · 스케줄러 · IPC · 동기화 / Protection → Hardware Control(Interrupt Handler..) → Hardware",
    ],
  },
  {
    topicId: "ca-25",
    title: "DMA(Direct Memory Access)",
    course: "CA",
    definition:
      "CPU를 통하지 않고 주변장치(I/O 장치)와 주기억장치 사이의 데이터 전송을 담당하는 장치",
    defShort: "CPU를 거치지 않고 I/O와 주기억장치 간 전송을 담당하는 장치",
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
        headers: ["동작모드", "설명"],
        rows: [
          [
            "단일버스 분리 방식",
            "중앙처리장치·입출력 모듈이 함께 시스템 버스에 직접 연결 / 시스템 버스를 2번씩 사용, 버스 사용량 증가로 성능 저하 발생(수신 1회, 주기억장치 읽기·쓰기 동작 1회)",
          ],
          [
            "단일버스 통합방식",
            "시스템 버스를 1번 사용 / 입출력 모듈을 DMA 제어기 하위로 두는 구조",
          ],
          [
            "입출력 버스 방식",
            "시스템 버스와 입출력 버스 모두 사용 / 입출력 버스가 하나 더 있는 형태",
          ],
        ],
      },
      {
        caption: "전송 방식에 의한 모드",
        headers: ["유형", "동작 방식"],
        rows: [
          [
            "Burst Mode (Block Mode)",
            "한번 DMA 동작이 시작되면 블록단위로 데이터를 전송, 여러 개의 메모리 Word로 구성된 블록이 지속적으로 전송됨 / DMA 인터페이스가 버스 사용권 획득 시 데이터 전송 종료 시까지 버스 사이클을 독점",
          ],
          [
            "Cycle Stealing Mode (Word Mode)",
            "한번 DMA 동작에 한 word 데이터를 전송하는 경우 / CPU의 한 개 메모리 사이클을 훔쳐 수행한다고 하여 Cycle Stealing이라고 함 / CPU와 DMA가 동시에 BUS를 사용하고자 할 때 DMA 우선 제어",
          ],
          [
            "Demand Transfer Mode",
            "Burst Mode와 유사하며 DREQ 신호 비활성시 전송을 중지하고 활성시 재시작하는 전송 방식",
          ],
          ["Interleaved DMA", "CPU가 시스템 미 사용시 DMA가 버스를 사용"],
        ],
      },
    ],
  },
  {
    title: "메모리 단편화(Fragmentation)",
    course: "CA",
    definition:
      "메모리 상에서 프로그램에 의해 사용되지 못하고 낭비되는 공간이 발생하는 현상",
    defShort: "메모리가 사용되지 못하고 낭비되는 공간이 발생하는 현상",
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
        headers: ["유형", "설명"],
        rows: [
          [
            "내부 단편화",
            "고정된 분할공간 내 미사용 공간 / 분할된 공간에 프로그램 적재 후 남는 공간 / 프로그램이 요구한 것보다 큰 공간을 할당할 경우 낭비되는 부분",
          ],
          [
            "외부 단편화",
            "분할된 크기가 프로그램 크기보다 작아서 할당할 수 없는 공간 / 프로그램이 요구하는 만큼의 메모리를 할당하고, 이후 메모리에 프로그램이 지속적으로 할당·교체되어 사용하기 어려운 작은 공간이 발생하게 됨",
          ],
        ],
      },
      {
        caption: "해결 방법",
        headers: ["해결방안", "설명"],
        rows: [
          ["통합", "인접해 있는 단편화 된 공간을 하나의 공간으로 통합"],
          [
            "압축",
            "주기억장치 내 분산되어 있는 단편화 공간을 결합하여 하나의 큰 가용 공간으로 생성(=Garbage Collection)",
          ],
          [
            "가상메모리 관리기법 활용",
            "페이징 기법: 동일 크기의 프레임으로 구성(외부단편화 방지) / 세그먼트 기법: 가변 크기의 블록 구성(내부단편화 방지)",
          ],
          [
            "Memory Pool 활용",
            "메모리 요청을 각 객체 크기대로 나누고 포인터를 기반으로 관리",
          ],
          [
            "Buddy System",
            "고정분할, 가변분할로 인한 단편화 방지를 보완한 절충 시스템 / 사용하지 않는 모든 페이지프레임을 그룹화",
          ],
          [
            "Slab Allocator",
            "페이지 프레임을 할당 받아 공간을 작은 크기로 분할하고 메모리요청시 작은 크기로 메모리를 할당 해제하는 동적 메모리 관리 기법",
          ],
        ],
      },
    ],
  },
  {
    topicId: "ca-47",
    title: "I2C(Inter Integrated Circuit)와 SPI(Serial Peripheral Interface)",
    course: "CA",
    definition: "시리얼(Serial) 통신 방식",
    defShort: "임베디드 장치 간 데이터를 주고받는 시리얼 통신 방식",
    keywords: ["SCL", "SDA", "CS", "SCLK", "MOSI", "MISO", "100kbps", "70MHz"],
    tables: [
      {
        caption: "I2C vs SPI",
        headers: ["구분", "I2C", "SPI"],
        rows: [
          [
            "정의",
            "보드 내 마이크로프로세서와 저속 주변 기기 사이의 통신 위해 직렬 클럭과 직렬 데이터 두 개의 라인으로 표준모드 100Kbps 속도로 통신하는 반 이중 방식의 동기식 시리얼 인터페이스",
            "범용의 고속 I/O 용도로 사용하기 위해 4개의 라인으로 구성된 전이중(Full Duplex) 통신 모드로 동작하는 동기식 시리얼 인터페이스",
          ],
          [
            "동작 방식",
            "1) 라인에 연결된 마스터들 중 하나가 Start신호를 보내면 Bus를 점유 2) Bus를 점유한 master가 slave address와 Read/Write 정보를 Bus에 전송",
            "1) CS(Chip Select) 신호 활성화하여 슬레이브 선택 2) SCLK(Serial Clock)를 통해 인터페이스 시작 3) MOSI/MISO 라인을 통해 데이터 전송",
          ],
          ["통신방식", "반 이중 통신", "전 이중 통신"],
          ["구성", "2개의 라인(SCL, SDA)", "4개의 라인(CS, SCLK, MOSI, MISO)"],
          ["연결", "Master, Slave 공유 구조", "Master, Slave 간 1:1 연결"],
          ["속도", "저속, 표준모드 100kbps", "고속, 70MHz"],
          ["전력소모", "높음", "낮음"],
        ],
      },
    ],
  },
  {
    topicId: "ca-76",
    title: "캐시메모리의 쓰기정책(Write Policy)",
    course: "CA",
    definition: "캐시(Cache)와 주기억장치에 기록하는 시점에 대한 정책",
    defShort: "캐시와 주기억장치에 기록하는 시점을 정하는 정책",
    keywords: ["Write Through", "Write Back", "Cache Coherence"],
    tables: [
      {
        caption: "Write Through vs Write Back",
        headers: ["구분", "Write Through", "Write Back"],
        rows: [
          ["구성도", "동시 쓰기 — CPU가 캐시기억장치·주기억장치에 함께 기록", "나중 쓰기 — CPU가 캐시기억장치에만 기록"],
          [
            "동작원리",
            "Write 동작 시 Cache와 주기억 장치에 동시 Write",
            "Cache에만 쓰고 Dirty Bit를 두어 Block이 Swap Out 될 때 주기억 장치에 복사 방식",
          ],
          ["일관성", "항상 보장", "Block 교체시만 보장"],
          ["장점", "구조가 단순", "기억 장치 쓰기 동작의 최소화 / Write Time 단축"],
          [
            "단점",
            "BUS의 Traffic 양의 증가 / Write Time의 증가",
            "Cache Coherency 의 어려움 / Block 교체 시 Dirty bit 확인 과정 필요",
          ],
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
    defShort: "캐시를 무효화하고 주기억장치에서 다시 읽게 하는 동작",
    keywords: ["invalidate", "dirty bit", "valid bit", "cache flush", "cache clean"],
    tables: [
      {
        caption: "캐시(Cache) 상태",
        headers: ["상태", "설명"],
        rows: [
          ["Valid Bit(유효 비트)", "Cache Line이 활성화 상태 / Cache Block의 데이터가 유효"],
          ["Dirty Bit(더티 비트)", "Data가 변경되었는지 파악"],
        ],
      },
      {
        caption: "캐시(Cache) Flush와 Clean",
        headers: ["동작", "설명"],
        rows: [
          [
            "Cache Flush",
            "캐시내의 데이터가 유효하지 않다는 것을 알려줌 / Cache Line의 Dirty Bit를 0으로 reset",
          ],
          [
            "Cache Clean",
            "캐시내의 데이터를 메인-메모리로 저장하는(비우는) 작업 / Dirty Bit가 1로 Set된 것을 모두 메모리에 반영시키고 Dirty비트를 0으로 초기화",
          ],
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
    defShort: "공유 메모리에서 프로세서별 로컬 캐시 간 일관성 유지",
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
        headers: ["기법", "설명"],
        rows: [
          [
            "공유 캐시 사용",
            "모든 프로세서가 하나의 공유 캐시 사용 / 항상 캐시 일관성이 유지 / 프로세서 간 캐시 액세스 충돌 빈번하게 발생하여 성능 저하 초래",
          ],
          [
            "공유 변수 캐시 미사용",
            "변경 가능 공유 데이터는 주기억 장치에만 기록 / 캐시 저장 불가능 데이터(Non-cacheable data): 가) Lock 변수, 프로세스 큐 같은 공유 데이터 구조 나) 임계 영역에 의해 보호되는 데이터 / 캐시 적중률 저하 및 I/O 성능 저하 초래",
          ],
        ],
      },
      {
        caption: "HW 기법",
        headers: ["기법", "설명"],
        rows: [
          [
            "디렉토리 프로토콜",
            "캐시 블록의 공유 상태, 노드 등을 기록하는 저장 공간인 디렉토리를 이용한 관리 기법 / Full Map 디렉토리: 디렉토리에 모든 cache의 포인터와 데이터 저장 / Limited 디렉토리: Full Map 디렉토리의 기억장소 부담 감소 / Chained 디렉토리: cache 포인터를 linked list로 연결, 기억장소 부담 감소",
          ],
          [
            "스누피 프로토콜(Snoopy Protocol)",
            "주소 버스를 항상 감시하여 캐시 상의 메모리에 접근이 있는지를 감시하는 기법 / 스누피 제어기: 다른 프로세서에 의한 메모리 액세스 감지 후 상태 조절 / 쓰기 갱신: Write 발생 시 모든 cache에 갱신된 정보 전송 / 쓰기 무효: Write 발생시 Invalid 메시지 브로드 캐스팅",
          ],
        ],
      },
      {
        caption: "프로토콜",
        headers: ["프로토콜", "설명"],
        rows: [
          [
            "MESI 프로토콜",
            "Modified(수정), Exclusive(배타), Shared(2개 이상의 cache에 공유), Invalid(무효, 다른 캐시가 수정) / 4가지의 상태를 통해 데이터의 유효성 여부 판단",
          ],
          [
            "그 외 프로토콜",
            "MEI, MSI, MOESI, MESIF 프로토콜 / O(Owned): 변경상태의 cache 블록을 다른 곳에서 읽은 경우 / F(Forwarding): 여러 프로세서가 공유한 cache 블록 접근 시 새로운 프로세서에게 대표로 할당",
          ],
        ],
      },
    ],
  },
  {
    topicId: "ca-56",
    title: "메모리 인터리빙(Interleaving)",
    course: "CA",
    definition:
      "버스의 경합이나 기억장치의 충돌 회피를 위하여 기억장치를 여러 개의 독립적인 모듈들로 나누고 모듈들에서 동시에 엑세스 동작이 일어날 수 있도록 하는 기법",
    defShort: "기억장치를 모듈로 나눠 동시 접근시키는 성능 향상 기법",
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
        headers: ["구분", "설명"],
        rows: [
          [
            "상위 인터리빙",
            "기억장치 주소를 모듈들에 순차적으로 지정하는 방식 / 상위 비트: 모듈 선택 신호로 사용 / 하위 비트: 모듈 내 기억장소 선택",
          ],
          [
            "하위 인터리빙",
            "기억장치 주소가 모듈 단위로 인터리빙 됨 / 하위 비트들: 모듈 선택 신호로 사용 / 상위 비트들: 모듈 내 기억장소 선택",
          ],
          [
            "혼합 인터리빙",
            "기억장치 모듈을 뱅크로 그룹화함 / 그룹(뱅킹) 선택시 상위 인터리빙 활용, 그룹(뱅킹) 내 모듈간에는 하위 인터리빙 활용",
          ],
        ],
      },
      {
        caption: "메모리 인터리빙 접근방식",
        headers: ["구분", "설명"],
        rows: [
          [
            "C-ACCESS",
            "주소가 순차적으로 도착 / 순차적인 Data Read / 순차적인 CPU 전송 / 액세스 시간 T = Ta + (M * tb) / Ta: 기억장치 액세스 시간, M: 기억장치 모듈 수, tb: 버스 클럭의 주기",
          ],
          [
            "S-ACCESS",
            "주소가 모두 도착하면 동시에 Data Read / 읽은 Data는 순차적으로 CPU 전송 / 액세스 시간 T = Ta + (M * tb)",
          ],
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
    defShort: "Flag 상태로 캐시 데이터 유효성을 판단하는 일관성 프로토콜",
    keywords: ["Cache Coherence", "Modify", "Exclusive", "Shared", "Invalid"],
    tables: [
      {
        caption: "MESI 상태",
        headers: ["구분", "세부 상태", "설명"],
        rows: [
          [
            "수정(Modify)",
            "데이터가 수정(변경)된 상태",
            "캐시내의 라인이 수정되었으며(주기억장치와 다르며), 그 라인은 이 캐시에만 있음",
          ],
          [
            "배타(Exclusive)",
            "유일한 복사본, 주기억 장치와 동일",
            "캐시 내의 라인은 주기억장치에 있는 것과 동일하며, 다른 캐시에는 존재하지 않음",
          ],
          [
            "공유(Shared)",
            "두개 이상 캐시에 데이터가 적재",
            "캐시 내의 라인은 주기억장치에 있는 것과 동일하며, 다른 캐시에도 있을 수 있음",
          ],
          [
            "무효(Invalid)",
            "다른 프로세스에 의해 수정된 데이터",
            "캐시 내의 라인은 유효한 데이터를 포함하지 않음",
          ],
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
    defShort: "클러스터로 묶어 장애 시 서비스를 신속히 넘기는 고가용성 기술",
    keywords: ["Heart-beat", "Hot Standby", "Mutual Takeover", "Concurrent Access"],
    tables: [
      {
        caption: "구성 유형",
        headers: ["구성유형", "내용"],
        rows: [
          [
            "Hot Standby",
            "가동시스템과 평상시 대기상태 또는 개발시스템으로 운영되는 백업시스템으로 구성 / 평상시 백업시스템을 구성하여 대기상태를 유지하다가 장애 발생시 자원을 Take-over / 외장 디스크는 가동 시스템에서만 접근 가능하고, 장애 시에만 백업 시스템에서 접근 가능",
          ],
          [
            "Mutual Takeover",
            "2개 시스템이 각각의 고유한 가동 업무 서비스를 수행하다가 한 서버에 장애가 발생하면 상대 시스템의 자원을 Failover 하여 동시에 2개의 업무를 수행하는 방식 / 장애 발생 시 Failover에 대비해 각 시스템 2개의 업무를 동시에 서비스할 수 있는 시스템 용량을 갖추도록 고려해야 함 / 외장 디스크는 해당 시스템에서만 접근 가능함",
          ],
          [
            "Concurrent Access",
            "여러 개의 시스템이 동시에 업무를 나누어 병렬 처리하는 방식으로 HA에 참여하는 시스템 전체가 Active 한 상태로 업무를 수행함 / 한 시스템에 장애가 발생하여도 다른 시스템으로 Failover 하지 않고 가용성을 보장함",
          ],
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
    defShort: "결함·고장에도 정상 또는 부분적으로 기능하는 시스템",
    keywords: ["Graceful Degradation", "결함 감지", "결함 진단", "결함 통제", "결함 복구"],
    tables: [
      {
        caption: "단계별 특성 (감진통복)",
        headers: ["기능", "내용"],
        rows: [
          ["결함감지", "Fault Detection, 시스템 내 결함 발생 및 내용 감지"],
          ["결함진단", "Fault Diagnosis, 결함의 원인/위치/파급효과 판단"],
          ["결함통제", "Fault Isolation, 결함으로 인한 오류 파급 차단"],
          ["결함복구", "Fault Recovery & Reconfiguration 결함요소 제거, 시스템 재구성"],
        ],
      },
      {
        caption: "관점별 기법 — Hardware",
        headers: ["기법", "설명"],
        rows: [
          ["TMR (Triple Modular Redundancy)", "3개 이상의 프로세서가 같은 입력에 대하여 동일한 연산 수행"],
          ["Duplication with Comparison", "하드웨어 2개 중복 / 2개의 프로세서를 동기 상태에서 프로세스 수행"],
          ["Stand by Sparing", "결함감지를 위한 여분의 하드웨어"],
          ["Watchdog Timer", "주기적 타이머 가동을 위한 초기화"],
          ["RAID", "디스크 미러링, 패리티 비트"],
          ["Self-Purging Redundancy", "출력결과가 틀린 하드웨어는 계산과정에서 배제"],
        ],
      },
      {
        caption: "관점별 기법 — Software",
        headers: ["기법", "설명"],
        rows: [
          ["Check point", "S/W 수행 중에 검사시점을 설정 / 오류발생이 발견되면 발생이전의 검사시점으로 되돌아가서 재수행"],
          [
            "Recovery Block",
            "재 수행(Rollback & Retry)에 근거 / 단일 프로세서의 Rollback, Retry / 검사지점에서 오류가 발견되면 지정된 이전검사점으로 되돌아가서 같은 기능을 가진 다른 S/W 모듈을 수행",
          ],
          ["Conversation", "재 수행(Rollback & Retry)에 근거한 Recovery의 확장형 / 복수의 프로세서 정보를 교환하는 프로세서들 간에 적용 가능한 기법"],
          ["Distributed Recovery Block", "분산 환경에서의 Rollback 기법 / Recovery Block 기법을 분산환경으로 확장 / H/W 결함과 S/W 결함을 동일한 방법으로 대처"],
          ["N self-checking programming", "자가진단을 통한 컴포넌트의 결함 발견 / 2개 이상의 Self-Checking 컴포넌트가 수행되면서 하나는 주어진 기능을 수행하고 다른 컴포넌트는 대기상태"],
          ["N version programming", "H/W 결함허용 기법의 Triple Modular Redundancy와 유사 / N 개의 독립적인 S/W 모듈의 수행결과를 비교하여 다수의 수행결과를 채택"],
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
    defShort: "프로세서 오작동 감시 후 시스템을 리셋·복구하는 장치",
    keywords: ["Kick", "Reset", "Clock", "Time out"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "설명"],
        rows: [
          ["Kick (Clear)", "주기적으로 Watchdog에게 알려주는 Alive신호"],
          ["Reset", "워치독 타이머가 MCU를 초기화하는 시그널"],
          ["Clock", "Clock 디바이스를 동작시키는 외부 클럭 소스(Clock Source)"],
          ["Timeout", "MCU의 Task가 정상 동작하지 않음을 알려주는 신호"],
        ],
      },
      {
        caption: "동작 과정",
        headers: ["구분", "실행절차", "내용"],
        rows: [
          ["초기화", "Setup Value", "워치독 타이머의 설정값을 초기화"],
          ["시작", "Timer Start", "초기값에서 0이 될 때 까지 카운트다운(Count down) 시작"],
          ["Kick", "Watchdog Kick", "MCT의 task 들이 주기적으로 동작, 워치독 타이머 킥 수행"],
          ["중단", "Task Runaway", "task runway 상태 시, refresh routine 중단"],
          ["만료", "Watchdog Timer Expire", "refresh routine 중단에 따른 타이머 expire"],
          ["리셋", "Reset MCU", "Reset 시그널 수신에 따른 MCU 리셋"],
        ],
      },
      {
        caption: "구현 방법",
        headers: ["구분", "구현방법"],
        rows: [
          ["하드웨어 구현방법", "내부 워치독 타이머 / 외부 워치독 타이머"],
          ["타이머 개수별 구현 방법", "단단계 워치독 타이머 / 다단계 워치독 타이머"],
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
    defShort: "스트라이핑·미러링으로 디스크 가용성·성능을 높이는 기술",
    keywords: ["스트라이핑", "미러링", "해밍", "패리티", "분산 패리티", "0+1", "1+0"],
    tables: [
      {
        caption: "종류",
        headers: ["종류", "설명"],
        rows: [
          [
            "RAID 0",
            "블록 레벨 스트라이핑 / I/O 성능은 드라이브 수에 비례 / 오류 검출 및 복구 기능 없음 / 최소 드라이브 수 2개 / 읽기·쓰기 성능: N배 향상(N: 드라이브 수)",
          ],
          [
            "RAID 1",
            "디스크 미러링 방식 / 가용성과 성능 고려 / 최소 드라이브 수 2개 / 읽기 성능: N배 향상(N: 드라이브 수)",
          ],
          [
            "RAID 2",
            "비트 레벨 스트라이핑 / 해밍 코드 사용한 ECC 기능 제공 / Overhead 발생 / 최소 드라이브 수 3개",
          ],
          [
            "RAID 5",
            "블록 레벨 스트라이핑 / 분산 패리티 사용 / 최소 드라이브 수 3개 / 읽기 성능: N배 향상(N: 드라이브 수) / 쓰기 성능: 최대 N-1배 향상",
          ],
          [
            "RAID 10",
            "미러링 + 블록 레벨 스트라이핑 / 패리티 사용 안 함 / 최소 드라이브 수 4개 / RAID 01대비 장애 복구 시간 빠르고 안정적",
          ],
          [
            "RAID 01",
            "블록 레벨 스트라이핑 + 미러링 / 패리티 사용 안 함 / 최소 드라이브 수 4개 / 가용성, 성능, 안정성 측면에서 RAID 10 대비 낮음",
          ],
        ],
      },
    ],
    notes: [
      "RAID 3: 바이트 레벨 스트라이핑, 패리티 디스크 사용",
      "RAID 4: 블록 레벨 스트라이핑, 패리티 디스크 사용",
    ],
  },
  {
    title: "이레이저 코딩(erasure coding)",
    course: "CA",
    definition:
      "분할과 패리티를 이용하여 데이터를 인코딩하고, 데이터 손실 시 디코딩 과정을 거쳐 원본 데이터를 복구하는 기술",
    defShort: "분할·패리티 인코딩으로 손실 데이터를 복구하는 기술",
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
          ["분할", "1) 데이터 분할(n)", "같은 크기의 블록으로 데이터 분할 작업 수행"],
          [
            "저장(인코딩)",
            "2) 이레이저 코드(n+k)",
            "Reed-Solomon Code, Tahoe-LAFS, Weaver Code 알고리즘을 통한 데이터 패리티 블록과 함께 저장",
          ],
          ["복원(디코딩)", "3) 패리티 복원(n)", "손실 발생 시, 오류 데이터 영역 단위로 복구 수행"],
        ],
      },
      {
        caption: "알고리즘",
        headers: ["알고리즘", "설명"],
        rows: [
          [
            "Reed-Solomon Code",
            "데이터를 n개의 조각으로 나누고 k개의 \"패리티\" 조각을 추가한 다음 n개의 (n+k) 조각에서 원본을 재구성",
          ],
          ["Tahoe-LAFS", "데이터를 여러 서버에 암호화하여 분산 저장하는 방식"],
          [
            "Weaver Code",
            "동일한 스트립에 데이터 및 패리티 블록 배치, 제한된 패리티 in-degree 및 균형 및 대칭을 이루는 고내결함성 XOR 기반 코드",
          ],
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
    defShort: "메모리 반도체와 시스템 반도체가 융합된 형태의 반도체",
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
        caption: "핵심 기술 — 초고속 컴퓨팅 반도체",
        headers: ["핵심 기술", "설명"],
        rows: [
          [
            "뉴로모픽 고속 컴퓨팅",
            "자율학습 및 판단을 가능하게 하는 기술로, 뉴로모픽/뉴로시냅틱 틱/칩 신경망 등의 분야에 응용",
          ],
          ["지능형메모리", "SSD, UFS 등 메모리와 PU/Controller가 융합돼 독립적인 기능 담당"],
          [
            "빅데이터 고속처리",
            "다량의 정보 실시간 분석, 고속 연산처리 지능형 반도체 분야로 Multi-Thread, Parallel Processing, 빅데이터 등에 응용",
          ],
          ["IoT 프로세서", "사물인터넷 디바이스를 위한 소형, 저전력 프로세서, 다양한 응용을 위한 주변장치 IP기술"],
        ],
      },
      {
        caption: "핵심 기술 — 스마트 통신 반도체",
        headers: ["핵심 기술", "설명"],
        rows: [
          ["고속이동통신", "5G, 6G, AV 코덱에 사용되는 고속 이동통신"],
          ["광대역 네트워크", "광 기반 고속 네트워크, 차량·선박·항공용 통신 시스템, 기저대역 모뎀 HW 설계 기술 등"],
          ["초저전력 커넥티비티", "근접통신, 협업 미들웨어, 자율제어 등"],
        ],
      },
      {
        caption: "핵심 기술 — 스마트 인지 제어 반도체",
        headers: ["핵심 기술", "설명"],
        rows: [
          ["얼굴인식", "사람 이상의 인식률 99.15% 달성(페이스북)"],
          ["콘텐츠 및 광고추천", "사용자 취향 분석을 통한 콘텐츠 및 광고추천(넷플릭스, 아마존)"],
          ["자동통역", "자동통역(스카이프, 마이크로소프트)"],
          ["음성비서", "개인형 음성비서 및 대화형 교육서비스(애플 시리, IBM Watson CogniDoll)"],
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
    defShort: "AI 학습·추론에 최적화된 주문형 반도체(ASIC)",
    keywords: [
      "텐서(Tensor)",
      "주문형 반도체",
      "AI학습",
      "MXU",
      "승산 누적 연산",
      "행렬처리",
    ],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          [
            "행렬 곱셈 장치(MXU, Matrix Multiplier Unit)",
            "대규모 행렬 곱셈 및 컨볼루션 연산을 고속으로 처리(누산기) / 시스톨릭 어레이(Systolic Array) 구조를 사용하여 데이터 이동을 최소화 및 병렬연산 극대화 / MXU 구성: 256 x 256(TPU v6e), 128 x 128(v6e 이전 TPU 버전)",
          ],
          ["벡터 장치(Vector Unit)", "행렬 곱셈 외의 요소별 연산 / 활성화함수, 정규화 같은 연산"],
          [
            "HBM(High Bandwidth Memory)",
            "대용량 데이터를 빠르게 전송할 수 있는 메모리 / MXU에 데이터를 공급하여 연산 병목 현상을 줄이는데 사용",
          ],
          ["상호 연결(Inter-Chip Interconnect, ICI)", "여러 개의 TPU 칩을 연결할때 사용"],
        ],
      },
      {
        caption: "TPU 전체 데이터 처리 흐름",
        headers: ["절차", "설명"],
        rows: [
          ["1", "TPU 호스트가 데이터를 인피드 큐로 스트리밍"],
          ["2", "인피드 큐에서 데이터를 로드하고 HBM 메모리에 저장"],
          ["3", "HBM 메모리의 매개변수를 행렬 곱셈 단위(MXU)로 로드"],
          ["4", "HBM 메모리에서 데이터를 로드"],
          [
            "5",
            "행렬 곱셈 및 컨볼루션 연산을 수행, 다음 누산기로 전달하여 연산 / 행렬 곱셈 연산 중에는 메모리 액세스가 필요 없음",
          ],
          ["6", "데이터와 매개변수 간의 모든 곱셈 결과의 합을 출력"],
        ],
      },
      {
        caption: "TPU와 GPU 비교",
        headers: ["구분", "TPU", "GPU"],
        rows: [
          ["설계목적", "딥러닝 전용", "범용 병렬 컴퓨팅"],
          ["아키텍처", "인공지능 특화형", "범용 병렬 프로세서"],
          ["연산방식", "행렬 연산", "병렬 연산"],
          ["프레임워크", "TensorFlow", "CUDA, TensorFlow, PyTorch"],
          ["확장성", "구글 Cloud", "모든 환경에서 사용 가능"],
          ["비용", "대규모 모델 학습 및 추론 시 GPU대비 비용 효율 높음", "높은 초기 투자 비용"],
          [
            "전력",
            "데이터 이동량을 최소로 하여 높은 전력 효율 및 처리량 달성",
            "높은 연산 성능을 유지하기 위해 높은 전력 소비",
          ],
          ["분산", "TPU Pod 로 대규모 병렬처리", "NVLink"],
        ],
      },
    ],
    notes: ["114회 응용 1교시 기출", "개념도: 시스톨릭 어레이(Systolic Array) 구조"],
  },
  {
    topicId: "os-45",
    title: "경쟁조건(Race Condition) 해결 방안",
    course: "OS",
    definition:
      "둘 이상의 프로세스가 동일한 공유 자원에 동시에 접근하면서 실행 순서에 따라 결과가 달라질 수 있는 상황",
    defShort: "공유 자원 동시 접근 시 실행 순서로 결과가 달라지는 상황",
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
          [
            "공유 자원(Shared Resource) 사용",
            "여러 프로세스 또는 스레드가 동일한 변수, 메모리 공간, 파일 등에 동시에 접근",
          ],
          [
            "비동기적 실행(Asynchronous Execution)",
            "운영체제의 스케줄러가 스레드를 임의의 순서로 실행하여 실행 시간에 따라 다른 결과",
          ],
          [
            "임계 영역(Critical Section) 미보호",
            "임계 영역에 대한 동기화(Synchronization) 처리가 부족할 경우",
          ],
        ],
      },
      {
        caption: "소프트웨어 방식 경쟁조건 해결 방안",
        headers: ["기법", "설명"],
        rows: [
          [
            "데커(Dekker) 알고리즘",
            "프로세스 2개일 때 상호 배제하는 최초 알고리즘 / 프로세스가 임계구역 사용 의사 표시 위한 flag와 어떤 프로세스에게 임계구역 진입 우선권을 줄지 표시하는 turn 변수 사용 / 임계영역 진입을 먼저 시도하고, 임계영역 내 작업 완료되면 진입 순서 양보",
          ],
          [
            "피터슨(Peterson) 알고리즘",
            "상호배제 위한 병렬 프로그램 알고리즘 / 데커와 동일하게 flag, turn 변수 사용 / 상대 프로세스에게 먼저 기회를 양보하고 이후 임계 영역 진입",
          ],
          [
            "램포트(Lamport) bakery 알고리즘",
            "분산 처리 환경에서 유용 / 번호표를 부여받고 낮은 프로세스 먼저 우선 실행",
          ],
        ],
      },
      {
        caption: "하드웨어 방식 경쟁조건 해결 방안",
        headers: ["기법", "설명"],
        rows: [
          [
            "Test & Set",
            "하드웨어 수준에서 하나의 원자적(atomic) 연산으로 메모리 위치 값을 테스트하고 그 값을 설정하는 동작 수행 / 테스트(현재값 읽기) → 셋(잠김 상태 설정) → 반환(읽은 값 반환)",
          ],
          [
            "Compare & Swap",
            "CAS 연산은 원자적(atomic)으로 메모리 위치 값을 비교하고, 예상되는 값과 일치하는 경우에만 새로운 값으로 변경",
          ],
          [
            "인터럽트 금지",
            "문제되는 코드 부분에서 인터럽트를 disable 처리. 원자성 확보 / 내부적으로 Context-Switching 불가능",
          ],
        ],
      },
      {
        caption: "동기화 방식 경쟁조건 해결 방안",
        headers: ["기법", "설명"],
        rows: [
          ["세마포어", "P 연산, V 연산 과정을 통해 동기화 지원 / Binary, Count 세마포어 지원"],
          ["모니터", "고수준 Level의 동기화 제공 / 프로그래밍 언어가 지원해야 사용 가능"],
          [
            "Spin Lock",
            "임계 영역 진입이 불가능할 때, 가능할 때까지 루프를 돌면서 재시도하는 방식",
          ],
          ["Mutex", "동기화 대상이 하나인 경우 상호 배제를 보장"],
        ],
      },
      {
        caption: "임계영역 해결을 위한 세가지 요건",
        headers: ["방법", "설명"],
        rows: [
          ["상호 배제", "프로세스가 임계영역에서 수행 중, 다른 프로세스의 진입 불가"],
          [
            "진행",
            "임계영역에 프로세스가 없을 때, 다음에 임계구역으로 진입하려는 프로세스의 진입을 미루면 안됨",
          ],
          [
            "한계 대기",
            "임계 영역에 한번 들어갔던 프로세스는 다음에 임계 영역에 다시 들어갈 때 제한을 둠 (기아방지)",
          ],
        ],
      },
    ],
    notes: [
      "임계영역(Critical Section): 병렬컴퓨팅에서 둘 이상의 프로세스가 동시에 접근해서는 안되는 공유 자원(자료 구조 또는 장치)을 접근하는 코드의 일부 영역",
      "Acquire the Lock → Lock is locked / Release the Lock → Lock is unlocked",
    ],
  },
  {
    topicId: "os-37",
    title: "기아(Starvation)",
    course: "OS",
    definition:
      "우선순위 기반 CPU 스케줄링 시 높은 우선순위 프로세스의 지속적 진입으로 인해, 낮은 우선순위 프로세스가 수행되지 못하고 무한대기 하는 현상",
    defShort: "우선순위에 밀려 프로세스가 무한대기하는 현상",
    keywords: ["무한대기", "Aging기법 적용", "HRN 스케줄링", "MLFQ 스케줄링"],
    tables: [
      {
        caption: "기아 현상 발생 원인",
        headers: ["원인", "설명"],
        rows: [
          ["비선점", "이미 할당된 CPU를 다른 프로세스가 강제로 빼앗을 수 없는 스케줄링 방식"],
          [
            "우선순위",
            "각 프로세스에게 우선 순위를 부여해서 가장 높은 우선 순위를 갖는 프로세스에게 CPU를 할당",
          ],
        ],
      },
      {
        caption: "기아 현상 발생 사례와 해결 방안",
        headers: ["구분", "설명"],
        rows: [
          [
            "문제 상황",
            "사례에서 프로세스 1의 경우 우선우위가 2,3,4 보다 제일 낮기 때문에 실행을 하지 못하고 계속 대기 / 2,3,4 수행 중에도 순위가 높은 프로세스가 지속적으로 요청되면 프로세스 1은 무한정 기다리게 되는 현상이 발생",
          ],
          [
            "해결 방안",
            "이때 오래 기다린 순서대로 Process 1,2의 우선순위를 향상 시킴(Aging기법)",
          ],
        ],
      },
      {
        caption: "기아 현상 해결 위한 스케줄링 알고리즘",
        headers: ["해결방안", "설명"],
        rows: [
          ["HRN 스케줄링", "대기시간을 고려하여 Aging 적용한 HRN 스케줄링 사용"],
          [
            "MLFQ 스케줄링",
            "프로세스간 균형 할당을 고려해 여러 개의 큐를 두고 Round Robin 수행",
          ],
        ],
      },
      {
        caption: "교착 상태와 기아 상태 비교",
        headers: ["구분", "설명"],
        rows: [
          [
            "교착상태(Deadlock)",
            "특정 집합 내의 프로세스가 그 집합 내의 다른 프로세스에 의해서만 야기될 수 있는 Event를 무한정 대기하는 상태 (확인 방법: 자원할당 그래프)",
          ],
          ["기아상태(Starvation)", "교착 상태의 부산물, 프로세스가 자원 무한 대기(무한 봉쇄)"],
        ],
      },
    ],
    notes: [
      "사례 개념도 — 문제 상황: Process1(실행시간 10, 우선순위 10), Process2(4, 7), Process3(5, 1), Process4(6, 5)",
      "사례 개념도 — 해결 방안: Process1(대기시간 15, 우선순위 10→9), Process2(대기시간 11, 우선순위 7→6), Process3(대기시간 0, 우선순위 1), Process4(우선순위 5)",
    ],
  },
  {
    topicId: "os-47",
    title: "문맥교환(Context Switching)",
    course: "OS",
    definition:
      "CPU가 실행 중인 하나의 프로세스 상태를 저장하고, 다른 프로세스 상태를 복원하여 실행하는 과정",
    defShort: "실행 중 프로세스 상태를 저장하고 다른 프로세스로 전환하는 과정",
    keywords: [
      "디스패치(dispatch)",
      "타임아웃",
      "I/O",
      "시스템콜",
      "인터럽트",
      "오버헤드",
      "save/reload PCB",
    ],
    tables: [
      {
        caption: "문맥교환 동작 메커니즘",
        headers: ["메커니즘", "주체", "설명"],
        rows: [
          ["① 실행", "P1", "프로세스 P1이 CPU가 할당되어 실행중 상태"],
          ["② Interrupt/System call", "운영체제", "인터럽트나 시스템 호출로 프로세스 P1 대기"],
          ["③ PCB1 저장", "운영체제", "프로세스 P1의 PCB1을 문맥교환 위해 저장"],
          ["④ PCB2 적재", "운영체제", "새로 실행될 프로세스 P2에 CPU할당해 실행"],
          ["⑤ 실행", "P2", "CPU가 새로 할당되어 프로세스 P2가 실행"],
          ["⑥ Interrupt/System call", "운영체제", "인터럽트나 시스템 호출로 프로세스 P2 대기"],
          ["⑦ PCB2 저장", "운영체제", "프로세스 P2에 대한 현재 상태를 PCB2에 저장"],
          ["⑧ PCB1 적재", "운영체제", "대기중인 P1을 복구 후 CPU를 할당하고 실행"],
          ["⑨ 실행", "P1", "system call 이나 I/O 작업 완료 시 문맥교환 발생"],
        ],
      },
      {
        caption: "문맥교환 특징",
        headers: ["특징", "설명"],
        rows: [
          [
            "발생 시점",
            "프로세스가 ①준비→실행, ②실행→준비, ③실행→대기 상태로 변할 때 발생",
          ],
          [
            "오버헤드",
            "오버헤드가 발생하며 오버헤드는 메모리 속도, 레지스터 수, 특수 명령어의 존재에 따라 다르므로 시스템마다 다름",
          ],
        ],
      },
    ],
    notes: [
      "① Context Switch가 자주 발생하지 않도록 다중 프로그래밍 정도 낮춤",
      "② 스택 중심의 시스템에서는 스택 포인터를 변경하여 프로세스간 문맥교환 수행",
      "③ Light weight 프로세스인 스레드를 이용하여 Context switch 부하 최소화",
      "동작 메커니즘 도식: process P0 ↔ operating system ↔ process P1 — save state into PCB0 → reload state from PCB1 → (P1 executing, P0 idle) → save state into PCB1 → reload state from PCB0",
    ],
  },
  {
    topicId: "os-34",
    title: "우선순위 역전(Priority Inversion) 현상",
    course: "OS",
    definition:
      "동기화로 인해 우선순위가 높은 프로세스가 우선순위가 낮은 프로세스보다 실행이 지연되는 현상",
    defShort: "동기화로 높은 우선순위 프로세스가 낮은 것보다 지연되는 현상",
    keywords: ["임계영역", "프로세스 선점", "자원", "우선순위 상속", "우선순위 올림"],
    tables: [
      {
        caption: "우선순위 역전 현상 메커니즘",
        headers: ["Process", "설명"],
        rows: [
          ["① 임계영역 진입", "Task 3이 자원 R 사용 위해 임계 영역 진입"],
          ["② 프로세스 선점", "스케줄링에 의해 우선 순위 높은 Task 1은 Task 3 선점하여 진행"],
          [
            "③ 임계영역 대기",
            "Task 1은 수행 중 자원 R이 필요하지만 Task 3이 점유하여 더 이상 진행하지 않고 CPU 제어권 반납",
          ],
          [
            "④ 우선순위 역전",
            "스케줄링에 의해 Task 3보다 우선순위 높은 Task 2가 선점되고 우선순위가 가장 높은 Task 1은 Task 2 이후 진행",
          ],
        ],
      },
      {
        caption: "해결 방안",
        headers: ["기법", "설명"],
        rows: [
          [
            "우선순위 상속",
            "임계영역에 진입한 우선순위가 낮은 Task의 우선순위를 진입 대기하는 높은 우선순위의 Task와 동일하게 부여 (① 임계영역 진입 → ② 프로세스 선점 → ③ 임계영역 대기(wait) → ④ 우선순위 상속 → 역전현상 해결)",
          ],
          [
            "우선순위 올림",
            "임계영역의 자원 R에 우선순위를 부여하고 해당 임계영역에 진입하는 Task의 우선순위를 자원의 우선순위로 올림 (①-a 임계영역 진입 → ①-b 우선순위 올림 → ② 대기 → 역전현상 해결)",
          ],
        ],
      },
    ],
    notes: ["우선순위 역전 현상 해결 위해 우선순위 상속과 우선순위 올림 존재"],
  },
  {
    topicId: "os-32",
    title: "세마포어(Semaphore)",
    course: "OS",
    definition:
      "멀티프로세스 환경에서 상호 배제를 보장하고 동기화를 제어하기 위해 사용하는 동기화 기법",
    defShort: "상호 배제와 동기화를 제어하는 정수 기반 동기화 기법",
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
          ["초기화 연산", "Initialize", "S = 정수값 (공유 자원의 수)"],
          [
            "P 연산",
            "Wait / 임계영역 진입",
            "S = S − 1 / S < 0 → 프로세스를 대기 큐로 이동 / S > 0 → 프로세스를 계속 진행",
          ],
          ["V 연산", "Signal / 임계영역 탈출", "S = S + 1"],
        ],
      },
      {
        caption: "이진 세마포어(Binary Semaphore)",
        headers: ["구분", "설명"],
        rows: [
          [
            "정의",
            "값이 0 또는 1만을 가지며, 주로 단일 공유 자원의 상호 배제(Mutual Exclusion)를 보장하기 위해 사용되는 세마포어",
          ],
          ["특징", "0 또는 1의 정수 값만 가지는 세마포어"],
          ["P(s) 연산", "세마포어 s가 1일 때에 0으로 변경 (다른 프로세스가 접근 못하게)"],
          ["V(s) 연산", "세마포어 s가 0일 때에 1로 변경 (다른 프로세스가 접근할 수 있게)"],
          ["지원", "하나의 자원에 대한 공유 및 동기화를 지원"],
        ],
      },
      {
        caption: "계수형 세마포어(Counting Semaphore)",
        headers: ["구분", "설명"],
        rows: [
          [
            "정의",
            "값이 0 이상 정수이며, 여러 개의 동일한 자원에 대한 접근을 제어하거나 프로세스 간 동기화를 위해 사용되는 세마포어",
          ],
          ["특징", "범위에 제한이 없는 정수 값을 가지는 세마포어 / 일반적으로 언급하는 세마포어"],
          [
            "지원",
            "다수의 공유 자원에 대해 여러 프로세스가 접근할 때에 상호 배제 및 동기화를 지원",
          ],
          ["조건", "Task의 수 n > Key(공유 자원) 수 m — m개의 Semaphore, m개의 Shared Resource"],
        ],
      },
      {
        caption: "세마포어와 모니터의 비교",
        headers: ["구분", "세마포어", "모니터"],
        rows: [
          ["주체", "OS, 개발자 주체의 동시성 지원", "프로그래밍 언어 수준의 동시성 지원"],
          [
            "상호작용",
            "모니터에게 이론적 기반 제공 / 모니터에게 효과적인 기법 제공",
            "세마포어의 단점인 타이밍 오류 해결 / 세마포어의 단점인 개발편의성의 보완",
          ],
          [
            "특징",
            "S의 타입에 따라 Binary / Counting 세마포어로 구분",
            "한 시점에 하나의 프로세서만 모니터 내부에서 수행 / 세마포어와 계산 능력은 동일",
          ],
          [
            "동기화 구현 사례",
            "Semaphores S; P(S); // 검사역할, S—임계구역 { } V(S);",
            "Monitor monitor-name { // 지역변수선언 Public entry P1(..) { } Public entry P2(..) { } }",
          ],
          ["언어사례", "P, V 연산으로 구현", "JAVA의 synchronized Object, .Net의 Monitor"],
          ["공통점", "동시성 지원을 위한 조정(Coordination) 기능을 수행", "동일"],
        ],
      },
    ],
  },
  {
    title: "CPU Ring Level",
    course: "OS",
    definition:
      "시스템이 운영체제 및 소프트웨어의 실행 권한을 관리하기 위해 설계된 프로세서의 권한 수준(Privilege Level)를 나타내는 (보안) 계층적 구조",
    defShort: "OS·SW 실행 권한을 관리하는 프로세서의 권한 계층",
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
          [
            "Ring 0 (Kernel Mode, Supervisor Mode)",
            "가장 높은 권한을 가지며, 운영체제의 커널이 실행 / OS 커널, 드라이버 등이 동작하는 영역",
          ],
          [
            "Ring 1, Ring 2 (Middle Privilege Level, Uncommon in Modern OS)",
            "드라이버나 가상화 소프트웨어 등 특정 시스템 기능을 수행하는데 사용 / 현대 운영체제에서는 거의 사용되지 않음",
          ],
          [
            "Ring 3 (User Mode, Application Mode)",
            "가장 낮은 권한을 가지며, 일반 애플리케이션이 실행되는 영역 / 직접 하드웨어 접근이 불가능하며, OS 커널을 통해서만 시스템 리소스를 사용",
          ],
        ],
      },
      {
        caption: "CPU Ring Level 동작 메커니즘",
        headers: ["동작 절차", "설명"],
        rows: [
          [
            "① 사용자 모드(Ring 3) 프로세스 실행",
            "응용 프로그램(예: 브라우저, 게임)은 Ring 3에서 실행",
          ],
          [
            "② 커널 모드(Ring 0)로 전환 (시스템 호출)",
            "커널 기능이 필요한 작업을 요청하면, 시스템 호출 인터럽트 발생 / CPU는 Ring 3 → Ring 0 전환 후, OS가 요청을 처리",
          ],
          [
            "③ 요청 처리 후 다시 Ring 3으로 전환",
            "커널이 요청을 처리한 후 Ring 0 → Ring 3으로 복귀",
          ],
        ],
      },
    ],
    notes: [
      "구조도(동심원, 바깥→안): User Programs → Standard Libraries → Device Drivers → Kernel",
      "Most Privileged: Ring 0(kernel mode) / Least Privileged: Ring 3(user mode)",
    ],
  },
  {
    topicId: "ca-51",
    title: "기억장치 계층 구조 (Memory Hierarchy)",
    course: "OS",
    definition:
      "가격과 성능이 다른 여러 수준의 기억 장치를 비용 최소화, 빠른 속도, 대용량의 기억 공간을 효율적으로 구성하는 기억 장치 구조",
    defShort: "속도·용량·비용이 다른 기억장치를 계층으로 구성한 구조",
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
          ["용량(Capacity)", "상위 레벨에서 하위 레벨로 갈수록 용량이 증가"],
          ["접근 시간(Access Time)", "상위 레벨에서 하위 레벨로 갈수록 접근 시간이 증가"],
          ["비트당 비용(Cost per Bit)", "상위 레벨에서 하위 레벨로 갈수록 비트당 비용이 감소"],
          ["성능(Performance)", "하위 레벨 메모리 접근 빈도가 낮을수록 전체 시스템 성능 향상"],
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
    defShort: "가상 주소 공간으로 제한된 물리 메모리를 확장 활용하는 기법",
    keywords: [
      "할당(단일, 다중)",
      "배치(First, Best, Next, Worst)",
      "호출(Demand, Pre)",
      "교체(FIFO, LRU, LFU, OPT, NUR)",
    ],
    tables: [
      {
        caption: "할당(Allocation) 기법 — 프로그램에 메모리를 어떻게 공급할지 결정",
        headers: ["세부 기법", "설명"],
        rows: [
          [
            "단일 분할 할당",
            "스와핑(Swapping): 하나의 프로그램 전체를 할당하여 사용하다가 필요 시 다른 프로그램으로 교체 / 오버레이(Overlay): 실행되어야 할 작업 크기가 커서 사용자 기억 공간에 할당 불가능할 때, 작업을 분할하여 필요한 부분만 교체",
          ],
          [
            "다중 분할 할당",
            "고정 분할: 주기억 장치를 고정된 크기와 개수 부분으로 분할하는 기법 / 가변 분할: 주기억 장치 적재 시 필요한 만큼 동적 할당하는 기법",
          ],
        ],
      },
      {
        caption: "배치(Placement) 기법 — 어디(Where)에 적재할지 결정",
        headers: ["세부 기법", "설명"],
        rows: [
          ["First Fit", "최초 적합한 곳에 할당"],
          ["Best Fit", "할당 가능한 곳 중 낭비 공간이 최소가 되는 곳에 할당"],
          ["Next Fit", "최근 할당 공간 다음부터 스캔하여 할당"],
          ["Worst Fit", "가장 큰 공간 할당"],
        ],
      },
      {
        caption: "호출(인출, Fetch) 기법 — 언제(When) 적재할지 결정",
        headers: ["세부 기법", "설명"],
        rows: [
          [
            "Demand Fetch (요구)",
            "실행 프로그램이 요구할 때 참조되는 페이지 혹은 세그먼트만을 주기억장치에 적재하는 기법",
          ],
          [
            "Pre Fetch (예측)",
            "실행 프로그램이 참조할 것을 예상하여 사전에 기억 장치로 적재하는 기법(근거: 지역성)",
          ],
        ],
      },
      {
        caption: "교체(Replacement) 기법 — 누구와(Who) 교체할지 결정",
        headers: ["세부 기법", "설명"],
        rows: [
          ["FIFO (First In First Out)", "가장 먼저 들어온 페이지를 교체"],
          ["LFU (Least Frequency Used)", "현재 기준 사용 횟수가 가장 적은 페이지 교체"],
          ["LRU (Least Recently Used)", "현재 기준 가장 오랫동안 사용되지 않은 페이지 교체"],
          ["OPT (Optimal Page)", "가장 오랫동안 사용되지 않을 페이지 선택 교체"],
          ["NUR (Not Used Recently)", "최근 사용되지 않은 페이지를 2bit 이용하여 교체"],
        ],
      },
    ],
    notes: [
      "개념도: 할당 정책(Allocation) · 배치 정책(Placement) → 프로그램 A/B ↔ 스왑 아웃/스왑 인 ↔ 보조기억장치 → 페이지 교체(Replacement) → Thrashing",
    ],
  },
  {
    title: "가상메모리의 페이징과 세그멘테이션",
    course: "OS",
    definition:
      "[페이징] 물리적 메모리와 가상 메모리를 일정한 크기의 블록으로 나누어 관리하는 메모리 관리 기법 / [세그멘테이션] 프로세스의 메모리를 가변 크기의 논리적 블록(세그먼트)으로 나누어 관리하는 메모리 관리 기법",
    defShort: "고정 크기(페이징)·가변 크기(세그먼트)로 나누는 메모리 관리",
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
        headers: ["번호", "특징"],
        rows: [
          ["①", "주소변환(Mapping): 가상주소(보조기억장치)→실주소(주기억장치)"],
          ["②", "주소변환을 위해 페이지 맵핑 테이블 필요 → 기억 장소 낭비"],
          ["③", "페이지 부재(Page Fault) 발생"],
          ["④", "외부단편화(X), 내부단편화(O)"],
        ],
      },
      {
        caption: "세그멘테이션(Segmentation) 기법의 특징",
        headers: ["번호", "특징"],
        rows: [
          [
            "①",
            "다른 세그먼트 영역을 침범할 수 없으며, 이를 위해 기억장치 보호키(Storage Protection Key)가 필요",
          ],
          ["②", "세그먼트의 크기는 서로 다르며, 각각의 세그먼트들은 연속 공간에 할당되어야 함"],
          ["③", "외부단편화(O), 내부단편화(X)"],
          ["④", "세그먼트의 위치 지정은 최초 적합, 최적 적합으로 할당"],
        ],
      },
      {
        caption: "페이징과 세그멘테이션 비교",
        headers: ["구분", "페이징", "세그멘테이션"],
        rows: [
          [
            "메모리 관리",
            "동일한 크기로 인하여 메모리 관리가 수월한 반면 페이지 테이블의 크기가 커지고, 내부 단편화 발생",
            "세그멘테이션 테이블을 작게 관리할 수 있으나 메인 메모리의 외부 단편화에 따른 추가 관리가 필요함",
          ],
          [
            "블록 구성",
            "메인 메모리의 크기를 동일하게 분할하여 구성",
            "세그먼트 크기가 같아야 하거나 메인 메모리에서 서로 인접 필요는 없음(가변적 크기)",
          ],
          ["매핑 방식", "직접매핑, 연관매핑 / 집합-연관매핑, 역매핑", "직접매핑"],
          [
            "공유",
            "수정 불가 데이터는 공유가능, 수정 가능 프로시저는 공유 불가 / 시스템이 각 사용자마다 프로그램의 사본을 할당해준다면 많은 메모리 낭비 발생",
            "공유 세그먼트들은 직접 맵핑의 순수 페이징 시스템보다는 오버헤드가 적게 발생",
          ],
        ],
      },
    ],
    notes: [
      "페이징 개념도: 보조기억장치 Page 1~6(각 10K) → 페이지 맵 테이블 → 주기억장치(10K 단위) → CPU / 주소 = br(페이지 존재 bit) + s(보조기억장치 주소) + p'(페이지 프레임 번호)",
      "페이지 크기가 작아질 경우: 페이지 수 증가 → 페이지 맵핑 테이블 크기 증가 → 페이지 단편화 증가",
    ],
  },
  {
    topicId: "ca-87",
    title: "직접 사상과 연관 사상 페이징 기법",
    course: "OS",
    definition:
      "[직접 사상] 페이지 사상 테이블(PMT)을 참고하여 가상 주소를 실제 주소로 변환하는 기법 / [연관 사상] 메모리 주소 변환을 위해 연관 메모리 또는 내용 주소 지정 기억장치를 사용하는 기법",
    defShort: "PMT 직접 참조 또는 연관 메모리로 주소를 변환하는 기법",
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
        headers: ["절차", "설명"],
        rows: [
          [
            "①",
            "프로그램 실행 전 OS는 주기억장치내 페이지 사상표의 시작 Address를 페이지 사상표 Origin Register로 적재(b)",
          ],
          ["②", "수행하고 있는 프로세스가 가상주소 v = (p, d)를 참조"],
          [
            "③",
            "해당 프로세스의 페이지 사상표의 시작주소를 가지고 있는 레지스터 값(b)과 p를 더하여 사상표 내의 p에 관한 위치 획득",
          ],
          ["④", "p 페이지를 기억하고 있는 실기억장치의 페이지 프레임 p'를 사상표에서 획득"],
          ["⑤", "p'와 변위 d를 접속하여 실주소 획득"],
        ],
      },
      {
        caption: "연관(Associative) 사상에 의한 페이징 기법",
        headers: ["절차", "설명"],
        rows: [
          ["①", "연관 기억장치(Associative Memory)에 Page mapping Table 전체를 넣는 방법"],
          [
            "②",
            "내용 주소화 기억장치(Content-Addressable Memory): CAM에서 사용자가 검색어를 제공하면, CAM은 자신의 메모리 공간 전체를 탐색하여 해당 검색어가 위치하고 있는 주소를 반환",
          ],
          ["③", "순수 연관 사상을 통한 페이지 주소 변환"],
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
    defShort: "페이지 부재 시 교체할 프레임을 선택하는 알고리즘",
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
          [
            "FIFO (First In First Out)",
            "가장 먼저 들어온 페이지를 먼저 교체시키는 방법 (주기억장치 내에 가장 오래 있었던 페이지를 교체)",
            "Memory 적재 시간 사용 / FIFO 큐 사용 구현 / Belady의 이상 현상(Belady's anomaly)",
          ],
          [
            "LRU (Least Recently Used)",
            "가장 오랫동안 참조 되지 않은 페이지를 선택 교체하는 전략",
            "각 페이지 참조시마다 참조 시간을 기록 / 막대한 오버헤드 발생",
          ],
          [
            "LFU (Least Frequently Used)",
            "참조된 횟수를 근거, 자주 참조된 Page는 주기억장치에 남겨두고, 참조 횟수가 가장 적은 Page 교체",
            "Page 참조 횟수를 사용",
          ],
          [
            "NUR (Not Used Recently)",
            "적은 오버헤드로 LRU와 유사 성능 발휘. 가장 최근 사용되지 않은 Page 교체",
            "참조 bit와 수정 bit를 사용",
          ],
          [
            "SCR (Second Chance Replacement)",
            "가장 자주 사용하던 Page라도 교체 대상에 포함시키는 기법으로 FIFO페이지 교체기법 보완",
            "Queue 구조 / 참조 bit 사용",
          ],
          [
            "Clock Page",
            "SCR 교체 기법과 동일하지만 원형 List 구조를 사용한 기법",
            "원형 List 구조 / 참조 bit 사용",
          ],
        ],
      },
      {
        caption: "교체 대상 선택",
        headers: ["원칙", "설명"],
        rows: [
          [
            "① 최적화의 원칙",
            "앞으로 가장 오랫동안 사용되지 않을 페이지를 교체 대상으로 선택 / 이론적으로는 최적이나 미래를 예측할 수 없어 실현 불가능",
          ],
          [
            "② 선택을 위한 기본 정책",
            "대체로 좋은 결론을 내리면서 시간 및 공간의 오버헤드가 적은 방법",
          ],
          [
            "③ 교체 제외 페이지",
            "페이징을 위한 슈퍼바이저 코드 영역, 보조기억장치 드라이버 영역, 입출력장치를 위한 데이터 버퍼 영역 등",
          ],
          [
            "④ 낮은 오버헤드",
            "대체로 좋은 결정을 내리면서 교체 대상을 선택하기 위한 시간, 오버헤드가 적은 방법 선택 필요",
          ],
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
    ],
    notes: [
      "① 동일 그룹 내에서는 무작위 선택",
      "② 일정 주기로 모든 참조비트를 0으로 변경. 수정비트는 유지 → 그룹2는 주기적으로 참조비트를 0으로 만든 결과",
    ],
  },
  {
    topicId: "ca-90",
    title: "Belady's Anomaly(FIFO 이상현상)",
    course: "OS",
    definition:
      "FIFO 페이지 교체 알고리즘에서, 페이지 프레임의 개수 증가 불구하고 page fault 발생이 오히려 증가하는 현상",
    defShort: "프레임을 늘려도 페이지 부재가 오히려 늘어나는 FIFO 현상",
    keywords: ["FIFO", "page fault 증가", "Page Frame 증가", "LRU", "OPT"],
    tables: [
      {
        caption: "벨레이디의 변이의 원인과 영향",
        headers: ["구분", "설명"],
        rows: [
          ["원인", "Locality를 고려하지 않은 FIFO의 한계"],
          ["영향", "1) Page Fault의 증가로 인한 성능 저하 / 2) Threshing 발생"],
        ],
      },
      {
        caption: "Belady's Anomaly 극복 방안",
        headers: ["구분", "극복 방안", "설명"],
        rows: [
          [
            "페이지 교체 정책",
            "LRU 사용",
            "Least Recently Used / 페이지 교체 시점에 가장 최근에 참조가 안된 페이지 교체",
          ],
          [
            "페이지 교체 정책",
            "OPT 사용",
            "Optimal Page Replacement / 향후 가장 오랫동안 사용하지 않을 페이지 교체",
          ],
          ["최적화 원칙 설계", "Locality", "시간적, 공간적, 순차적 지역성 활용 / Working Set 활용"],
          [
            "최적화 원칙 설계",
            "PFF",
            "프로세스의 Page Fault 빈도에 따라 Residence Set을 조정, PFF가 높으면 Residence Set 크기 증가, 낮으면 줄임",
          ],
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
    defShort: "페이지 교체에 실행보다 많은 시간을 쓰는 비정상 현상",
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
        headers: ["번호", "원인"],
        rows: [
          ["①", "리소스가 부족 (낮은 CPU, 적은 Memory)"],
          ["②", "부적절한 페이지 교체 정책 (Locality 미고려, Memory Size가 너무 적은 경우)"],
          ["③", "과도한 다중 프로그래밍"],
        ],
      },
      {
        caption: "스레싱 발견 방법",
        headers: ["발견 방법", "설명"],
        rows: [
          ["① Page Fault 조사", "PFF(각 Process 별 Page Fault Frequency)"],
          [
            "② Swapping 조사",
            "프로세스들을 주기억장치에서 보조기억 장치 또는 그 반대로 옮기는 과정",
          ],
        ],
      },
      {
        caption: "스레싱 해결 방안",
        headers: ["기법", "정의", "설명"],
        rows: [
          [
            "Working Set",
            "특정 시간에 실행되는 프로그램에 대해 Locality가 포함되는 page들의 집합",
            "일정 시간 동안 참조되는 page 집합(working set)을 주기억장치에 유지, 지역성 참조 개념에 의해 page fault 감소",
          ],
          [
            "PFF",
            "page fault가 발생 시, page frame을 조정하는 기법",
            "1) PFF > 상한 → Page fault가 높으면 Page Frame 증가 / 2) PFF < 하한 → Page fault가 낮으면 Page Frame 회수 / Page fault 발생 시에만 Page Frame을 조정하므로 Working Set 대비 Overhead 낮음",
          ],
        ],
      },
      {
        caption: "Working Set과 PFF의 비교",
        headers: ["구분", "Working Set", "PFF"],
        rows: [
          ["페이지집합 수정방식", "매번 기억장치 참조시마다 워킹 세트 수정", "Page Fault가 발생시만 상주 페이지 세트 수정"],
          ["Thrashing 조절", "Prepaging에는 유용하나 조절은 어려움", "직접적으로 Thrashing을 방지하면서 PFF 측정 및 조절"],
          ["Overhead", "기억장소 참조시마다 수정하므로 Overhead가 매우 큼", "Page Fault 발생시만 조절하므로 Overhead 작음"],
        ],
      },
    ],
    notes: [
      "개념도: CPU 이용율이 다중 프로그래밍 정도에 따라 상승하다 임계점 이후 급락 → Thrashing 구간",
      "Working Set 예: 참조된 페이지 a a b b b c a a c c c c d d c c e e c f — W(t, w) = { a, c, d }",
    ],
  },
  {
    topicId: "os-74",
    title: "지역성(Locality)",
    course: "OS",
    definition: "CPU가 어느 순간에 정보를 특정 부분만 집중적으로 참조하는 특성",
    defShort: "CPU가 특정 부분만 집중적으로 참조하는 특성(시간·공간)",
    keywords: ["시간적", "공간적", "순차적"],
    tables: [
      {
        caption: "지역성 유형",
        headers: ["유형", "내용", "사례"],
        rows: [
          [
            "Temporal Locality (시간적)",
            "프로세스가 실행되면서 하나의 페이지를 일정 시간 동안 집중적으로 엑세스 하는 현상 / Block 교체 알고리즘",
            "순환(Looping) 서브프로그램 / LRU (Least Recently Used)",
          ],
          [
            "Spatial Locality (공간적)",
            "프로세스 실행 시 일정 위치의 페이지를 집중적으로 엑세스 하는 현상 / Block 교체 알고리즘",
            "Array / 순차적 코드 실행 / 가상 메모리 / Working Set",
          ],
          [
            "Sequential Locality (순차적)",
            "따로 분기가 없는 한 데이터가 기억장치에 저장된 순서대로 순차적으로 인출되고 실행될 가능성이 높음 / Prefetch 이용",
            "명령어가 순차적으로 인출, 실행",
          ],
        ],
      },
      {
        caption: "Locality 사례",
        headers: ["구분", "내용", "유형"],
        rows: [
          [
            "Cache Memory",
            "1) 블록 재배치 알고리즘 구현에 이용 — LRU, 최근에 가장 적게 사용된 Block 교체",
            "시간적",
          ],
          [
            "Cache Memory",
            "2) Fetch 알고리즘 구현에 이용 — Prefetch 즉, 필요 정보와 예상 정보를 미리 인출하여 배치",
            "공간적, 지역적, 순차적",
          ],
          [
            "Virtual Memory",
            "1) Thrashing 해결 — Working Set을 이용한 페이지 교환을 최소화",
            "공간적",
          ],
          [
            "Virtual Memory",
            "2) 페이지 교체 알고리즘 — NRU, FIFO, LRU등 시간/공간 참조 지역성을 활용",
            "시간적, 공간적",
          ],
          ["CDN", "지역성 원리를 이용하여 컨텐츠를 신속히 전달", "공간적"],
        ],
      },
    ],
  },
  {
    topicId: "ca-58",
    title: "단편화(Fragmentation)",
    course: "OS",
    definition:
      "작업의 크기가 주기억장치 분할 영역과 맞지 않아 주기억장치 공간이 사용되지 못하고 낭비되는 현상",
    defShort: "작업 크기와 분할 영역이 안 맞아 메모리가 낭비되는 현상",
    keywords: ["내부 단편화", "외부 단편화", "통합(Coalescing)", "집약(Compaction)"],
    tables: [
      {
        caption: "단편화 유형",
        headers: ["유형", "설명"],
        rows: [
          [
            "내부단편화",
            "분할된 Memory에 Process를 할당 했을 때 할당된 Memory 내에 남아서 사용 못하는 공간",
          ],
          [
            "외부단편화",
            "영역의 크기가 너무 작아 어느 작업에도 할당되지 못하고 일정 분할 전체가 비어 있는 상태",
          ],
        ],
      },
      {
        caption: "해결 방법",
        headers: ["기법", "설명"],
        rows: [
          [
            "통합(Coalescing)",
            "반납되는 주기억장치 분할 영역을 인접한 공백 영역과 합쳐서 하나의 공백 영역으로 구성",
          ],
          [
            "집약(Compaction)",
            "주기억 장치 내에 분산되어 있는 단편화된 빈 공간을 결합하여 하나의 큰 가용 공간을 만드는 작업 / 기억 장소의 재배치(Relocation) 필요 — 집약기법 수행 시, 각 프로그램에 주어진 분할 영역의 주소를 신규 지정해주는 기법",
          ],
        ],
      },
    ],
    notes: [
      "내부단편화 예: 작업 큐 P1 7KB, P2 3KB, P3 6KB → 10KB 분할에 7KB 할당 시 3KB 내부 단편화, 4KB 분할에 3KB 할당 시 1KB 내부 단편화",
      "외부단편화 예: 작업 큐 P1 12KB, P2 8KB, P3 12KB → Memory 유휴 공간 16KB 존재하나 연속되어 있지 않아 P3 12KB 할당 불가",
      "통합 예: 공백(2K) + 프로그램 B(5K 사용) 종료 → 공백(2K)+공백(5K) → 통합 → 공백(7K)",
      "통합과 집약(압축)을 통해 단편화 일부 해소 가능 / 슬랩(Slab)과 버디(Buddy)는 Linux Kernel에서 사용하는 메모리 관리 기법",
    ],
  },
  {
    topicId: "os-23",
    title: "스케줄러(Scheduler)",
    course: "OS",
    definition: "어떤 Process에게 시스템 자원을 할당할지를 결정하는 운영체제 커널의 모듈",
    defShort: "어떤 프로세스에 자원을 할당할지 결정하는 커널 모듈",
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
          [
            "장기(Long-Term) 스케줄러",
            "생성(New) → 준비(Ready)",
            "실행을 위해 Job Poll에 존재하는 프로세스를 준비상태로 전환 / 준비 상태에 있는 총 프로세스 수를 제어 / 멀티 프로그래밍 정도(Degree of Multiprogramming)를 결정",
          ],
          [
            "중기(Medium-Term) 스케줄러",
            "실행(Run) → 대기(Wait)",
            "프로세스를 메인 메모리 혹은 보조 메모리로 스와핑(Swapping)하는 역할",
          ],
          [
            "단기(Short-Term) 스케줄러",
            "준비(Ready) → 실행(Run)",
            "준비 큐(Ready Queue)에 있는 프로세스 중 어떤 것을 CPU에 할당할지 결정",
          ],
        ],
      },
      {
        caption: "스케줄러의 정책 요구 사항",
        headers: ["요구사항", "증가 방법", "설명"],
        rows: [
          [
            "처리량 (Maximum throughput)",
            "짧은 작업 우선 처리 / 인터럽트 없이 수행",
            "주어진 시간에 얼마나 많은 양의 작업을 하는가의 정도",
          ],
          [
            "최소 응답 시간 (Minimum Response time)",
            "대화형 작업 선수행 / 일괄 처리 작업 후수행",
            "요청 시간으로부터 반응이 시작되는 시간까지의 간격",
          ],
          [
            "최소 반환 시간 (Minimum Turnaround time)",
            "일괄 처리 작업을 선수행",
            "작업을 System에 요청 후 완료되기 까지의 소요 시간",
          ],
          ["최소 대기 시간 (Minimum Waiting time)", "사용자 수 감소", "준비 큐에서 기다리는 시간"],
          ["CPU 최대 활용", "CPU 중심의 작업만 수행", "CPU를 이용하는 정도"],
        ],
      },
      {
        caption: "스케줄러(Scheduler)와 디스패처(Dispatcher)의 비교",
        headers: ["비교 항목", "스케줄러(Scheduler)", "디스패처(Dispatcher)"],
        rows: [
          [
            "개념",
            "여러 프로세스 중에서 특정 프로세스에게 자원을 제공·선택할지 결정",
            "단기 스케줄러가 선택한 스케줄러에게 CPU 제어권 제공",
          ],
          ["유형", "장기·중기·단기 스케줄러", "유형이 없는 하나의 명령어 집합"],
          [
            "알고리즘",
            "선점형·비선점형에 따라 FCFS(First Come First Service), SJF(Shortest Job First) 등 다양",
            "별도의 알고리즘 부재",
          ],
          [
            "수행 기능",
            "상태 전이할 프로세스 선택",
            "문맥 교환(Context Switching), 사용자 모드(User mode) 전환, 프로세스 재시작 위치로 이동(Jump)",
          ],
        ],
      },
    ],
    notes: [
      "역할 구성도: Job Poll →(장기 스케줄러)→ Ready Queue →(단기 스케줄러)→ CPU / I/O Waiting Queue ↔ I/O, 중기 스케줄러가 스와핑 담당",
    ],
  },
  {
    title: "프로세스 상태 전이도",
    course: "OS",
    definition: "하나의 프로세스가 시스템 내에 존재하는 동안 그 프로세스가 가지는 상태",
    defShort: "생성~종료까지 프로세스가 가지는 상태와 전이 관계",
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
          [
            "생성",
            "Job Scheduler",
            "작업 특성에 맞는 Queue 생성 / 예상 CPU 시간, 우선 순위, 요구 I/O 장치, 최대 기억 장치 할당량 등 작업 주요 특징 기록",
          ],
          [
            "준비",
            "Job Scheduler",
            "CPU 할당을 대기하는 상태 / 사전 정의된 정책에 따라 작업 스케줄러에 의해 호출 / 주기억장치 이용 가능성, 요구 장치 검사",
          ],
          [
            "실행",
            "Process Scheduler, Dispatcher",
            "[준비→실행] 사전 정의된 알고리즘(FCFS, SJF 등)따라 스케줄러에 의해 CPU 제어권 획득 / [실행→준비] 할당 시간 만료, 높은 우선 순위 프로세스 도달시 프로세스 스케줄러에 의해 준비 상태로 전이",
          ],
          [
            "대기",
            "Process Scheduler",
            "[실행→대기] 특정 자원 할당 받거나, I/O 작업 종료시까지 작업 보류 상태 / [대기→준비] I/O 장치 관리자 Signal, Page Interrupt handler의 Signal에 의해 Process는 준비 Queue로 전이",
          ],
          ["종료", "Job Scheduler, Process Scheduler", "작업의 정상적 종료 / PCB 제거"],
        ],
      },
    ],
    notes: [
      "상태 전이 Diagram: 생성(New) → 준비(Ready) ⇄ 실행(Running) → 종료(Finished) / 준비→실행: 디스패칭, 실행→준비: 시간 만료, 실행→대기(Waiting): 보류, 대기→준비: 조건만족",
    ],
  },
  {
    title: "CPU 스케줄링(CPU Scheduling)",
    course: "OS",
    definition:
      "다중 프로세스 환경에서 운영체제(스케줄러)가 프로세스에 합리적으로 CPU 자원을 할당(dispatch)하는 정책",
    defShort: "다중 프로세스에 CPU 자원을 합리적으로 할당하는 정책",
    keywords: [
      "선점(RR, SRT, MLQ, MLFQ)",
      "비선점(Priority, FCFS, SJF, HRN)",
      "호위효과",
      "기아상태",
    ],
    tables: [
      {
        caption: "선점형 스케줄링(Preemptive Scheduling)",
        headers: ["알고리즘 유형", "설명"],
        rows: [
          [
            "RR(Round Robin)",
            "단위시간 동안 CPU를 할당 받고 시간 내 처리하지 못한 경우 준비 큐 마지막으로 이동",
          ],
          [
            "SRT(Shortest Remaining Time)",
            "준비 큐에 처리시간이 짧은 프로세스가 발생하면 선점하는 알고리즘",
          ],
          [
            "MLQ(Multi Level Queue)",
            "프로세스를 종류별로 분류, 다수의 큐를 이용하여 높은 우선순위를 가진 프로세스가 선점하여 CPU 할당받는 알고리즘",
          ],
          [
            "MLFQ(Multi Level Feedback Queue)",
            "각각의 큐에 다른 Time Quantum을 부여하고 프로세스 수행시간이 길어질수록 낮은 우선순위의 큐로 이동하여 CPU를 할당하는 알고리즘",
          ],
        ],
      },
      {
        caption: "비선점형 스케줄링(Non-preemptive Scheduling)",
        headers: ["알고리즘 유형", "설명"],
        rows: [
          ["Priority", "프로세스에 우선순위 부여, 해당 순위에 따라 CPU 할당하는 알고리즘"],
          [
            "FCFS(First Come First Served)",
            "프로세스들이 대기 큐에 도착한 순서에 따라 CPU를 할당하는 알고리즘",
          ],
          [
            "SJF (Shortest Job First)",
            "준비 큐 내의 작업 중 Burst Time 이 가장 짧다고 판단되는 것을 먼저 수행하는 알고리즘",
          ],
          [
            "HRN (Highest Response Ratio Next)",
            "SJF의 약점을 보완한 기법으로 긴 작업과 짧은 작업간의 불평들을 완화하는 알고리즘 / 우선순위 = (대기 시간 + 버스트 시간) / 버스트 시간",
          ],
        ],
      },
      {
        caption: "호위효과와 기아상태",
        headers: ["구분", "설명", "해결방안"],
        rows: [
          [
            "호위효과",
            "FCFS CPU 스케줄링 시 선행 프로세스의 긴 수행시간에 의해 이후 도착한 짧은 프로세스 수행지연, 프로세스들의 평균대기시간의 증가 현상",
            "SJF 스케줄링 / Priority 스케줄링",
          ],
          [
            "기아상태",
            "우선순위 기반 CPU 스케줄링 시 높은 우선순위 프로세스의 지속적 진입으로 인해, 낮은 우선순위 프로세스가 수행되지 못하고 무한대기 하는 현상",
            "HRN 스케줄링 / MLFQ 스케줄링",
          ],
        ],
      },
    ],
    notes: [
      "선점형: 운영체제가 필요하다고 판단하면 실행중인 프로세스를 중단하고 다른 프로세스에게 CPU 자원을 할당",
      "비선점형: 프로세스에게 할당된 CPU를 강제로 빼앗을 수 없고 프로세스의 사용이 끝난 이후 다른 프로세스에게 CPU의 자원을 할당하는 정책",
    ],
  },
  {
    title: "기한부(Deadline) 스케줄링",
    course: "OS",
    definition: "작업이 주어진 기한(마감시간) 안에 완료되도록 계획하는 스케줄링 기법",
    defShort: "작업이 마감시간 안에 완료되도록 계획하는 스케줄링",
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
          ["① 경성 실시간 시스템(Hard Real-Time)", "정한 시간내에 반드시 완료해야 하는 실시간 시스템"],
          ["② 연성 실시간 시스템(Soft Real-Time)", "시간적 제한이 다소 약한 형태의 실시간 시스템"],
        ],
      },
      {
        caption: "기한부 스케줄링의 기법 — RM과 EDF의 비교",
        headers: ["비교", "RM(Rate Monotonic)", "EDF(Earliest-Deadline First)"],
        rows: [
          ["정책", "정적 스케줄링 방식", "동적 스케줄링 방식"],
          ["환경", "실행되는 태스크집합이 미리 정의", "태스크의 발생 시간이나 특성을 사전 예측 불가"],
          ["알고리즘", "주기가 짧은 Task에 우선순위를 부여", "임계 시간이 가장 근접한 Task를 가장 먼저 수행"],
          [
            "CPU 이용률",
            "이용률 낮음 — 1개: 100%, 2개: 83%, 무한대: 69%",
            "이용률 높음 — 이론상 100% (문맥 교환 제외)",
          ],
          ["장점", "스케줄링 예상 가능, 단순", "주기적 불필요, CPU 효율성"],
          ["단점", "마감 시간 보장 불가", "스케줄링 예상 불가"],
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
    defShort: "프로세스들이 서로의 자원을 기다리며 무한 대기하는 상태",
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
        headers: ["기법", "설명"],
        rows: [
          [
            "상호 배제 (Mutual Exclusion)",
            "프로세스들이 필요로 하는 자원에 대한 배타적 통제권 요구 (필요 하는 자원을 다른 Process가 점유시 반드시 대기)",
          ],
          [
            "점유 대기 (Hold and wait)",
            "프로세스가 이미 자원을 할당 받아 배타적 점유 하는 상황에서 다른 프로세스가 점유하고 있는 다른 자원이 해제되기를 대기 상황",
          ],
          [
            "비선점 (Non-preemption)",
            "프로세스에 할당된 자원은 그 프로세스가 사용을 마치고 스스로 반환 전까지 제거 불가",
          ],
          [
            "환형 대기 (Circular wait)",
            "프로세스 자원 점유 및 점유된 자원의 요구 관계가 환형을 이루며 대기",
          ],
        ],
      },
      {
        caption: "교착상태 해결 방안",
        headers: ["해결방안", "핵심 내용"],
        rows: [
          [
            "예방 (Prevention)",
            "상호배제, 점유대기, 비선점, 환형의 4가지 조건 중 하나라도 발생하지 않도록 처리",
          ],
          [
            "회피 (Avoidance)",
            "안전 상태 유지(불안정 상태 회피) / ⓐ 단일 유형 여러 자원: 은행원 알고리즘, 안전 알고리즘 / ⓑ 각 유형의 단일 자원: 선언간선 추가한 자원할당 그래프 / Banker's Algorithm(은행가 알고리즘) / Wait-die, wound-wait 알고리즘",
          ],
          [
            "발견 (Detection)",
            "시스템의 상태를 감시 알고리즘 통해 교착상태 검사 / 쇼샤니와 포크만 제시 알고리즘(가용자원, 할당 자원, 요구자원) / 자원할당 그래프, Wait for Graph",
          ],
          [
            "회복 (Recovery)",
            "Deadlock이 없어질 때까지 프로세스를 순차적으로 Kill하여 제거 / 프로세스 종료비용 최소화: 우선순위, 진행비용, 복귀비용 등 / 모든 프로세스 종료",
          ],
        ],
      },
    ],
    notes: [
      "4가지 조건 모두 동시 발생 할 경우 교착 상태 발생",
      "개념도: Process 1 →(Waiting for)→ Resource 2 →(Assigned to)→ Process 2 →(Waiting for)→ Resource 1 →(Assigned to)→ Process 1 — 환형 구조",
    ],
  },
  {
    topicId: "os-39",
    title: "자원할당 그래프(Resource Allocation Graph)",
    course: "OS",
    definition:
      "정점(vertex)들과 정점을 연결하는 간선(edge)들로 이루어져, 프로세스와 자원 간의 관계를 나타내는 방향성 그래프",
    defShort: "프로세스와 자원 관계를 나타내는 방향성 그래프",
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
          [
            "정점(Vertex)",
            "프로세스(Process)",
            "원 내에 Process pi로 표시 / 자원을 요청하는 Process / 정점 V = {P, R} 표현",
          ],
          [
            "정점(Vertex)",
            "자원(Resource)",
            "사각형 내 단위 자원 수 만큼 원으로 표시하고 사각형 외부에 rj로 표시 / Process가 사용할 공유 자원",
          ],
          [
            "간선(Edge)",
            "요청 간선(Request edge)",
            "프로세스에서 자원 방향으로 연결한 선 / 프로세스가 자원의 한 형태를 요청 / Pi→Rj (P가 R형태의 자원을 요청하고 대기 중)",
          ],
          [
            "간선(Edge)",
            "할당 간선(Assignment edge)",
            "자원에서 프로세스 방향으로 연결한 선 / 자원이 프로세스에 할당 / Rj→Pi (R형태의 자원 하나가 P에 할당된 상태)",
          ],
        ],
      },
      {
        caption: "교착상태 탐지 방법",
        headers: ["번호", "설명"],
        rows: [
          [
            "1",
            "자원 할당 그래프 내에 Cycle이 존재하는지 확인. 존재하지 않으면 교착 상태 없음",
          ],
          [
            "2",
            "사이클(cycle)이 존재하고 각 자원 형태가 한 개의 자원만을 가지면 교착 상태 → 필요충분조건",
          ],
          [
            "3",
            "Cycle이 존재하고 자원 유형에 여러 개의 Instance가 있으면 교착 상태 가능성 존재 → 필요조건이나 충분조건은 아님",
          ],
        ],
      },
    ],
    notes: [
      "작성 사례 — 집합 P, R, E: ① P = {P1, P2, P3} ② R = {r1, r2, r3, r4} ③ E = {(P1, r1), (P2, r3), (r1, P2), (r2, P2), (r2, P1), (r3, P3)}",
      "단위 자원의 수: ① r1, r3: 1개 ② r2: 2개 ③ r3: 3개",
    ],
  },
  {
    topicId: "os-41",
    title: "Banker's 알고리즘(은행가 알고리즘)",
    course: "OS",
    definition:
      "프로세스가 자원을 요구할 때 시스템은 자원을 할당한 후에도 안정 상태로 남아있게 되는 지를 사전에 검사하여 교착상태의 발생을 회피하는 기법",
    defShort: "할당 후 안정 상태 여부를 사전 검사해 교착을 회피하는 기법",
    keywords: ["안정상태", "Available", "Max", "Need", "Allocation", "Request"],
    tables: [
      {
        caption: "은행가 알고리즘의 자료 구조",
        headers: ["항목", "구성", "내용"],
        rows: [
          ["Available", "길이가 m인 벡터", "available[j]=k / 자원 유형 Rj에 k개의 자원 사용 가능"],
          [
            "Max",
            "n X m 행렬",
            "Max[i, j]=k / 프로세스 Pi는 자원 유형 Rj에 최대 k개의 자원 요청할 수 있음",
          ],
          [
            "Need",
            "n X m 행렬",
            "Need[i, j]=k / 프로세스 Pi는 작업을 끝내기 위해 자원 유형 Rj의 자원을 k개 필요함 / Need[i, j] = Max[i, j] − Allocation[i, j]",
          ],
          [
            "Allocation",
            "n X m 행렬",
            "Allocation[i, j]=k / 프로세스 Pi는 현재 자원 유형 Rj의 자원을 k개 할당 받음",
          ],
        ],
      },
      {
        caption: "안정상태",
        headers: ["번호", "설명"],
        rows: [
          [
            "①",
            "프로세스들의 순서는, 모든 Pi에 대해서 Pi가 요청하는 자원들이 현재 사용가능한 자원들과 j < i인 Pj가 점유하는 자원으로서 만족된다면 안정상태",
          ],
          ["②", "이때 Pi가 필요한 자원들을 즉시 사용할 수 없다면, Pi는 Pj가 끝날때까지 대기"],
          [
            "③",
            "Pj가 끝나면, Pi는 필요한 자원을 획득하고, 작업을 수행한 후 모든 점유하는 자원을 해제하고 종료",
          ],
          ["④", "Pi가 종료하면, Pi+1이 필요한 자원을 확보하고 계속 처리를 진행"],
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
    defShort: "타임스탬프 비교로 대기·롤백을 정하는 교착 회피 기법",
    keywords: ["타임스템프", "Old", "Young", "롤백", "강제종료", "선점", "비선점"],
    tables: [
      {
        caption: "Wait-Die와 Wound-Wait의 비교",
        headers: [
          "기법",
          "동작 방식",
          "요청 프로세스가 오래된 프로세스(Timestamp가 작은 경우, 우선순위가 높은 경우)",
          "요청 프로세스가 젊은 프로세스(Timestamp가 큰 경우, 우선순위가 낮은 경우)",
        ],
        rows: [
          ["Wait-Die", "늙은 프로세스는 기다리고 젊은 프로세스는 종료", "Wait (기다림 허용)", "Die (롤백)"],
          [
            "Wound-Wait",
            "늙은 프로세스는 젊은 프로세스를 종료하고 자원을 선점",
            "Wound (강제 종료)",
            "Wait (기다림 허용)",
          ],
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
    defShort: "실행을 중단시키고 특정 프로그램을 수행시키는 제어 신호",
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
          ["인터럽트 벡터 테이블(IVT)", "인터럽트 발생", "인터럽트 요청 신호 모니터링, 검출"],
          [
            "인터럽트 벡터 테이블(IVT)",
            "인터럽트 벡터 조회",
            "IVT에 인터럽트ID 조회 / 인터럽트ID에 대응하는 인터럽트 처리 루틴 분기",
          ],
          ["인터럽트 서비스 루틴(ISR)", "인터럽트 금지", "인터럽트 처리 루틴 진입 후 상호 배제(Lock)"],
          ["인터럽트 서비스 루틴(ISR)", "프로세스 상태 저장", "이전 프로세스 정보 저장 (Context Switching)"],
          ["인터럽트 서비스 루틴(ISR)", "인터럽트 처리", "인터럽트의 요청 작업 수행"],
          ["인터럽트 서비스 루틴(ISR)", "프로세스 상태 복구", "이전 프로세스 정보 복구 (Context Switching)"],
          ["인터럽트 서비스 루틴(ISR)", "인터럽트 허용", "상호배제 자원 반납(Unlock), 인터럽트 루틴 종료"],
        ],
      },
      {
        caption: "인터럽트 발생 원인과 종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["H/W 인터럽트", "기계 착오 인터럽트", "정전, 컴퓨터 자체 내의 기계적 문제"],
          [
            "H/W 인터럽트",
            "재시작 인터럽트(Restart Interrupt)",
            "오퍼레이터 및 다른 프로세서에 의해 재시작 명령 도착",
          ],
          [
            "H/W 인터럽트",
            "외부 인터럽트(External Interrupt)",
            "Operator, Timer에 의한 의도적 프로그램 중단",
          ],
          [
            "H/W 인터럽트",
            "입출력 인터럽트(I/O Interrupt)",
            "입출력의 종료나 입출력 오류에 의한 중앙처리장치의 기능 요청",
          ],
          [
            "S/W 인터럽트",
            "프로그램 검사 인터럽트(Program Check Interrupt)",
            "보호 기억공간 내 접근, 불법적 명령 수행과 같은 프로그램 문제",
          ],
          [
            "S/W 인터럽트",
            "슈퍼바이저 호출 인터럽트(Supervisor Call Interrupt)",
            "사용자 입출력 같은 서비스 받기 위해 슈퍼바이저 호출(SVC)를 통해 운영체제 서비스 요청",
          ],
        ],
      },
      {
        caption: "인터럽트 중첩",
        headers: ["구분", "설명"],
        rows: [
          [
            "정의",
            "하나의 인터럽트 요청신호를 받고 해당 Interrupt Service Routine(ISR)을 실행하고 있는 중에 다시 또 다른 인터럽트 요청신호가 발생하는 경우",
          ],
          ["Priority-based Preemption", "우선순위에 따른 중첩 인터럽트"],
          ["Interrupt Pending", "순차적인 다중 인터럽트"],
        ],
      },
    ],
  },
  {
    topicId: "os-53",
    title: "프로세스(Process)와 스레드(Thread) 비교",
    course: "OS",
    definition:
      "[프로세스] 운영체제에서 프로세서(CPU)에 의해 실행되는 프로그램 단위 / [스레드] 하나의 프로세스 내에서 제어 흐름으로 프로세스의 실행 부분을 담당하는 일관된 실행의 기본 단위의 경량 프로세스",
    defShort: "CPU 실행 프로그램 단위와 그 내부 제어 흐름의 비교",
    keywords: ["자원 할당 기본 단위", "프로세스 내 여러 Thread"],
    tables: [
      {
        caption: "프로세스와 스레드 비교",
        headers: ["구분", "프로세스", "스레드"],
        rows: [
          ["개념", "자원 할당을 위한 기본 구분 단위", "CPU 이용 기본 작업 단위"],
          [
            "구성 요소",
            "Code, data, Heap, Stack으로 구성 / 각 memory space 차지",
            "Code, data, heap 영역은 공유 / Stack만 별도로 memory space 차지",
          ],
          [
            "역할",
            "강력한 보호 요구 / 각 프로세스는 독립적 실행, 별개의 메모리를 할당",
            "강력한 보호는 요구되지 않으며, 프로세스 내 메모리 공유",
          ],
          ["Context Switching", "전환 속도 느림, PCB 전환", "전환 속도 빠름"],
          ["상호 통신", "System Call / Call 종료까지 전체 Blocking", "Library Call / 요청 Thread만 Blocking"],
          ["다중 처리", "여러 프로그램을 동시 수행", "하나의 프로그램에서 여러 작업 수행"],
          [
            "장점",
            "문맥 전환을 통해 프로세스 간 전환 발생 / 높은 시스템 부하 / 순차적 실행으로 실행 순서 예측 가능",
            "경량화된 문맥 전환, 낮은 부하 / 응답성, 자원 효율성, 경제성",
          ],
          ["단점", "성능 부하", "비순차적 실행, 실행 순서 예측 어려움"],
        ],
      },
      {
        caption: "PCB와 TCB의 비교",
        headers: ["구분", "PCB", "TCB"],
        rows: [
          [
            "개념",
            "프로세스 관리를 위해 유지되는 데이터 블록, 또는 레코드의 데이터 구조",
            "Thread 실행 동안 상태 정보를 유지하기 위해 관리되는 데이터 구조",
          ],
          [
            "역할",
            "프로세스 정보 저장 / 모든 Thread에 공유되는 정보",
            "Thread 정보 저장 / Thread 내에서 사용되는 정보",
          ],
          [
            "주요 구성 요소",
            "Owner, PID, Heap Pointer, Priority, Active Thread",
            "Stack Pointer, PC, Thread State, Register",
          ],
          ["상호 연계 정보", "하나 이상의 TCB 정보", "Thread가 속한 PCB 링크 정보"],
          ["Context 관점", "실행 환경 정보 교환", "실행 관련 정보 교환"],
          [
            "관리 데이터 양",
            "관리 Data가 많음 / TCB에서 공유한 정보 포함 / Linux 기준 약 106개 필드",
            "PCB에 연결 Pointer로 적은 data만 관리 / Linux 기준 24개 필드",
          ],
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
    defShort: "프로세스 정보를 기록·관리하는 자료구조",
    keywords: [
      "PID(프로세스 식별자)",
      "프로세스 상태",
      "프로그램 카운터",
      "레지스터 저장 영역",
      "프로세서 스케줄링 정보",
      "계정 정보",
      "입출력 상태 정보",
      "메모리 관리 정보",
    ],
    tables: [
      {
        caption: "PCB 구성 정보 (식상카레스계입메)",
        headers: ["항목", "내용", "비고"],
        rows: [
          ["PID(프로세스 식별자)", "각 프로세스에 대한 고유 식별자", "숫자, 색인 항목"],
          ["프로세스 상태", "생성, 준비, 실행, 대기, 중단 등의 프로세스 상태", "Process Status Register"],
          ["프로그램 카운터", "프로세스 실행을 위한 다음 명령의 주소 표시", "PC Register / Jump"],
          [
            "레지스터 저장 영역",
            "누산기, 인덱스 레지스터, 범용 레지스터, 조건 코드 등에 관한 정보 / 컴퓨터 구조에 따라 다른 형태 / 인터럽트가 발생 시 프로그램 카운터와 함께 저장, 다시 실행 시 원상 복귀",
            "AC, ISR, MBR, MAR, AX, CX",
          ],
          ["프로세서 스케줄링 정보", "우선순위, 스케줄링 큐 포인터, 스케줄 매개변수", ""],
          [
            "계정 정보",
            "프로세서 사용시간, 실제 사용시간, 사용 상한시간, 계정 정보, 작업이나 프로세스 번호 등",
            "AC",
          ],
          [
            "입출력 상태 정보",
            "입출력 요구 프로세스에 할당된 입출력 장치, 개방된 파일 목록",
            "I/O 장치 리스트 / Open된 파일정보",
          ],
          [
            "메모리 관리 정보",
            "메모리 영역 정의에 필요한 상한/하한 레지스터(경계 레지스터) 또는 페이지 테이블 정보",
            "Page, Segment Table / Cache address",
          ],
        ],
      },
    ],
    notes: [
      "Program이 실행되면 Process가 생성되며, Process Address Space에 'code', 'data', 'stack'이 만들어짐",
      "이 Process의 Metadata들은 PCB에 저장됨",
      "Process Management란 말은 곧 PCB Management말과 의미가 일치",
      "PCB 구조: Pointer | Process state / Process ID(Unique ID) / Program counter(Next program that run) / Registers / Memory Limits / Accounting(Log INFO about process) / List of open file",
    ],
  },
  {
    topicId: "os-54",
    title: "멀티 쓰레드(Multi-Thread)",
    course: "OS",
    definition:
      "하나의 Processor 내에서 둘 이상의 흐름(Thread)이 동시에 존재하며 독립적으로 실행될 수 있는 구조",
    defShort: "한 프로세스 안에 여러 실행 흐름이 독립 실행되는 구조",
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
          ["Single Thread", "하나의 쓰레드만 실행", "한 번에 한 명령어 흐름만 수행, CPU 활용률 낮음"],
          [
            "Interleaved Multithreading (IMT)",
            "여러 쓰레드의 명령어를 시간 단위로 번갈아 실행",
            "하나의 클록 사이클마다 다른 쓰레드 명령어 선택, 쓰레드가 CPU를 나눠 사용, 한 사이클에 하나의 명령만 실행",
          ],
          [
            "Blocked Multithreading (BMT)",
            "한 쓰레드가 메모리 지연 등으로 블록되면 다른 쓰레드 실행",
            "CPU가 블록될 때만 다른 쓰레드 실행, IMT보다 CPU 활용률 낮음",
          ],
          [
            "Simultaneous Multithreading (SMT)",
            "여러 쓰레드의 명령어를 같은 클록 사이클에 동시에 실행",
            "파이프라인과 실행 유닛 공유, CPU 활용률 극대화, Hyper-Threading이 대표적",
          ],
          [
            "Chip Multiprocessing (CMP)",
            "하나의 칩에 다수의 독립적인 코어가 존재, 각각 쓰레드 독립 실행",
            "물리적 코어 여러 개, 완전히 병렬 처리 가능, SMT와 달리 각 코어 별 실행 유닛 독립",
          ],
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
    defShort: "파일·디렉터리를 계층 트리로 조직·관리하는 구조",
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
          ["부트 블록(Boot Block)", "운영체제 부트 또는 초기화 Bootstrap 코드를 저장하는 공간"],
          [
            "슈퍼 블록(Super Block)",
            "파일 시스템 크기, 블록 수 등 파일 시스템을 기술하는 정보(메타데이터)를 저장 / 슈퍼 블록의 자료 구조, 파일 시스템의 크기, 블록의 수, 이용가능한 빈 블록 목록, 빈 블록 목록에서 그 다음의 빈 블록을 가리키는 인덱스 등의 정보",
          ],
          ["아이노드 (i-node)", "파일이나 디렉토리에 대한 모든 정보를 가지고 있는 구조"],
          ["데이터 블록 (Data Block)", "실제 데이터가 저장되어 있는 파일 형태"],
        ],
      },
      {
        caption: "유닉스 파일의 종류",
        headers: ["종류", "설명"],
        rows: [
          [
            "루트 파일 시스템",
            "하드디스크 상에 적어도 하나의 파일 시스템 존재 / 시스템 프로그램과 디렉토리들이 포함",
          ],
          [
            "일반 파일",
            "컴퓨터가 수행 가능한 프로그램 파일이나, 원시 프로그램 파일, 텍스트, 데이터 파일 등",
          ],
          [
            "디렉토리 파일",
            "다른 파일과 디렉토리 들에 관한 정보를 저장하는 논리적 단위 / 파일명인 문자열과 inode 번호를 연결하는 부분",
          ],
          ["특수 파일", "주변 장치에 연결된 파일로 하나 이상의 특수 파일을 소유"],
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
    defShort: "파일 속성과 저장 위치를 관리하는 메타데이터 구조체",
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
          [
            "Attribute(기본 정보)",
            "mode, 소유자 식별자, 그룹소유자 식별자, 파일접근 허가권한, Disk 실 주소, 파일 크기, 최초 생성 시기, 최종 사용 시기, 최종 수정 시기, 파일 링크 수, 파일 종류",
          ],
          [
            "Index(data 정보)",
            "direct blocks(직접 블록), single indirect block(단일 간접 블록), double indirect block(이중 간접 블록), triple indirect block",
          ],
        ],
      },
      {
        caption: "새로운 파일에 i-node를 할당하는 과정",
        headers: ["구분", "설명"],
        rows: [
          [
            "자유 i-node 할당",
            "① 가장 마지막으로 슈퍼블록에 저장된 i-node를 기억된 i-node라고 함 ② 커널은 디스크 i-node를 할당할 때마다 슈퍼블록의 자유 i-node 계수(인덱스)를 감소 ③ i-node에 대한 인덱스를 19로 감소시키고 다음 i-node 48을 반환",
          ],
          [
            "자유 i-node 저장 (자유 i-node가 빈 경우)",
            "① 자유 i-node 목록이 비어있는 경우, 기억된 i-node의 470부터 디스크를 탐색하여 자유 i-node 목록을 채움 ② 마지막 i-node 번호(535)를 기억함(기억된 i-node) ③ 커널은 가져온 i-node(471)을 배정하고 계속 진행",
          ],
        ],
      },
      {
        caption: "i-node를 반납하는 과정",
        headers: ["번호", "설명"],
        rows: [
          ["①", "파일시스템에서 사용 가능한 i-node의 수를 증가"],
          [
            "②",
            "반납된 i-node와 기억된 i-node번호를 비교하여 반납된 i-node 번호가 기억된 i-node 번호보다 낮은 경우는 반납된 i-node 번호를 기억하고 이전에 기억된 i-node 번호를 슈퍼블록에서 제거(커널은 항상 리스트의 제일 마지막 i-node가 기억된 i-node가 되도록 슈퍼 블록의 리스트를 유지)",
          ],
          [
            "③",
            "(a) 자유 i-node 목록에 공간이 없으면 반납된 i-node 번호와 다음의 디스크 탐색을 시작할 기억된 i-node 비교",
          ],
          ["④", "(b) i-node 499를 반납하면 499를 기억하는 i-node로 만들고 535를 i-node 목록에서 제거함"],
          [
            "⑤",
            "(c) 자유 i-node 목록이 모두 소진되고 커널이 i-node 601을 반납하면 자유 i-node 목록에는 변함이 없음(커널이 나중에 슈퍼블록의 자유 i-node목록을 모두 사용하면 499에서부터 다시 디스크를 검색하며 535와 601을 찾음)",
          ],
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
    defShort: "실행 중인 프로세스들이 데이터를 교환하는 메커니즘",
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
        headers: ["기법", "설명"],
        rows: [
          [
            "공유 메모리(Shared Memory)",
            "커널이 관리하는 공유 메모리 영역을 여러 프로세스가 자신의 주소 공간에 매핑하여 직접 읽고 쓰는 방식. 커널을 거치지 않으므로 가장 빠르나, 동시 접근 시 동기화(세마포어 등) 처리가 반드시 필요",
          ],
          [
            "메모리 맵(Map Memory, mmap)",
            "파일을 프로세스의 가상 메모리 주소 공간에 매핑하여, 파일 I/O 대신 메모리 접근으로 데이터를 공유하는 방식. 대용량 데이터 공유에 유리",
          ],
        ],
      },
      {
        caption: "메시지 전달 방식",
        headers: ["기법", "설명"],
        rows: [
          [
            "파이프(Pipe)",
            "부모-자식처럼 혈연 관계가 있는 프로세스 간 단방향 통신. 커널이 제공하는 버퍼를 통해 한쪽은 쓰고 한쪽은 읽음",
          ],
          [
            "네임드 파이프(Named Pipe, FIFO)",
            "파일 시스템에 이름을 가진 특수 파일로 생성되어, 혈연 관계가 없는 프로세스 간에도 통신 가능. 기본은 단방향",
          ],
          [
            "메시지 큐(Message Queue)",
            "커널이 관리하는 큐에 메시지를 타입과 함께 넣고 꺼내는 방식. 비동기 통신이 가능하며 메시지 단위로 구분되어 처리",
          ],
          [
            "소켓(Socket)",
            "네트워크 프로토콜(TCP/UDP) 기반의 양방향 통신. 동일 호스트뿐 아니라 원격 호스트의 프로세스와도 통신 가능",
          ],
          [
            "시그널(Signal)",
            "특정 이벤트 발생을 프로세스에 비동기적으로 알리는 소프트웨어 인터럽트. 데이터 전달이 아닌 이벤트 통지 용도",
          ],
        ],
      },
      {
        caption: "공유 메모리와 메시지 전달 방식의 비교",
        headers: ["구분", "공유 메모리 방식", "메시지 전달 방식"],
        rows: [
          [
            "개념",
            "여러 프로세스가 동일한 메모리 영역을 공유하여 직접 데이터 교환",
            "커널이 제공하는 통신 채널을 통해 메시지를 주고받아 데이터 교환",
          ],
          [
            "대표 기법",
            "공유 메모리, 메모리 맵(mmap)",
            "파이프, 네임드 파이프, 메시지 큐, 소켓, 시그널",
          ],
          [
            "속도",
            "빠름 (커널 개입 없이 메모리에 직접 접근)",
            "상대적으로 느림 (커널을 경유하며 복사 발생)",
          ],
          [
            "충돌",
            "동시 접근에 의한 충돌 가능 → 동기화 기법 필수",
            "커널이 순서를 보장하므로 충돌 위험 낮음",
          ],
          [
            "크기",
            "대용량 데이터 교환에 적합",
            "비교적 소량의 메시지 교환에 적합",
          ],
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
    defShort: "디스크 헤드의 최적 이동 경로를 결정하는 기법",
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
          [
            "FCFS(First Come First Serve)",
            "요청이 들어온 순서대로 헤드 처리",
            "요청 순서를 그대로 처리",
            "구현이 단순, 공정성 보장",
            "평균 응답시간↑, 헤드 이동 비효율",
          ],
          [
            "SSTF(Shortest Seek Time First)",
            "가장 가까운 트랙 요청을 우선 처리",
            "현재 헤드 위치에서 가장 가까운 트랙의 요청을 선택",
            "평균 탐색 시간↓, 효율적",
            "앞 뒤 요청 균등↑, 멀리 있는 요청은 기아(Starvation) 가능",
          ],
          [
            "SCAN(엘리베이터 알고리즘)",
            "헤드가 한 방향으로 이동하며 요청 처리",
            "헤드가 끝까지 이동하며 경로상 요청 처리 후 방향 전환",
            "응답시간 균등, FCFS보다 효율적",
            "앞 끝까지 이동하므로 불필요한 이동 발생",
          ],
          [
            "N-Step SCAN",
            "SCAN의 변형, 요청을 일정 크기 그룹(N)으로 나눠 처리",
            "요청들을 N개씩 묶어 배치, 각 그룹을 SCAN 방식으로 처리(신규 요청 나중 처리)",
            "긴 요청 큐에서도 응답시간 예측 가능",
            "그룹화로 인해 일부 요청 지연 가능",
          ],
          [
            "C-SCAN(Circular SCAN)",
            "SCAN을 원형으로 확장한 방식",
            "한쪽 방향으로만 이동, 끝에 도달하면 처음으로 되돌아감",
            "요청 처리 균일, 응답시간 예측 쉬움",
            "되돌아가는 경로에서 요청 무시 → 이동 낭비",
          ],
          [
            "LOOK",
            "SCAN 개선: 요청이 있는 범위까지만 이동",
            "요청이 있는 마지막 위치까지만 이동 후 방향 전환",
            "불필요한 헤드 이동 감소",
            "SCAN보다 효율적이지만 여전히 지연 가능",
          ],
          [
            "C-LOOK",
            "C-SCAN 개선: 요청이 있는 범위까지만 이동",
            "한쪽 방향으로만 이동, 요청이 끝나면 가장 처음 요청으로 점프",
            "응답시간 균일, 이동 효율적",
            "점프 시 거리가 멀면 응답 지연 가능",
          ],
          [
            "SLTF(Shortest Latency Time First)",
            "같은 트랙 내에서 회전 지연 최소화",
            "현재 트랙에서 가장 빨리 도달 가능한 섹터 선택",
            "회전 대기↓, 빠른 응답",
            "여러 트랙 요청 시 효과 제한적",
          ],
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
    defShort: "비용·편익 측정으로 프로젝트 수행 여부를 결정하는 분석 기법",
    keywords: ["비용편익비율(BCR)", "투자회수기간(PP)", "내부수익률(IRR)", "순현재가치(NPV)"],
    tables: [
      {
        caption: "경제성 분석 기법",
        headers: ["기법", "설명"],
        rows: [
          ["비용편익비율(BCR)", "수익/비용 비율. BCR = Benefit / Cost = 수익(PV Benefits) / 비용(PV Costs). 1보다 크면 클수록 좋음. 예) $50 투자해 $100 수익이면 BCR = 2"],
          ["투자회수기간(PP)", "투자한 현금을 모두 회수하는 데 걸리는 기간. 투자회수기간 = 프로젝트 투자비용 / 연간 현금 흐름. 계산이 편하나 화폐의 시간가치와 회수기간 이후 현금흐름을 무시. PP가 길면 리스크 증가"],
          ["순현재가치(NPV)", "미래 현금흐름(cash flow)을 현재 기준으로 환산한 수익과 투자금액의 차이. NPV = Σ Ct/(1+r)^t − Co"],
          ["내부수익률(IRR)", "투자안의 미래 현금유입의 현재가치를 현금유출의 현재가치와 같게 만드는 할인율. 즉 NPV = 0 을 만족시키는 r 값"],
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
    defShort: "계획·실행·통제·종료 방법을 명시한 통합 관리 문서",
    keywords: ["개요", "업무", "일정", "인력", "교육", "통제", "품질", "인수", "측정"],
    tables: [
      {
        caption: "목차 (개업일인교통품인측)",
        headers: ["목차", "설명"],
        rows: [
          ["프로젝트 개요", "프로젝트에 대한 전반적인 내용 설명"],
          ["프로젝트 업무 범위", "프로젝트 업무에 대한 명확한 정의 수립"],
          ["일정계획", "납기 정상 달성을 목표로 프로젝트 작업에 대한 일정 수립"],
          ["인력관리", "프로젝트 인력에 대한 관리"],
          ["교육계획", "프로젝트 인력 또는 고객에 대한 교육계획"],
          ["프로젝트 통제", "프로젝트 이슈사항 및 상황 모니터링을 통한 예방 및 통제"],
          ["품질활동 계획", "정기적/비정기적 품질활동에 대한 계획 수립"],
          ["인수 조건", "프로젝트 종료 시에 인수에 대한 조건을 설명"],
          ["측정 계획", "검수를 위해 성과 측정을 위한 계획 수립"],
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
    defShort: "프로젝트에 필요한 작업 범위와 산출물을 정의·관리하는 영역",
    keywords: ["범위 관리 계획수립", "요구사항 수집", "범위 정의", "작업분류체계(WBS) 작성", "범위 확인", "범위 통제"],
    tables: [
      {
        caption: "세부 프로세스 및 주요 산출물",
        headers: ["세부 프로세스", "내용 / 주요 산출물"],
        rows: [
          ["범위 관리 계획 수립", "프로젝트에서 범위를 어떻게 관리할 것인가에 대한 절차와 방법을 정의 / 범위관리 계획서, 요구사항관리 계획서"],
          ["요구사항 수집", "이해관계자의 요구사항을 수집, 문서화 / 요구사항 문서, 요구사항 추적 매트릭스"],
          ["범위 정의", "제품이나 서비스의 범위 기술서를 개발하는 프로세스 / 범위기술서(project scope statement)"],
          ["WBS 작성", "고객이 요구하는 최종 인도물을 제공하기 위하여 작업을 계층적으로 정의한 문서 / WBS, 범위 기준선"],
          ["범위 확인", "검증된 인도물을 고객이나 스폰서의 승인을 획득하는 프로세스(공식적) / 승인된 인도물(Accepted deliverables)"],
          ["범위 통제", "범위 기준선의 변경사항 관리 / 변경요청(CR)"],
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
    defShort: "이해관계자의 기능·비기능 요구를 수집·정의하는 기법",
    keywords: ["데이터 수집", "데이터 분석", "데이터 표현", "의사 결정", "대인관계와 팀 스킬", "기타 기법"],
    tables: [
      {
        caption: "요구사항 수집기법",
        headers: ["구분", "수집 기법", "설명"],
        rows: [
          ["데이터 수집", "인터뷰", "이해관계자와 직접 대화를 통해 정보 수집"],
          ["데이터 수집", "포커스 그룹(핵심전문가 그룹)", "선별된 전문가 집단으로 대화식 토론을 통해 정보 수집"],
          ["데이터 수집", "설문지 및 설문조사", "다수의 대상자에게 질문지를 통해 정보 수집"],
          ["데이터 수집", "벤치마킹", "경쟁사, 선진사례 참조하여 유사한 수준의 효과를 낼 수 있는 요구사항 정의"],
          ["데이터 수집", "브레인스토밍", "팀원간 아이디어를 회의를 통하여 정보 수집"],
          ["데이터 분석", "문서 분석", "고객의 RFP나 현 시스템, 프로세스 문서를 참고하여 정보 수집"],
          ["데이터 표현", "마인드 매핑", "개별 브레인스토밍을 통해 창출된 아이디어를 하나의 맵에 통합하여 정의"],
          ["데이터 표현", "친화도", "아이디어를 몇 개의 그룹으로 분류하는 기법(관련성, 친밀감 구분)"],
          ["의사 결정", "다기준 의사결정 분석", "체계적인 분석방법에 의해 의사결정 매트릭스를 제공하는 방법"],
          ["의사 결정", "투표", "만장일치(Unanimity) 등을 통하여, 평가 및 단체 의사결정기법"],
          ["대인관계와 팀 스킬", "명목 집단 기법", "아이디어의 우선순위를 매길 때, 투표 방식을 적용하여 기존 브레인스토밍을 강화하는 기법"],
          ["대인관계와 팀 스킬", "관찰", "개인의 업무처리 방법이나 절차에 대해 직접적으로 관찰하는 방법"],
          ["대인관계와 팀 스킬", "촉진", "집중 토론, 적극적 대화 참여 유도"],
          ["기타 기법", "프로토타입", "실제 제품의 개발 전에 주요 기능을 중심으로 모형을 만들어 요구사항을 조기에 수집하는 기법"],
          ["기타 기법", "컨텍스트 다이어그램", "프로세스, 장비, 시스템으로 구성된 컨텍스트 다이어그램을 통해 시스템과 사용자의 상호작용을 가시화하여 요구사항 정의하는 기법"],
          ["기타 기법", "전문가 판단", "비즈니스에 대한 전문가 및 도메인에 대한 전문가가 판단"],
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
    defShort: "분석~유지 단계의 검토·평가·승인 기준이 되는 문서",
    keywords: ["명세원리", "작성시 유의사항", "목차"],
    tables: [
      {
        caption: "명세 원리 (명완검일수추개)",
        headers: ["구분", "설명"],
        rows: [
          ["명확성", "각각의 요구사항 명세 내용은 하나의 의미만을 가져야 함"],
          ["완전성", "기능, 성능, 속성, 인터페이스, 설계제약 등에 관한 모든 시스템 요구사항이 포함되어야 함"],
          ["검증가능성", "요구사항 내용의 충족여부와 달성 정도의 확인이 가능해야 함"],
          ["일관성", "명세 내용 간의 상호간 모순이 없어야 함"],
          ["수정용이성", "요구사항 변경 시 쉽게 수정할 수 있어야 함"],
          ["추적성", "각 요구사항 근거에 대한 추적과 상호 참조가 가능하여야 함"],
          ["개발 후 이용성", "시스템 개발 후 운영 및 유지보수에 효과적으로 이용 가능하여야 함"],
        ],
      },
      {
        caption: "작성시 유의사항 (이상기제테품)",
        headers: ["구분", "설명"],
        rows: [
          ["이해성", "사용자, 개발자 쉽게 이해 가능하도록 작성"],
          ["상호성", "개발자, 사용자 쌍방 동의 및 이해 필요(계약 서명 후, 변경 불가를 인지)"],
          ["기능정의", "목표 시스템의 모든 기능 정확히 기술"],
          ["제약조건", "모든 제약 조건 (시간, 비용, 사용자, HW, 프로그래밍언어 특성)"],
          ["테스트 기준", "시스템 인수 위한 테스트 기준 (기능, 특성, 품질 정량적 기술)"],
          ["품질측정", "시험 가능한 수준의 품질 측정 방법 기술"],
        ],
      },
      {
        caption: "목차 (개요, 범목개제, 기외성논DB속성하기)",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["개요", "범위(Scope)", "명세서가 다루는 시스템의 요구사항에 대한 범위를 기술"],
          ["개요", "목적(Purpose)", "명세서의 작성 목적을 기술"],
          ["개요", "시스템 개요(System)", "시스템 전반적인 내용을 요약하여 기술"],
          ["개요", "일반 제약사항(Constraints)", "다른 표준이나 하드웨어 제한으로 인해 적용되는 제한사항에 대하여 기술"],
          ["기능적 요구사항", "기능요구사항(Functional Requirement)", "소프트웨어의 입력 처리와 출력을 생성하는 처리 과정에서 발생할 수 있는 기본적인 동작에 대하여 기술"],
          ["기능적 요구사항", "외부 인터페이스 요구사항", "모든 소프트웨어 시스템으로의 입력과 출력에 대한 요구사항을 상세히 기술"],
          ["기타 요구 및 제약사항", "성능 요구사항(Performance Requirement)", "소프트웨어 전체적으로 사람과의 상호작용 혹은 소프트웨어에서 확인할 수 있는 정적이고 동적인 수치적 요구사항을 기술"],
          ["기타 요구 및 제약사항", "논리적 데이터베이스 요구사항", "데이터 베이스에서 사용될 정보를 위한 논리적 요구사항에 대하여 기술"],
          ["기타 요구 및 제약사항", "소프트웨어 시스템 속성(Software System Attribute)", "신뢰도(Reliability), 사용가능성(Availability), 보안(Security), 유지보수(Maintainability), 이식성(Portability) 등"],
          ["기타 요구 및 제약사항", "HW 요구 사항", "기억 장치 규모, 통신 수용도 등의 필요 요구사항 기술"],
          ["인수 조건", "기능 및 성능 시험", "최종 개발 산출물에 대해 인수 확인을 위한 테스트 항목"],
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
    defShort: "실행할 작업을 인도물 중심 계층구조로 세분한 계층도",
    keywords: ["Work Package", "Plan Package", "100% rule", "Control Account", "Code of Account", "3~5수준"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["작업 패키지(Work Package)", "측정 및 관리 가능한 단위의 WBS 최하위의 구성요소로 일반적으로 80시간 내외 작업의 크기로 분할"],
          ["계획 패키지(Planning Package)", "작업이 시작 및 관리되지 않은 계획 중인 패키지 단위"],
          ["작업분류체계 사전(WBS Dictionary)", "작업 패키지의 세부 내용을 설명하는 요소로 작업 내용, 자원 요구사항, 일정, 원가, 산출물, 작업 완료 기준, 인수 기준 등의 정보를 관리함"],
          ["작업분류체계 코드(Code of Account)", "WBS 요소를 유일하게 식별할 수 있는 고유 식별자, WBS ID라고도 불림 (1.x.x)"],
          ["통제 계정(Control Account)", "작업 패키지의 묶음으로, 각 통제계정에는 작업패키지가 여러 개 포함될 수 있지만, 각 작업 패키지는 한 개의 통제계정에 연결되어야 함"],
          ["RAM (Responsibilities Assignment Matrix)", "각 작업 패키지 별로 담당자를 정의 및 관리. 각 할당자 별로 각 Phase별 승인과 R(Review), 품질 검토자, I(Input), 투입물 책임자, P(Participant)등의 기초가 됨"],
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
    defShort: "요구 증가(크리프)와 임의 기능 추가(도금)의 범위관리 실패",
    keywords: ["통제 되지 않은 요구사항 관리", "고객이 요구한 것 이상으로 기능이나 특성을 추가"],
    tables: [
      {
        caption: "Scope Creep 과 Gold Plating 비교",
        headers: ["구분", "Scope Creep", "Gold Plating"],
        rows: [
          ["정의", "요구사항에 대한 관리 오류로 인해 시간, 원가, 자원 조정 없이 진행되는 통제되지 않은 프로젝트 범위 확장", "고객이 요구한 것 이상으로 범위 이외의 기능이나 특성을 추가하여 비용과 일정을 초과하는 낭비현상"],
          ["원인", "프로젝트 범위관리 실패", "프로젝트 품질관리, 요구사항 확인 실패"],
          ["현상", "프로젝트 예산 조기 소모/초과", "불필요한 개발로 시간, 비용의 낭비"],
          ["영향", "프로젝트 범위, 시간, 자원 과다 소모", "불필요한 기능, 과도한 품질 양산"],
          ["추가요청", "리뷰와 승인 통한 변경요구 허용", "PM 승인 없는 기능추가 금지"],
          ["범위관리", "명확하고, 확고한 범위 명세 정립", "품질목표와 측정방법 정의, 품질 측정"],
        ],
      },
      {
        caption: "Scope Creep 방지방안",
        headers: ["방안", "설명"],
        rows: [
          ["프로세스 개발", "범위 추가를 위한 프로세스 개발"],
          ["서비스 범위 확정", "명확하게 정의된 서비스 범위 및 추정치 개발"],
          ["고객 요구 확정", "확정된 서비스 범위에 대한 고객 요구 사항 최종 확인"],
          ["공식 범위 체결", "프로젝트 범위와 프로젝트 팀 간의 결약 체결"],
          ["타임 시트 기입", "타임 시트 등을 활용한 추가 서비스에 대한 목록 기입"],
        ],
      },
    ],
  },
  {
    title: "활동기간 산정기법",
    course: "PM",
    definition: "한정된 자원으로 각 활동을 수행하는데 소요될 기간을 추정하는 기법",
    defShort: "한정된 자원으로 활동 소요 기간을 추정하는 기법",
    keywords: ["전문가 판단", "유사 산정", "모수 산정", "3점 산정", "상향식 산정", "데이터 분석", "의사 결정", "미팅"],
    tables: [
      {
        caption: "활동기간 산정기법 (전유모3상데의미)",
        headers: ["산정 기법", "설명"],
        rows: [
          ["전문가 판단", "과거 유사 프로젝트 수행 정보를 활용, 교육 수강한 전문가를 통해 활동 기간을 산정하는 방법"],
          ["유사 산정", "프로젝트의 기간, 규모, 복잡도 같은 특성을 고려하여 과거 유사한 프로젝트의 실제 기간을 참조하여 산정하는 방법. 상세한 정보가 제한적일 때 유용"],
          ["모수 산정", "수집 또는 보유한 과거 실적 데이터를 기반으로 수학적인 함수를 정의하여 산출하는 방법"],
          ["3점 산정", "낙관치(Optimistic), 비관치(Pessimistic), 평균치(most likely) 산정 값의 평균을 계산하여 기간을 산정하는 방법"],
          ["상향식 산정", "WBS 최하위 단위의 구성요소에서 기간과 원가를 산정하는 기법"],
          ["데이터 분석", "대안 분석(Alternatives Analysis) — 자동/수동 구현, 자체 개발, 위탁 개발 등 대안 판단 / 예비 분석(Reserve Analysis) — 기간 산정의 불확실성을 대비해 위험을 고려하여 우발 사태를 대비하는 기간(버퍼)을 전체 일정에 포함하는 방법"],
          ["의사 결정", "Fist to Five 기법(손가락 거수법)을 통한 강한 반대부터 적극적인 지지까지 바로 사용할 수 있음"],
          ["미팅", "활동 산정을 위한 미팅"],
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
    defShort: "낙관치·비관치·평균치로 일정을 산정하는 기법",
    keywords: ["낙관치", "비관치", "평균치"],
    tables: [
      {
        caption: "3점 산정 기법 구성요소",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["추정치 요소", "낙관치(o)", "Optimistic : 낙관적 추정치"],
          ["추정치 요소", "평균치(m)", "Most likely : 가능성 가장 높은 추정치"],
          ["추정치 요소", "비관치(p)", "Pessimistic : 비관적 추정치"],
          ["계산식 종류", "삼각분포", "Triangular Distribution : tE = (tO + tM + tP) / 3"],
          ["계산식 종류", "베타분포", "Beta Distribution : tE = (tO + 4tM + tP) / 6"],
          ["계산식 종류", "표준편차", "sigma = (p−o) / 6, 1~3sigma : 신뢰도 68%, 95%, 99%, 분산 = ((비관치 − 낙관치)/6)^2"],
        ],
      },
      {
        caption: "3점 산정기법과 모수 산정, 유사 산정의 비교",
        headers: ["구분", "3점 추정", "모수 산정", "유사 산정"],
        rows: [
          ["개념", "PERT개념", "수집 데이터 기반 통계관계", "이전 유사한 사례 참조"],
          ["특징", "위험 고려함", "수학적 원리", "과거 사례 이용"],
          ["도구", "O/M/P", "Data Parameter", "기존 프로젝트"],
          ["장점", "일정산정 위험 최소화", "수학적모형 정량적 산출", "신속히 파악 유리"],
          ["사례", "불확실성 높은 프로젝트", "선례정보 활용가능 프로젝트", "유사한 프로젝트"],
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
    defShort: "시간·비용을 고려해 최소 기간을 결정하는 네트워크 분석",
    keywords: ["CP (Critical Path, 임계경로)", "ES", "EF", "LS", "LF", "Free float", "Total float"],
    tables: [
      {
        caption: "절차 및 주 경로 도출방법",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["전진계산(Forward pass)", "ES", "ES = 선행활동의 빠른 종료일(EF) + 1"],
          ["전진계산(Forward pass)", "EF", "EF = 빠른 개시일(ES) + 기간 − 1"],
          ["후행계산(Backward pass)", "LF", "LF = 후행활동의 늦은 개시일(LS) − 1"],
          ["후행계산(Backward pass)", "LS", "LS = 늦은 종료일(LF) − 기간 + 1"],
          ["여유시간 계산(Float)", "TF", "프로젝트 종료일을 지연시키지 않으면서 한 활동이 가질 수 있는 총 여유시간. TF = 늦은 종료일(LF) − 빠른 종료일(EF) = 늦은 개시일(LS) − 빠른 개시일(ES)"],
          ["여유시간 계산(Float)", "FF", "FF = 후행 활동의 빠른 개시일(ES) − 빠른 종료일(EF) − 1 (1일 시작기준)"],
          ["CP", "Critical Path", "여유기간이 '0'인 경로를 연결한 경로"],
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
    defShort: "자원제약 고려, 여유를 통합 버퍼로 묶어 관리하는 기법",
    keywords: ["프로젝트 버퍼(안전, 모니터링, 행동)", "피딩 버퍼", "자원 버퍼"],
    tables: [
      {
        caption: "CCM 버퍼 분류",
        headers: ["종류", "설명"],
        rows: [
          ["프로젝트 버퍼(Project Buffer)", "Critical Chain상의 활동에서 확보한 버퍼를 Critical Chain 끝에 두어 관리 (안전영역: 사용해도 안전한 버퍼 / 모니터링 영역: 버퍼 사용 추이 및 원인을 모니터링 하는 영역 / 행동영역: 버퍼 통제를 위한 조치를 취하는 영역)"],
          ["피딩 버퍼(Feeding Buffer)", "Critical Chain에 연결되는 Non-Critical Chain 끝에 두어 관리. Critical Chain의 작업 착수 지연 방지"],
          ["자원 버퍼(Resource Buffer)", "일종의 경보장치로, critical chain 상의 작업착수 전에 해당자원에게 수행시기를 알려줌"],
        ],
      },
      {
        caption: "CPM과 CCM 비교",
        headers: ["구분", "Critical Path Management", "Critical Chain Management"],
        rows: [
          ["착수일", "ES(Early Start)", "LS(Last Start)"],
          ["관리 관점", "진척율, EVM", "전체 버퍼의 소진율"],
          ["여유시간/버퍼", "각 활동에 여유시간 반영, 활동 사이의 연관관계", "버퍼로 통합하여 관리"],
          ["자원 제약", "Dependency를 고려 일정계획 수립 후 Resource Leveling으로 해소", "자원제약 자체를 계획에 반영"],
        ],
      },
    ],
    notes: ["교재 두음: 프로젝트(안모행) — 안전, 모니터링, 행동 / 프로젝트·피딩·자원 버퍼"],
  },
  {
    title: "일정단축 기법",
    course: "PM",
    definition: "프로젝트 범위 변경 없이 일정 기간을 단축 시키는 기법",
    defShort: "범위 변경 없이 기간을 단축하는 기법(크래싱·패스트트래킹)",
    keywords: ["Crashing(자원 추가)", "Fast Tracking(병행 추진)"],
    tables: [
      {
        caption: "Crashing 과 Fast Tracking 비교",
        headers: ["구분", "Crashing", "Fast Tracking"],
        rows: [
          ["정의", "비용과 시간 사이의 상충 관계를 분석하여 최소한의 자원 추가로 최대 시간 단축 방법을 결정하는 기법", "일정계획 상의 활동 간의 의존성을 조정해서 순서상의 활동을 중첩 진행하여 일정을 단축하는 기법"],
          ["핵심", "자원추가", "작업 병행 추진"],
          ["장점", "유휴 리소스의 효율적 활용 가능", "프로젝트 일정의 Reserve 확보 가능"],
          ["단점", "비용 증가 (원가에 대한 여유가 있을 경우만 적용 가능함)", "재작업의 위험 증가 (대부분 인명 사고가 병행 추진에서 발생함)"],
          ["제약사항", "투입 인력에 여유가 있는 활동이 있어야 함", "Critical Path상의 활동에 적용 불가"],
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
    defShort: "범위·일정·비용을 통합 관리해 최종 성과를 예측하는 기법",
    keywords: ["PV", "EV", "AC", "SV", "CV", "SPI", "CPI", "ETC", "EAC", "VAC", "TCPI"],
    tables: [
      {
        caption: "획득가치 분석",
        headers: ["지표", "설명"],
        rows: [
          ["BAC", "Budget at Completion, 전체 프로젝트 예산"],
          ["PV", "Planned Value, 특정 시점의 계획 비용"],
          ["EV", "Earned Value, 특정 시점의 완료된 업무의 비용"],
          ["AC", "Actual Cost, 특정 시점까지 발생한 실제비용 값"],
        ],
      },
      {
        caption: "차이 분석 · 추세 분석",
        headers: ["지표", "설명"],
        rows: [
          ["SV", "Schedule Variance. 일정 차이. EV−PV. if SV<0, 일정 지연"],
          ["CV", "Cost Variance. 비용 차이. EV−AC. if CV<0, 예산 초과"],
          ["SPI", "Schedule Performance Index. 일정 성과 지표. EV/PV. if SPI<1, 일정 지연"],
          ["CPI", "Cost Performance Index. 비용 성과 지표. EV/AC. if CPI<1, 예산 초과"],
          ["ETC", "Estimates to Completion : 현 시점에서 향후 추가로 발생한 추정 원가. 비정형: (BAC−EV) / 정형: (BAC−EV)/CPI, (BAC−EV)/(CPI*SPI), (BAC−EV)/SPI"],
          ["EAC", "Estimates at Completion (= AC+ETC) 현 시점에서 예측한 종료시의 발생 원가"],
          ["VAC", "Variance at Completion (= BAC − EAC) 종료시의 추가 발생 원가 추정"],
          ["BCWR", "Budgeted Cost for Work Remained (= BAC − EV) 시기별 추정 잔여 업무량"],
          ["TCPI", "To Complete Performance Index 완료 성과 지수. BAC 적용: (BAC−EV)/(BAC−AC) / EAC 적용: (BAC−EV)/(EAC−AC)"],
        ],
      },
      {
        caption: "EVM 분석을 통한 프로젝트 일정, 원가 통제 방안",
        headers: ["구분", "설명", "통제방안"],
        rows: [
          ["일정지연", "SV < 0, SPI < 1", "Crashing, Fast Tracking 수행"],
          ["비용초과", "CV < 0, CPI < 1", "Cost Control, Management 수행"],
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
    defShort: "품질 개발·개선·관리를 위한 7가지 기초 데이터 정리 도구",
    keywords: ["품질통제도구", "현원자", "체파히", "특산층", "관"],
    tables: [
      {
        caption: "현상파악 · 자료관리 · 원인분석",
        headers: ["구분", "도구", "설명"],
        rows: [
          ["현상파악", "체크시트", "종류별로 데이터를 취하거나, 확인 단계에서 누락, 오류 등을 없애기 위해 간단히 체크해서 결과를 쉽게 알 수 있도록 만든 도표"],
          ["현상파악", "파레토 차트", "수집된 데이터를 정리하여 문제의 발생빈도 순으로 나열하여 중요도 파악하여 문제의 중점화, 우선순위 파악을 위한 도구"],
          ["현상파악", "히스토그램", "데이터가 존재하는 범위를 몇 개의 구간으로 나누어서 각 구간에 들어가는 데이터의 발생 빈도수를 체크하여 막대그래프로 작성한 그림으로서 DATA 분포의 형태를 쉽게 파악하는 도구"],
          ["자료관리", "관리도(그래프)", "Process가 통계적 안정 상태인가를 판정하여 공정 내 일정한 품질 수준을 유지하기 위한 도구"],
          ["원인분석", "특성요인도", "결과(특성)와 원인(요인) 어떻게 관계하고 있으며, 영향을 주고 있는가를 한눈으로 알 수 있도록 그린 그림을 이용한 도구"],
          ["원인분석", "산점도", "두 변수에 대해서 특성(결과)과 요인(원인)의 관계를 규명하고 이 관계를 시각적으로 표현해서 파악할 때 사용되는 도구. 강한 정비례 관계(X 증가, Y 증가), 강한 반비례 관계(X 증가, Y 감소), 무 관계"],
          ["원인분석", "층별", "전체 데이터를 두 개 이상의 관련 있는 부분집단으로 나누어 분석함으로써 문제의 가능한 원인을 규명하려는 도구. 층별 이전의 전체 품질 분포와 층별 한 후의 작은 그룹의 품질 분포를 비교함으로써 품질에 영향을 끼치는 원인을 찾아내거나, 그 원인의 품질에 대한 영향의 정도 확인"],
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
    defShort: "형상 항목을 식별하고 변경을 제어·검증하는 활동",
    keywords: ["형상 식별", "형상 통제", "형상 감사", "형상 기록", "기능적", "분배적", "설계", "시험", "제품", "운용"],
    tables: [
      {
        caption: "형상관리 절차",
        headers: ["절차", "세부절차"],
        rows: [
          ["형상관리 준비", "수행 계획 정의 활동 / 형상 관리 표준, 절차 기술"],
          ["형상 식별", "형상 항목의 정의 및 선정 / 기준선, 참조 등 세부 사항 식별"],
          ["형상 통제", "변경 요청에 따른 변경 심사 및 실시, 확인"],
          ["형상 감사", "체크리스트 기반 감사 / 결과 문서화"],
          ["형상 기록", "Repository 기록"],
        ],
      },
      {
        caption: "형상관리 기준선",
        headers: ["SDLC", "기준선", "형상항목"],
        rows: [
          ["계획 단계", "기능적 기준선", "프로젝트 계획서, 개발 표준 및 프로세스"],
          ["요구분석 단계", "분배적 기준선", "요구사항 정의서, 기능분해도, 작업 흐름도, 자료 흐름도"],
          ["설계 단계", "설계 기준선", "기본 설계: 화면 보고서, 명세서 / 상세 설계: ERD, 아키텍처 설계서, 프로그램 설계서"],
          ["개발(구현) 단계", "시험 기준선", "원시 코드, 목적 코드, 실행 코드, 단위 시험 보고서"],
          ["시스템 통합 및 테스트 단계", "제품 기준선", "통합 시험: 통합 시험 계획서, 케이스 / 시스템 시험: 계획서, 케이스 및 보고서"],
          ["설치 및 운영 단계", "운용 기준선", "운영자 지침서, 사용자 지침서, 이관 소스"],
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
    defShort: "예방·평가비용을 높여 실패비용을 줄이는 품질활동 원가",
    keywords: ["적합 품질비용(예방비용, 평가비용)", "부적합 품질비용(내부실패 비용, 외부실패 비용)"],
    tables: [
      {
        caption: "품질 비용",
        headers: ["구분", "항목", "세부 내용"],
        rows: [
          ["적합 품질비용", "예방비용", "결함 예방을 위한 비용"],
          ["적합 품질비용", "평가비용", "제품 품질 확인/검증을 위한 비용"],
          ["부적합 품질비용", "내부실패비용", "제품 인도 전 결함 수정 비용"],
          ["부적합 품질비용", "외부실패비용", "고객에게 인도 후 제품이나 서비스를 수정하는데 드는 비용"],
        ],
      },
      {
        caption: "품질 비용 항목별 사례",
        headers: ["유형", "사례"],
        rows: [
          ["예방비용", "품질 계획, 기획, 데이터 수집/분석, 각종 보고 / 훈련, 문서화, 장비, 개선 일정 / 방법론 수립, 업무 매뉴얼 작성, 팀원교육 / 품질 감사 비용, 시상금, 행사비"],
          ["평가비용", "검사, 파괴 시험(Destructive test) 손실 / SW Test, Review, Inspection / 공정·일정관리 비용"],
          ["내부실패비용", "재작업, Wasted materials(폐기물, 폐기처리) / 대책 검토 비용 / 선별 작업 비용"],
          ["외부실패비용", "법적 책임, 하자보수, 사업손실 / 할인 및 가격(단가) 인하 / 신용 실추, 기회손실 / 긴급대응 비용"],
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
    defShort: "책임·승인·자문·통보 4단계로 역할을 표현한 매트릭스",
    keywords: ["R(Responsible:책임)-실무담당자", "A(Accountable:승인)-의사결정권자", "C(Consult:고려 대상)-업무수행조언자", "I(Inform:통보)-결과보고대상자"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "역할", "설명"],
        rows: [
          ["R(Responsible)", "실무 담당자", "실제로 업무를 수행하는 역할로 주어진 작업을 완수하는 책임을 지고 있으며, 작업을 실행하고 결과를 도출하는 주체"],
          ["A(Accountable)", "의사 결정권자", "해당 작업에 대해 최종적인 책임을 지는 역할로 의사 결정을 내리고, 작업 결과를 승인하거나 검토 수행. 일반적으로 하나의 작업에 대해 단 한 명만 지정"],
          ["C(Consult)", "업무 수행 조언자", "작업 수행에 필요한 정보를 제공하고 작업을 직접 수행하지 않지만, 전문 지식이나 경험을 바탕으로 자문을 제공"],
          ["I(Inform)", "결과 보고 대상자", "작업 결과나 진행 상황을 알려야 하는 사람들로 상황을 인지하고 있어야 하며, 결과를 통보 받고, 필요한 경우 추가적인 의사결정도 가능"],
        ],
      },
      {
        caption: "작성 원칙",
        headers: ["순서", "작성 원칙", "설명"],
        rows: [
          ["1", "한 업무 R에 대한 A가 반드시 존재", "책임만 있고 승인이 없는 업무는 위배"],
          ["2", "한 업무에 대해 A는 반드시 한 주체에 할당", "여러 주체인 경우 의사소통 혼란 초래"],
          ["3", "한 업무에 대해 C와 I는 없어도 무방", "고려 대상과 통보는 필수 역할이 아니며, 없어도 무방"],
          ["4", "R/A, C/I는 한 주체에 동시 할당 가능", "R/A, C/I로 구분해서 한 주체에 할당 가능"],
        ],
      },
    ],
  },
  {
    topicId: "pm-40",
    title: "자원 최적화",
    course: "PM",
    definition: "활동에 분배되는 자원을 최적화 하는 기법",
    defShort: "활동에 분배되는 자원을 최적화하는 기법(평준화·스무딩)",
    keywords: ["Resource Leveling (자원평준화)", "Resource Smoothing (자원 평활화)"],
    tables: [
      {
        caption: "자원 평준화와 자원 평활화 비교",
        headers: ["구분", "자원 평준화 (Resource Leveling)", "자원 평활화 (Resource Smoothing)"],
        rows: [
          ["정의", "한 자원이 동일한 기간에 두 개 이상 활동에 배정된 경우, 특정 자원이 과부하 걸리지 않게 시간에 가용한 수량을 제한하는 경우 사용하는 기법", "프로젝트의 주공정을 변경하지 않으면서 (완료일을 지연하지 않으면서) 자원 한도를 초과하지 않도록 일정 활동을 조정하는 기법"],
          ["구동 조건", "자원의 양에 비해 과도한 작업시간 / 한 자원이 동일한 기간에 두 개 이상 활동에 배정된 경우", "자원간 불균형 발생시 / 주공정의 변화가 없는 조건"],
          ["주공정 변경", "주공정 변경 가능 (보통 일정 증가)", "주공정 변경되지 않음"],
          ["대상 활동", "Total Float이 '0' 이상인 활동", "Free Float와 Total Float 내에서 조정 가능"],
          ["자원 제약 요인", "법정 근무 시간 / 자원의 최대 한계", "프로젝트 관리 시간 / 자원의 최적 활용 한계"],
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
    defShort: "욕구·보상에 따른 행동과 성과를 분석하는 이론",
    keywords: ["내용 이론", "과정 이론", "강화 이론"],
    tables: [
      {
        caption: "동기부여 이론 유형 (내과강)",
        headers: ["이론", "관점", "설명"],
        rows: [
          ["내용 이론", "What", "동기부여 시키는 것이 무엇인가를 다루는 이론"],
          ["과정 이론", "How", "그 과정이 어떻게 이루어 지는가를 다루는 이론"],
          ["강화 이론", "Why", "동기부여 과정이 왜 일어나는가를 다루는 이론"],
        ],
      },
      {
        caption: "동기부여 이론 상세 설명 (매5 허투 맥스 맥3 기목공 스키너)",
        headers: ["이론", "상세이론", "설명"],
        rows: [
          ["내용 이론", "매슬로우 욕구 5단계 이론", "하위욕구 충족 시 상위욕구 추구. 생리적 < 안전 < 사회적 < 존경 < 자아실현 [생안사존자]"],
          ["내용 이론", "허즈버그 2요인 이론", "불만족과 만족의 유발요인은 다르다. 위생요인(불만족), 동기요인(만족—책임감 존경) [위동]"],
          ["내용 이론", "맥그리거 X, Y이론", "X(본래 미숙 / 소극적, 수동적, 타율적) 이론 / Y(본래 성숙 / 적극적, 능동적, 창의적) 이론"],
          ["내용 이론", "맥클랜드 욕구 이론", "성취욕구, 친교(결연)욕구, 권력욕구 [성결권]"],
          ["과정 이론", "기대 이론", "보상, 도구, 기대감 존재 시 동기유발"],
          ["과정 이론", "목표설정 이론", "분명한 목표 수립 시 동기유발"],
          ["과정 이론", "공정성 이론", "공정한 평가와 보상이 이루어져야 한다"],
          ["강화 이론", "스키너", "사람의 행동이 환경적인 결과에 의하여 결정. 긍정적 강화(보상 부여 — 인센티브, 칭찬), 부정적 강화(기분이 상하거나 해가 되는 자극 부여), 소거(특정 행위를 없애는 방법), 처벌(부정적 결과 제공 — 비판, 급여 삭감 등)"],
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
    defShort: "형성·스토밍·표준화·수행·해산의 팀 개발 5단계 모델",
    keywords: ["형성", "스토밍", "표준화", "수행", "해산"],
    tables: [
      {
        caption: "단계별 설명 (형스표수해)",
        headers: ["단계", "설명"],
        rows: [
          ["형성", "프로젝트 이해단계 (팀원: 독립적, PM: 팀 결속력, 단결노력)"],
          ["스토밍", "갈등발생 (팀: 개인 간 대립/갈등, 팀원: 각자의 개성표현, PM: 포용력 필요)"],
          ["표준화", "신뢰형성, 책임감 공유 (팀: 팀 정체성, 팀원: 조화, PM: 자율과 참여)"],
          ["수행", "프로젝트 성공적 진행 (팀: 하나의 기능, 효과적, 팀원: 자율적, 역량발휘, PM: 권한위임)"],
          ["해산", "마무리, 해산 (Lessons Learned)"],
        ],
      },
      {
        caption: "단계별 상세 설명",
        headers: ["구분", "형성기(Forming)", "격동기(Storming)", "표준화(Norming)", "수행(Performing)"],
        rows: [
          ["주요 관심", "서로에 대한 인식", "갈등 처리", "협력 관계 구축", "생산성 향상"],
          ["과업 목표", "열성", "역할 명료화", "몰입", "성취"],
          ["관계 상 목표", "수용", "소속감", "지원", "자긍심"],
          ["주요 딜레마", "회의감 vs. 안정감", "동질감 vs. 이질감", "지원 vs. 간섭", "관심 vs. 고립"],
          ["필요한 리더십", "지시형(Direct)", "지도형(Coach)", "참여형(Participate)", "위임형(Delegate)"],
          ["필요한 행동", "팀 방향성 정립", "계획 및 역할 명료화", "업무 및 역할 몰입", "수행관리 및 평가"],
        ],
      },
    ],
  },
  {
    title: "갈등관리",
    course: "PM",
    definition:
      "갈등: 목적, 이해 또는 아이디어 등과 관련하여 구성원 사이에 강한 불합의나 불일치가 있는 현상",
    defShort: "구성원 간 불일치를 해결하는 관리 기법(철회~협력 5가지)",
    keywords: ["강요", "철회", "상대 의견 수용", "양쪽 의견 타협", "문제 해결"],
    tables: [
      {
        caption: "갈등 요인",
        headers: ["갈등요인", "설명"],
        rows: [
          ["일정", "일정에 대한 팀원 상호 간 동의(Commitment) 부족 시 갈등 발생"],
          ["프로젝트 우선순위", "자원할당, 위험관리 등에서 발생하는 프로젝트 우선순위의 이견 갈등"],
          ["자원", "조직 차원만이 아닌 프로젝트에서도 우수한 혹은 한정된 인적자원을 서로 차지하려는 갈등"],
          ["기술적 옵션", "기술적 방법이 다를 경우 갈등 발생"],
          ["관리 절차", "관리 절차나 문서작업으로 인한 갈등 발생. 팀원이 불필요하다고 생각하는 문서작업은 대표적인 갈등 원인"],
          ["원가", "프로젝트 경비 부족, 사용방법에 의한 갈등 발생"],
          ["대인 관계", "팀원의 성격 차이에 의한 대인관계에서 갈등 발생"],
        ],
      },
      {
        caption: "갈등 해결방안 상세 설명",
        headers: ["해결방법", "특징", "적용상황"],
        rows: [
          ["Withdrawal(철수/회피)", "낮은 주장, 낮은 협력", "이슈가 사소한 경우 / 추가적인 정보가 필요한 경우 / 자기의 의견이 관철될 가능성이 매우 낮은 경우"],
          ["Smoothing(양보/수용)", "낮은 주장, 높은 협력", "나중을 위하여 신용을 얻고자 하는 경우 / 조화와 안정이 매우 중요한 경우(분위기가 우선일 때) / 이슈가 갈등 상대방에게 보다 중요한 경우"],
          ["Compromising(타협)", "중간 주장, 중간 협력", "목표는 중요하나 더 이상 설득이 힘든 경우 / 비슷한 파워를 가진 집단들 끼리의 갈등인 경우 / 양측이 만족할 수 있는 합의점을 도출할 수 있는 경우"],
          ["Forcing(강요)", "높은 주장, 낮은 협력", "인기 없는 정책이지만 꼭 필요한 정책을 집행할 때 / 긴급한 사안을 결정해야 하는 경우 / 갈등 상대방보다 경쟁우위에 있는 경우"],
          ["Problem Solving(문제해결/대면)", "높은 주장, 높은 협력", "매우 중요한 통합된 의견을 도출하고자 하는 경우 / 공감대를 형성해 지속적인 관계유지가 필요한 경우"],
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
    defShort: "위험 식별·분석·대응으로 프로젝트를 성공시키는 관리 활동",
    keywords: ["계획수립", "위험식별", "정성적 위험분석", "정량적 위험분석", "위험대응 계획수립", "위험대응 실행", "감시 및 통제"],
    tables: [
      {
        caption: "위험관리 절차 상세 설명",
        headers: ["프로세스", "절차", "설명", "산출물"],
        rows: [
          ["계획", "위험관리계획수립", "위험관리 기준과 활동 정의하고 계획", "위험관리 계획서"],
          ["계획", "위험식별", "프로젝트 영향주는 위험 식별과 특성 문서화", "위험 관리대장, 이슈로그"],
          ["계획", "정성적 위험 분석", "위험 발생확률과 영향 평가하여 우선순위 결정", "PJT 문서 갱신"],
          ["계획", "정량적 위험 분석", "위험이 프로젝트 목표에 미치는 영향 수치적분석", "위험 보고서"],
          ["계획", "위험 대응 계획 수립", "긍정적 위험 증대, 부정적 위험 최소화 위한 대응, 처리방안", "변경 요청, PJT 관리계획서 갱신, PJT 문서 갱신"],
          ["실행", "위험 대응 실행", "합의된 위험 대응 계획 실행", "변경 요청, PJT 문서갱신"],
          ["감시 및 통제", "위험 감시 및 통제", "위험 프로세스 효율성 평가", "작업성과정보, PJT문서갱신"],
        ],
      },
      {
        caption: "보헴의 10대 위험 요소",
        headers: ["구분", "위험 요소"],
        rows: [
          ["관리적 위험", "인력부족 / 비현실적 일정 및 예산"],
          ["기술적 위험", "잘못된 기능 구현 / 잘못된 UI 개발"],
          ["요구 사항", "과대포장 / 지속적인 요구사항 변경"],
          ["품질", "외부 기능의 부족 / 외부 작업의 부족 / 실시간 성능 문제점 / 기술적 취약"],
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
    defShort: "발생확률×영향 평가로 위험 우선순위를 정하는 프로세스",
    keywords: ["데이터 수집", "데이터 분석", "데이터 표현", "대인관계 및 팀 기술", "기타 기법"],
    tables: [
      {
        caption: "정성적 위험 분석 기법",
        headers: ["분류", "기법", "설명"],
        rows: [
          ["데이터 수집", "인터뷰", "기밀 보장 유지되는 인터뷰 환경을 조성한다"],
          ["데이터 분석", "위험 확률 및 영향력 평가", "위험이 발생하면 프로젝트 목표에 영향을 주는 정도를 평가"],
          ["데이터 분석", "위험 데이터 품질 평가", "리스크 관련 데이터의 정확성, 품질, 신뢰성, 무결성 검토"],
          ["데이터 분석", "기타 위험 모수 평가", "긴급성(Urgency), 가까움(Proximity; 발생할 기간이 가까움), 전략적 영향 등 고려하는 항목으로 우선순위를 고려한다"],
          ["데이터 표현", "위험 확률 및 영향력 매트릭스", "평가된 리스크 확률-영향을 P-I Matrix를 사용하여 등급화"],
          ["데이터 표현", "계층적인 차트", "3개 모수를 표현하는 버블차트. 버블의 크기가 클수록 허용할 수 없는 큰 위험 요소이다. 버블의 크기는 영향 값(Impact value)이다"],
          ["대인관계 및 팀 기술", "촉진", "촉진자 통하여 정성적 위험 분석의 효과를 분석, 편견 원인 식별, 충돌 해결"],
          ["기타 기법", "전문가 판단", "각 위험의 확률 및 영향을 평가하여 표시된 매트릭스에서 해당 위치를 결정하는데 전문가 판단이 필요"],
          ["기타 기법", "위험 유형 분류", "비슷한 원인을 가진 리스크를 RBS(Risk Breakdown Structure)를 이용하여 분류"],
          ["기타 기법", "미팅", "정성적 위험 워크샵(Workshop)을 통해 수행"],
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
    defShort: "위험이 목표에 미치는 영향을 수치로 분석하는 프로세스",
    keywords: ["데이터 수집", "데이터 분석", "대인관계 및 팀 기술", "기타 기법"],
    tables: [
      {
        caption: "정량적 위험 분석 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["데이터 수집", "인터뷰", "위험의 확률 및 영향을 수치로 환산하기 위해 선례 정보나 경험을 참고하는 방법으로 필요한 정보는 사용될 확률 분포에 따라 달라짐"],
          ["데이터 분석", "영향도", "다양한 위험요인, 원인들이 결과에 미치는 관계를 도표로 표현한 분석기법"],
          ["데이터 분석", "민감도 분석", "불확실한 요소를 결정하여 목표에 영향을 미치는 정도를 분석. 다른 위험 수치는 고정시킨 상태에서 임의의 한 위험을 변동 했을 때 전체 프로젝트에 미치는 영향력이 변동하는지 분석. 토네이도 다이어그램, 일원분산분석, 시나리오 분석"],
          ["데이터 분석", "의사결정 분석", "각 의사결정에 따른 기대값을 계산하여 최적의 의사결정 선택. EMV (Expected Monetary Value) : 예상되는 금전적인 가치로 위험의 크기를 측정하여 의사결정"],
          ["데이터 분석", "모의실험", "모수, 변수에 대하여 다양한 수치를 대입하여 확률변수의 분포 산정하는 기법. 몬테카를로 분석법 : 특정 변수를 예측하기 위해 확률모형의 모수나 변수에 대해 반복적으로 여러 수치를 대입하여 확률 변수의 분포를 산정한다"],
          ["대인관계 및 팀 기술", "촉진", "워크샵을 통해 협의 도출 및 창의적으로 접근"],
          ["기타 기법", "불확실성 표현", "기간, 원가, 일정, 자원의 요구사항에 대한 불확실성을 확률분포로 표현하는 것을 말함"],
          ["기타 기법", "전문가 판단", "유사 프로젝트나 도메인 및 비즈니스 관련 분야에 경험을 가진 전문가가 직접 위험을 수치화 및 모델링 적용"],
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
    defShort: "확률분포의 무작위 샘플링 반복으로 결과를 추정하는 기법",
    keywords: ["다양한 시나리오 분석", "확률적 결과 제공", "변수 정의", "무작위 샘플링", "시뮬레이션 실행", "결과 집계"],
    tables: [
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. 변수 정의", "프로젝트의 불확실한 변수(예: 작업 기간, 비용)를 식별하고 확률 분포(정규분포, 균등분포 등)를 할당"],
          ["2. 무작위 샘플링", "각 변수에 대해 난수를 생성해 입력 값을 추출"],
          ["3. 시뮬레이션 실행", "추출된 입력 값을 모델에 적용해 결과(예: 총 프로젝트 기간)를 계산"],
          ["4. 결과 집계", "수천~수만 번의 반복 후 결과 분포를 분석해 평균, 표준편차, 신뢰구간 등을 도출"],
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
    defShort: "식별된 위험의 상세 대응방안을 계획하는 프로세스",
    keywords: [
      "부정적 (에스컬레이션, 회피, 전가, 완화, 수용)",
      "긍정적 (에스컬레이션, 활용, 공유, 증대, 수용)",
    ],
    tables: [
      {
        caption: "부정적 위험 대응 (EATMA)",
        headers: ["방법", "설명"],
        rows: [
          ["에스컬레이션(Escalation)", "프로세스를 태운다는 의미, 보고. 단계적 확대. PM 권한 밖에 있는 사항으로 PMO조직(팀)에서 관리. 에스컬레이션된 위험에 대한 책임은 조직 내 관련자에게 수용(Accepted)되는 것이 중요"],
          ["회피(Avoid)", "위험 제거 위해 프로젝트 목표를 위험 영향권에서 고립시키거나 목표 변경. (예) 일정연기, 전략 변경, 범위 축소 등 조치가 포함"],
          ["전가(Transfer)", "위험으로 인한 영향력 및 대응 주체를 제3자에게 이동시키는 것을 의미. (전가도구) 보험 활용, 이행 보증, 각종 보증 및 보장"],
          ["완화(Mitigate)", "수용 가능한 한계선까지 리스크의 발생 가능성과 목표에 미치는 영향의 수준을 낮추는 방법. (예) 프로젝트 초기 조치나 많은 테스트 수행"],
          ["수용(Accept)", "위험의 존재를 인지, 선제적 조치 수행 안함. 저수준 위협에 적절함. 리스크 제거가 불가능 할 경우 채택되는 전략. 수동적 수용(Passive acceptance): 전략을 문서화하는 일 외에 어떠한 조치도 필요하지 않으며 발생한 리스크는 프로젝트 팀에서 처리 하도록 하는 방법 / 능동적 수용(Active acceptance): 리스크를 처리할 시간, 자본 또는 자원 포함하여 적극적으로 우발사태 예비(Contingency reserve) 구축하는 방법"],
        ],
      },
      {
        caption: "긍정적 위험 대응 (EESEA)",
        headers: ["구분", "설명"],
        rows: [
          ["에스컬레이션(Escalation)", "프로젝트 승인자 등이 이 사항에 대해서는 과업 밖에 있거나, PM 권한 밖에 있는 사항으로 서로 판단하는 사항 → 상위 관리자에게 올림"],
          ["활용(Exploit)", "기회 실현 위해 긍정적 영향 갖는 리스크 선택 전략. (예) 프로젝트 조기 종료 시, 성과급 받아낼 수 있음(편익증대)"],
          ["공유(Share)", "제3자에게 유익한 기회를 공유(분담)하는 방법. (예) 기회에 대한 책임 일부, 전부를 할당하는 일, 합작 투자"],
          ["증대(Enhance)", "긍정적 영향 리스크 식별하여 극대화. (예) 조기 종료를 하기 위해, 활동 자원 보충방법"],
          ["수용(Accept)", "기회 수용 수반되면 활용하지만 적극적 기회 추구 않는 방법"],
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
    defShort: "모든 프로젝트에 적용할 원칙·가치 중심의 관리 지식 체계",
    keywords: [
      "성과: 이해관계자, 팀, 개발방식 및 생애주기, 기획, 성과, 인도, 측정, 불확실성 및 모호성 탐색",
      "원칙: 스튜어드쉽, 팀, 이해관계자, 가치, 시스템 사고, 리더쉽, 조정, 품질, 복잡성, 위험, 적응성과 복원력, 변화",
    ],
    tables: [
      {
        caption: "8개 성과 영역 (이팀개기 성인측불)",
        headers: ["성과영역", "기법"],
        rows: [
          ["이해관계자 (Stakeholder)", "이해관계자 식별 / 의사소통 및 참여"],
          ["팀 (Team)", "갈등관리 / 팀 관리"],
          ["개발방식 및 생애주기 (Development Approach and Life Cycle)", "Tailoring / 개발 방법론 조정"],
          ["기획 (Planning)", "프로젝트 관리 계획 및 검토"],
          ["성과 (Project Work)", "프로젝트 실행 / 자원 관리"],
          ["인도 (Delivery)", "통합 변경관리 / CI/CD"],
          ["측정 (Measurement)", "비용성과지수 / 일정성과지수, EVM"],
          ["불확실성 및 모호성 탐색 (Uncertainty)", "위험관리 / 이슈관리"],
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
          ["리더쉽 (Leadership)", "동기부여, 갈등관리, 공동목표일치"],
          ["조정 (Tailoring)", "기존 방법론 최적화, 생산성 향상"],
          ["품질 (Quality)", "성능, 만족도, 회복력, 신뢰성"],
          ["복잡성 (Complexity)", "인간행동, 시스템동작, 기술혁신"],
          ["위험 (Risk)", "비용 효율적, 관련 이해관계자 합의"],
          ["적응성과 복원력 (Adaptability and Resiliency)", "지속적인 학습과 개선, 짧은 피드백"],
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
    defShort: "제3자 기술 평가(감리)와 발주자 관점 관리(PMO)의 비교",
    keywords: ["관점 차이", "법령 차이", "산출물 차이"],
    tables: [
      {
        caption: "비교표",
        headers: ["구분", "감리", "PMO"],
        rows: [
          ["목적", "프로젝트 품질보증 평가 / PJT공정성·투명성", "복수 프로젝트 관리 / 프로젝트 자원·일정·모니터링"],
          ["역할", "기술적 측면의 품질검토가 강함", "전과정 적극적 참여, 의사소통 / 경영·관리적 성격이 강함"],
          ["효과", "위험요소 대응방안 / 산출물 품질향상 제시", "위험 조기 식별, IT전략 연계, 비용 절감"],
          ["관점", "독립적 관점(제 3자 관점)", "발주자 관점의 사업관리"],
          ["법적 근거", "단순장비 제외 5억원 이상인 경우 감리 의무 / 5억원 이하는 경우에 따라 의무/시행", "2013년부터 공공기관 정보화 사업 시 PMO 도입 의무화"],
          ["법령", "전자정부법 제 57조 1항에 따른 의무사항", "전자정부법 제 64조 2에 따른 권고사항, 전자정부 사업관리 위탁에 대한 규정 / 전자정부법 시행령 78조"],
          ["수행조직", "감리법인", "컨설팅업체, 회계법인, 대형 SI"],
          ["주요 산출물", "감리계획서 / 감리수행결과보고서 / 시정조치확인보고서", "요구사항 정의서(SRS) / 사업자 선정 기준서, 사업자 관리 계획서 / 아키텍처 정의서 / 영역별 관리 계획서"],
        ],
      },
    ],
  },
  {
    title: "Agile 선언문과 12개 원칙",
    course: "PM",
    definition: "고객 요구사항에 유연한 대응을 하는 Agile 방법론의 4가지 선언문과 12 원칙",
    defShort: "고객 요구에 유연 대응하는 애자일 4선언문과 12원칙",
    keywords: ["개인과 상호작용", "변화에 대응", "작동하는 소프트웨어", "고객과의 협력"],
    tables: [
      {
        caption: "Agile 4대 가치 (공개포작 개변동고)",
        headers: ["가치", "설명"],
        rows: [
          ["개인과 상호작용", "공정과 도구보다 개인과 상호작용을 강조"],
          ["변화에 대응", "포괄적인 문서보다 작동하는 소프트웨어에 가치를 둠"],
          ["작동하는 소프트웨어", "계약 협상보다 고객과의 협력에 가치를 둠"],
          ["고객과의 협력", "계획을 따르기보다 변화에 대응하는 것에 가치를 둠"],
        ],
      },
      {
        caption: "Agile 12가지 원칙 (고요배의 동대지소 좋단자효)",
        headers: ["12가지 원칙", "핵심", "설명"],
        rows: [
          ["고객만족 추구", "고객 최우선 중시", "빠른 배포와 피드백 반영, 고객의 만족도 향상"],
          ["요구사항 변경 수용", "요구 변경 상황 인정", "고객 요구 변경 인정 및 대응을 위한 유연성"],
          ["짧은 배포 간격", "CI/CD 활용", "도구 등을 통해 빠른 배포, 고객 피드백 반영"],
          ["현업-개발자간 일일 의사소통", "소통 중시", "담당자와 개발자 간의 소통을 통한 업무 효율화"],
          ["동기부여된 사람들 중용/지원", "상호 존중 문화", "동기 부여된 팀원을 중용 및 환경 지원"],
          ["면대면 대화", "의사소통의 효율화", "Daily Meeting등을 통한 면대면 대화"],
          ["지속 가능한 개발 장려", "일정한 속도 유지", "지속 가능한 개발 및 프로젝트 진행 장려"],
          ["작동하는 소프트웨어", "진척도로 SW중시", "직접 SW의 기능/비기능적 요소 및 진행관리"],
          ["좋은 기술, 설계 관심", "복잡성 줄이기 위한 기술 우수성 중시", "우수한 기술, 아키텍처 중시 및 공유"],
          ["단순성 추구", "일정/진행사항 단순화 및 시간 절약", "목표 업무와 연관 없는 일들을 최소화"],
          ["자기 조직적 팀", "조직 생산성 증대", "책임감 부여, 생산성 증대위한 자기조직적 팀"],
          ["정기적 효율성 제고", "업무 효율성 증대", "스프린트 리뷰를 통해 다음 스프린트에 반영 할 수 있는 요소 적용"],
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
    defShort: "짧은 스프린트로 점진·반복 개발하는 애자일 방법론",
    keywords: ["Product backlog", "Sprint backlog", "회의 5개 세부내용", "Burn down chart", "담당자별 역할"],
    tables: [
      {
        caption: "프로세스",
        headers: ["단계", "수행 목록", "내용"],
        rows: [
          ["1", "Product Backlog 작성", "요구 사항 목록에 우선순위를 매겨 제품 기능 목록(product backlog) 작성"],
          ["2", "스프린트 계획 회의 (Sprint Planning Meeting)", "스프린트 구현 목록(sprint backlog) 작성하고 스프린트 개발 시간 추정"],
          ["3", "스프린트 수행 (Burn down Chart, Daily Scrum Meeting)", "스프린트 개발을 진행하며 일일 스크럼 회의를 통해 진척사항을 확인하고 진행률을 소멸 차트에 표시"],
          ["4", "스프린트 개발 완료 (Sprint Review)", "잠재적으로 출시 가능한 제품 증분"],
          ["5", "스프린트 완료 후 (Sprint Retrospective)", "스프린트 검토 회의를 하며 스프린트 회고 후 두 번째 스프린트 계획 회의"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["요구사항", "Product backlog", "PO(Product Owner)에 의해 우선순위가 정해진 사용자가 요구하는 제품의 기능 목록"],
          ["요구사항", "Sprint backlog", "각각의 sprint 주기에서 개발할 작업 목록. Sprint 기간 동안 개발 가능한 기능의 목록을 product backlog에서 선택"],
          ["주기", "Sprint", "보통 2~4주 짧은 기간을 가지는 반복 개발 주기. 각 sprint 단계 종료 시 새로운 기능이 추가되어 실행 가능 제품이 인도되어야 함"],
          ["회의", "Product Backlog Meeting", "Product Owner 가 이해관계자들과 미팅 후 우선순위 선별. Product backlog 작성"],
          ["회의", "Sprint Planning Meeting", "스프린트 계획 회의, 스프린트 백로그 산정"],
          ["회의", "Daily Scrum Meeting", "일일 15분 정도 짧은 회의. 어제 한 일, 오늘 할 일, 이슈사항 발표. SCRUM master는 진척사항 검토, 이슈사항 확인"],
          ["회의", "Sprint Review", "하나의 스프린트가 끝났을 때 실행 가능한 제품 검토. 스프린트 목표달성 여부, 작업 진행과 결과물 확인"],
          ["회의", "Sprint Retrospective", "스프린트 종료 후 수행활동과 개발한 것을 되돌아보고 개선점이나 규칙 및 표준 준수 여부 검토 (G, B, I)"],
          ["관리", "Burndown chart", "하나의 스프린트에서 작업 완료 추이를 나타낸 차트"],
          ["담당자", "Product Owner", "제품 기능 목록 작성, 스프린트 운영 관여 안함"],
          ["담당자", "Scrum Master", "조력자 역할. 애자일 촉진자. 개발 방해 요소 제거"],
          ["담당자", "Scrum Team", "요구사항 구현, 제품 시연, 스크럼 회의 진행"],
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
    defShort: "스토리 포인트로 계획 대비 진행을 파악하는 차트",
    keywords: ["스토리포인트(Story Point) 산정", "Sprint 진척율 가시화"],
    tables: [
      {
        caption: "상세설명",
        headers: ["구분", "설명"],
        rows: [
          ["가로축", "시간 축으로 스프린트 반복 주기 날짜수"],
          ["세로축", "완료된 작업의 추정 일수 (스토리 포인트로 표현)"],
          ["계획 그래프", "처음 계획을 세웠을 때 날짜로 남은 작업량 표현"],
          ["실제 그래프", "작업을 수행하면서 실제로 남은 작업량"],
          ["기울기", "작업수행 속도 판단"],
        ],
      },
      {
        caption: "번다운 차트와 EVM 비교",
        headers: ["항목", "Burn Down Chart", "EVM"],
        rows: [
          ["개념", "요구사항의 중요도, 난이도를 바탕으로 점수를 부여하고, 그 점수를 사용하여 스프린트 기간내에 추이를 분석하는 작업 진척율 차트", "원가 및 획득가치를 기반으로 계획대비 일이 얼마만큼 진행이 되는지 통제하는 기법. 원가와 일정과 획득가치를 기반으로 하는 기법"],
          ["목적", "업무 잔존 추정 (100 → 0)", "프로젝트 진척 성과 분석"],
          ["특징", "애자일 프로세스에 주로 사용", "전통적 방법론에서 주로 사용"],
          ["비용", "Daily Scrum 수행 비용", "문서화 수행 비용"],
          ["구성요소", "가로축: 스프린트 회차 / 세로축: 업무 수행 시간", "PV, EV, AC, SV, CV, SPI, CPI, BAC, EAC, VAC, TCPI"],
          ["제반사항", "스프린트 백로그 작성 / 스프린트 리뷰·회고", "철저한 문서화 / 지속적 관리 계획"],
          ["장점", "애자일 팀이 요구사항에 점수부여 / 계획대비 진행률 파악 용이", "수치화 된 지표 제공 / 원가 예측 방법 제공"],
          ["단점", "잠재적 이슈 예측 불가 / 점수 할당에 시간 소요", "방대한 문서화, 사전 계획 수립 / 작은 프로젝트는 현실성 적음"],
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
    defShort: "의사소통과 TDD 기반 짧은 주기의 애자일 개발 방법론",
    keywords: ["용기", "단순함", "커뮤니케이션", "피드백", "존중", "12가지 실천 항목"],
    tables: [
      {
        caption: "핵심 가치 (용단커피존)",
        headers: ["핵심가치", "설명"],
        rows: [
          ["용기", "고객의 요구사항 변화에 능동적인 대처"],
          ["단순성", "부가적 기능, 사용되지 않는 구조와 알고리즘 배제"],
          ["의사소통(커)", "공통의 메타포 사용, 관리자, 개발자, 고객 간의 의사 소통"],
          ["피드백", "빠른 피드백을 원칙으로 해결 할 수 있는 일 먼저 처리"],
          ["존중", "구성원 상호간의 존중, 프로젝트에 대한 존중"],
        ],
      },
      {
        caption: "12가지 실천 항목",
        headers: ["구분", "실천항목", "내용"],
        rows: [
          ["개발", "페어 프로그래밍(Pair Programming)", "두 명이 한대 컴퓨터에서 개발(오류 감소, 생산성 향상)"],
          ["개발", "공동 책임(Collective Ownership)", "시스템에 있는 코드는 누구든지 언제라도 수정 가능"],
          ["개발", "지속적 통합(Continuous Integration)", "하루에 몇 번이라도 시스템 통합하여 빌드 가능"],
          ["관리", "게임 계획(Planning Game)", "User Story 이용하여 next Release 범위 빠르게 결정"],
          ["관리", "작은 릴리스(Small Release)", "필요한 기능들만 갖춘 간단한 시스템을 빠르게 릴리스 (2주 단위)"],
          ["관리", "메타포(Metaphor)", "문장형태로 시스템 아키텍처 기술, 고객과 개발자간 의사소통 언어"],
          ["구현", "Simple Design", "요구사항을 만족하도록 가능한 단순하게 설계"],
          ["구현", "테스트 주도 개발(Test Driven Develop)", "테스트 주도(TDD), 테스트를 통한 고객 검증, 승인"],
          ["구현", "리팩토링(Refactoring)", "기능에 변화 없이 코드 수정 통해 디자인 개선"],
          ["환경", "주당 40시간 작업", "주 40시간 이상 일하지 말도록 규칙"],
          ["환경", "On-Site Customer", "프로젝트에 고객 상주, 의사 결정 지원"],
          ["기타", "코딩 표준화", "의사소통 향상 위해 코딩 표준화"],
        ],
      },
      {
        caption: "프로세스 단계",
        headers: ["단계", "설명"],
        rows: [
          ["유저 스토리", "고객이 필요한 것 기술(요구사항 수집, 의사소통 도구). 릴리스 계획을 작성하기 위한 단위"],
          ["스파이크", "잠재적 솔루션을 고려하여 작성하는 간단한 프로그램(핵심 기능 프로토타입). 신뢰성 증대, 기술적 문제의 위험성을 줄일 목적으로 작성"],
          ["배포계획", "전체 프로젝트에 대한 배포 계획을 생성. 의사결정 등 모든 규칙 포함, 규칙에 의한 프로젝트 수행 정의"],
          ["반복", "민첩함이 중요, 1~3주 정도로 나누어 반복을 균형적으로 유지. 프로세스 평가와 계획을 단순하고 신뢰성 있게 만드는 핵심 항목"],
          ["인수 테스트", "고객은 작동하는 시스템을 보면서 진척 사항 확인. 고객이 직접 명세한 테스트 통과 파악"],
          ["소규모 배포", "짧은 사이클, 소규모 빈번한 배포로 고객에게 이득을 조기 제공. 프로그램은 빠른 피드백을 제공 받음"],
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
    defShort: "낭비를 최소화해 생산성을 높이는 것을 목표로 하는 방법론",
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
          ["린 소프트웨어 개발", "프로그램을 개발하는데 발생할 수 있는 모든 낭비를 최소화하고 결과를 측정, 성과를 분석해 소프트웨어 가치를 최대화 하는 것을 목표로 하는 방법론"],
          ["린 UX", "핵심 가치를 정의하고, 그에 기반한 가설을 만들고, 검증하여, 핵심지표를 계속해서 조정해 나가면서 진행하는 방법론"],
          ["린 스타트업", "아이디어를 빠르게 MVP(Minimum Viable Product)로 개발한 뒤 시장의 반응을 통해 다음 제품 개선에 반영하는 경영전략"],
          ["린 애자일", "팀이 낭비를 식별하고 프로세스를 개선하는 데 도움이 되는 개발 방법으로 효율성, 효과성 및 지속적인 개선을 촉진하는 지도적 사고방식"],
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
    defShort: "개발의 방법·절차·도구를 공학적으로 표준화한 이론",
    keywords: ["표준화", "절방산관기도", "구정객CAP"],
    tables: [
      {
        caption: "개발 방법론의 구성요소 (절방산관기도)",
        headers: ["구성요소", "설명", "예시"],
        rows: [
          ["절차", "프로젝트 단계별 활동 및 순서", "Phase-Activity-Task"],
          ["방법", "각 Task의 수행방법(누가 무엇을 어떻게)", "작업 방법"],
          ["산출물", "산출물의 목록 및 양식", "설계서 등"],
          ["관리", "계획, 일정, 품질 등의 관리 방법", "계획서, 기준문서 등"],
          ["기법", "각 단계별 이용가능한 기술 및 기법", "ERD, DFD 등"],
          ["도구", "각 단계 또는 기법에 활용가능한 도구", "CASE, UML Tool 등"],
        ],
      },
      {
        caption: "개발 방법론 유형 상세 (구정객CAP)",
        headers: ["유형", "설명"],
        rows: [
          ["구조적 방법론", "정형화된 분석절차 적용. 프로세스 중심. 분할과 정복. 하향식 기능분해 (70년대, 복잡성극복)"],
          ["정보공학 방법론", "CASE 도구 등 공학적 접근. 데이터모델 중심. 데이터와 프로세스 균형. 기업정보시스템중심 (80년대, 자동화)"],
          ["객체지향 방법론", "객체지향 개념 적용, 사용자관점 분석설계. 객체 중심. 객체, 클래스, 메시지를 사용. White Box Reuse (90년대, 모듈화)"],
          ["CBD 방법론", "컴포넌트 개발 및 조합을 통한 재사용 중심. 컴포넌트 중심. 생산성/품질향상, 유지보수 최소. Black Box Reuse (2000년대, 재사용)"],
          ["Agile 방법론", "개발과 함께 즉시 피드백을 받아서 유동적으로 개발. 고객의 요구 변화에 유연하고 신속히 대응. XP, Scrum, Kanban, Lean (2010년대, 적시성)"],
          ["Product Line", "특정 제품에 적용하고 싶은 공통된 기능을 정의하여 개발하는 방법론. 도메인공학, 응용공학, 레파지토리"],
        ],
      },
    ],
  },
  {
    title: "소프트웨어 설계의 원리",
    course: "SE",
    definition:
      "소프트웨어 시스템을 효율적으로 설계하고 개발하여 복잡성을 줄이고 품질을 높이기 위해 지켜야 할 기본적인 지침과 규칙",
    defShort: "복잡성을 줄이고 품질을 높이는 설계 기본 지침(분할·추상화 등)",
    keywords: ["추상화", "정보은닉", "분할과 정복", "단계적 분해", "모듈화"],
    tables: [
      {
        caption: "설계 원리",
        headers: ["구분", "설계원리", "설명"],
        rows: [
          ["일반화", "추상화", "특정 목적과 관련된 필수 정보만 추출하여 강조하고, 관련 없는 세부 사항을 생략함으로써 본질적인 문제에 집중할 수 있도록 하는 작업"],
          ["일반화", "정보은닉", "각 모듈의 자세한 처리 내용이 시스템의 다른 부분에게 감추어짐"],
          ["구체화", "분할과정복", "규모가 큰 소프트웨어를 개발할 때 여러 개의 서브시스템으로 나누고 서브시스템을 아주 작은 시스템이나 모듈로 나누어 개발하여 하나씩 위로 올라가면서 완성시키는 방법"],
          ["구체화", "단계적분해", "기능을 점점 작은 단위로 나누어 점차적으로 구체화하는 방법으로 하향식 설계에 사용"],
          ["구체화", "모듈화", "실제 개발할 수 있는 작은 단위로 나누는 것으로 모듈은 규모가 큰 것을 여러 개의 작은 조각으로 SW구조를 이루는 기본 단위"],
        ],
      },
      {
        caption: "SW 설계 유형",
        headers: ["종류", "주요 활동", "설명"],
        rows: [
          ["상위 설계", "아키텍처 설계", "예비 설계 또는 상위 수준 설계. 소프트웨어 시스템의 전체 구조를 기술. 소프트웨어를 구성하는 컴포넌트들 간의 관계를 정의"],
          ["상위 설계", "데이터 설계", "시스템에 필요한 정보를 자료구조와 데이터베이스 설계 반영"],
          ["상위 설계", "인터페이스 정의", "시스템 구조와 서브 시스템들 사이의 인터페이스를 명확하게 정의. 상호 작용하는 컴퓨터 시스템, 사용자 등의 통신 정의"],
          ["상위 설계", "사용자 인터페이스 설계", "사용자가 익숙하고 편리하게 사용할 수 있도록 인터페이스 설계"],
          ["하위 설계", "모듈설계", "각 모듈의 실제적인 내부를 알고리즘 형태로 표현"],
          ["하위 설계", "자료구조설계", "자료구조, 변수 등에 대한 상세한 정보를 작성. 요구분석 단계에서 생성된 정보를 바탕으로 소프트웨어를 구현하는데 필요한 자료구조로 변환하는 과정"],
          ["하위 설계", "알고리즘 설계", "시스템의 기능을 구현하기 위한 절차, 순서, 제어흐름 정의"],
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
    defShort: "개체를 속성과 메소드가 결합된 객체로 표현하는 개념",
    keywords: ["캡슐화", "추상화", "다형성", "정보은닉", "상속성"],
    tables: [
      {
        caption: "객체지향 특징 (캡추다정상)",
        headers: ["특징", "정의"],
        rows: [
          ["캡슐화", "객체의 속성(Data Fields)과 행위(메소드, Methods)를 하나로 묶고, 실제 구현 내용 일부를 일부에 감추어 은닉하는 객체지향의 특성. 객체 정보은닉의 확장 캡슐화"],
          ["추상화", "현실세계의 사실(물체 등)을 객체로 공통적인 속성과 기능을 묶어 이름을 부여하는 기법. 공통 성질을 추출하여 슈퍼클래스를 설정하는 특성"],
          ["다형성", "같은 함수(Method) 이름으로, 여러 개의 메서드를 만들 수 있는 기법. 동적바인딩, 확장성 지원(수직적 확장 Overriding과 수평적 확장 Overloading 지원)"],
          ["정보은닉", "클래스 내부에서 사용되는 변수들을 private 이나 protected 등으로 선언함으로써 자기 클래스 혹은 자식 클래스 외에는 직접적으로 제어를 불가능한 성질"],
          ["상속성", "상속은 클래스에서만 통용되는 개념으로 미리 만들어 둔 클래스를 다시 이용하는 방법. 일반화(공통적인 속성·행동을 갖는다) ↔ 특수화(자신만의 속성·행동을 갖는다)"],
        ],
      },
    ],
    notes: ["교재 두음: [캡추다정상]"],
  },
  {
    title: "다형성 (Polymorphism)",
    course: "SE",
    definition: "같은 함수(Method) 이름으로, 여러 개의 메서드를 만들 수 있는 기법",
    defShort: "같은 이름으로 여러 메서드를 만들 수 있는 기법",
    keywords: ["오버로딩", "오버라이딩"],
    tables: [
      {
        caption: "오버로딩과 오버라이딩 비교",
        headers: ["구분", "오버로딩 (Overloading)", "오버라이딩 (Overriding)"],
        rows: [
          ["개념", "메소드의 이름은 같으나 인자의 타입 및 개수가 다른 경우, 동일 클래스의 동일 메소드로 매개변수 다르게 하여 정의하는 기법", "상속관계에 있는 두 클래스 중 하위클래스에서 상위클래스의 메소드를 재정의하여 사용하는 기법"],
          ["메소드 이름", "같아야 함", "같아야 함"],
          ["파라미터 개수/자료형", "파라미터 개수 달라야 함. 개수가 같을 경우 자료형이 달라야 함", "같아야 함"],
          ["리턴 타입", "상관없음", "같아야 함"],
          ["기타", "상위 클래스에 같은 이름의 메소드가 없어야 함", "상위 클래스에 메소드 존재"],
        ],
      },
    ],
    notes: ["오버로딩 = 수평적 확장(같은 클래스 안), 오버라이딩 = 수직적 확장(상속 관계)"],
  },
  {
    title: "객체지향 설계 원리",
    course: "SE",
    definition: "소프트웨어 개발 및 유지보수성 향상을 위한 설계관점의 기본원칙",
    defShort: "개발·유지보수성 향상을 위한 설계 기본원칙(SOLID)",
    keywords: ["SOLID", "SRP", "OCP", "LSP", "ISP", "DIP"],
    tables: [
      {
        caption: "SOLID 설계 원리",
        headers: ["설계원리", "개념"],
        rows: [
          ["SRP (Single Responsibility Principle)", "클래스와 메소드는 하나의 역할 수행"],
          ["OCP (Open Closed Principle)", "확장에는 열려있고, 수정에는 닫혀있어야 하는 설계 원칙"],
          ["LSP (Liskov Substitution Principle)", "자식 클래스의 객체(타입과 매소드의 집합)들이 부모 클래스 사용되는 곳에 대체될 수 있어야 한다는 설계 원칙"],
          ["ISP (Interface Segregation Principle)", "인터페이스는 하나의 역할 수행"],
          ["DIP (Dependency Inversion Principle)", "고차원 모듈은 저차원 모듈에 의존 금지"],
        ],
      },
    ],
    notes: ["두음: SOLID = SRP · OCP · LSP · ISP · DIP"],
  },
  {
    title: "데메테르의 법칙 (Law of Demeter)",
    course: "SE",
    definition:
      "오브젝트는 주변 다른 오브젝트에 대해 제한된 정보만 갖고 자신과 밀접한 오브젝트만 이용해야 한다는 설계 법칙",
    defShort: "밀접한 오브젝트만 이용해야 한다는 결합도 최소화 설계 법칙",
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
          ["객체 자체", "this.method();", "객체 자체에 속한 메소드(Method) 호출"],
          ["메소드의 변수", "void user_method(friend obj) { obj.parameters_method(); }", "메소드에 파라미터(Parameter)로 전달된 객체의 메소드(Method)"],
          ["메소드 안에서 만들어진 객체", "void user_method() { class obj; obj.created_method(); }", "메소드 또는 속성 내부에서 직접 생성한 객체의 메소드(Method)"],
          ["객체가 직접 관리하는 컴포넌트 객체", "class OwnerObject { ComponentClass cc; void user_method() { cc.owner_method(); } }", "객체 자신의 일부이면서, 그 Reference를 갖는 오브젝트"],
          ["메소드 스코프 내에서 객체가 접근 가능한 전역 변수", "class global_cls; class OwnerObject { void user_method() { global_cls.global_method(); } }", "접근 가능한 전역 변수(객체)"],
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
    defShort: "도메인 핵심자산 재사용으로 생산성을 극대화하는 생산 체계",
    keywords: ["Domain Engineering", "Application Engineering", "Core Asset"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Domain Engineering", "특정 도메인에 포함된 제품들의 공통점과 차이점을 분석하여 제품 라인 자산 생성. 아키텍처 설계(제품 생산에 필요한 넓고 광범위한 의미의 설계 수행) / 컴포넌트 설계(재사용성과 생산성을 고려하여 컴포넌트 설계 수행)"],
          ["Application Engineering", "핵심자산(Core Asset)을 각 어플리케이션의 요구사항에 맞게 Instance화 하여 어플리케이션을 효과적으로 개발하는 과정. 핵심자산에서 제공하지 않는 목표 어플리케이션의 일부 기능을 Modeling하여 Instance화 된 핵심자산과 통합하여 제품 개발"],
          ["Core Asset", "특정 시스템을 구현하는데 사용될 수 있는 자산 Repository를 생산. 제품 개발과 별개로 제품 개발 중에 진화될 수 있음"],
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
    defShort: "핵심·횡단 관심사를 분리하고 위빙으로 결합하는 프로그래밍",
    keywords: ["핵심관심", "횡단관심", "Joint-Point", "Point-cut", "Weaving", "Aspect"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명", "사례"],
        rows: [
          ["관심사", "핵심 관심사", "단일 모듈이 가지는 주된 요구사항", "Business Logic"],
          ["관심사", "횡단 관심사", "여러 개 모듈에 공통적 사용되는 부가적인 요구 사항", "Logging, Security, Transaction, Error Handler"],
          ["프로그래밍 요소", "결합점(Joint Point)", "Aspect를 플러그인 할 수 있는 애플리케이션 실행지점, Advice를 적용하는 지점", "필드, 메소드의 호출 'Where' 의미"],
          ["프로그래밍 요소", "교차점(Point Cut)", "Advice가 어떤 Joint Point에 적용되는지를 정의. 언제 Joint Point가 매칭될 것인지 알려주는 구문. 명시적 클래스/메소드 이름, 클래스와 메소드 이름의 패턴과 일치하는 정규식", "@Pointcut(\"execution(* transfer(..))\")"],
          ["프로그래밍 요소", "Advice", "Aspect의 실제 구현체로 어플리케이션의 Joint Point 에 삽입", "Before Advice, After, Around등"],
          ["프로그래밍 요소", "직조(Weaving)", "Advice를 핵심 로직 코드에 적용(컴파일, 클래스 로딩, 런타임 시점)", "컴파일시, 클래스 로딩시, 런타임시 엮기"],
          ["프로그래밍 요소", "Aspect", "Pointcut 과 Advice를 합쳐 놓은 클래스 형태의 코드", "Aspect는 AOP의 중심 단위이다. @Aspect annotation (@AspectJ style)"],
          ["프로그래밍 요소", "Target", "Advice받는 클래스(커스텀 클래스, 써드파티 클래스)", ""],
        ],
      },
    ],
  },
  {
    title: "테일러링 (Tailoring)",
    course: "SE",
    definition:
      "조직의 표준 프로세스를 커스터마이징 하여 프로젝트 요구에 맞게 적합한 프로세스를 얻는 과정",
    defShort: "표준 프로세스를 프로젝트 요구에 맞게 커스터마이징하는 과정",
    keywords: ["프로젝트 특징 정의", "표준 프로세스 선정 및 검증", "상위/하위 수준 커스터마이징", "문서화"],
    tables: [
      {
        caption: "절차 (특선상세문)",
        headers: ["절차", "입출력 산출물"],
        rows: [
          ["프로젝트 특징 정의", "프로젝트 프로파일"],
          ["표준 프로세스 선정 및 검증", "표준프로세스 선정 / 프로세스 검증"],
          ["상위 수준의 커스터마이징", "생명주기, WBS"],
          ["세부 커스터마이징", "테일러링 메트릭스, 프로젝트WBS, 산출물 구성도, 프로젝트 스케쥴"],
          ["테일러링 문서화", "WBS 테일러링 근거 적용 결과서"],
        ],
      },
      {
        caption: "목적 / 필요성",
        headers: ["구분", "목적 / 필요성"],
        rows: [
          ["관리적 측면", "① How-To-Do 제시 ② 지속적 개선"],
          ["기술적 측면", "③ 최적화된 기술 및 방법론 도출 ④ 최신 기술 수용"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["측면", "고려사항"],
        rows: [
          ["프로젝트 측면", "프로젝트 규모/기간(대규모/소규모), 조직원(경험자/비경험자), 위험수준(높음/낮음)"],
          ["기술적 측면", "기술혁신(파일럿검토), 데이터전환(데이터전환 환경 구성), 시스템연계(인터페이스 난이도), 분산시스템(도입/미도입)"],
        ],
      },
    ],
    notes: ["교재 두음: [특선상세문]"],
  },
  {
    title: "요구공학 (Requirements Engineering)",
    course: "SE",
    definition:
      "요구사항의 수집, 분석, 명세, 검증, 변경, 관리 등의 원칙과 제반 활동에 대한 총체적인 접근 체계",
    defShort: "요구사항 수집·분석·명세·검증·관리의 총체적 접근 체계",
    keywords: ["정명완검일수추리해", "추분명검", "협기변검"],
    tables: [
      {
        caption: "요구공학 프로세스 설명",
        headers: ["구성요소", "대상", "설명"],
        rows: [
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 추출", "요구사항 도출 대상 선정, 제안서, 사업수행 계획서, 인터뷰, 프로토타이핑"],
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 분석", "도출된 기능을 명확히 파악, 정보공학 분석법, UML"],
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 명세", "시스템의 행동을 기술. 요구사항 명세서"],
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 검증", "요구사항과 요구사항 명세의 일치 확인 및 승인, 타당성 검증, 일치성, 완전성, 현실성, 프로토타이핑"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항 협상", "가용한 자원과 수용 가능한 위험 수준에서 구현 가능한 기능을 협상하기 위한 기법"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항 기준선", "공식적으로 검토되고 합의된 요구사항 명세서. (향후 개발의 기본(Baseline))"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항 변경관리", "요구사항 기준선을 기반으로 모든 변경을 공식적으로 통제하기 위하여 기법"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항 확인 및 검증", "구축된 시스템이 이해관계자가 기대한 요구사항에 부합되는지 확인하기 위한 방법"],
        ],
      },
      {
        caption: "요구사항 평가 지표 (정명완검일수추리해)",
        headers: ["항목", "설명"],
        rows: [
          ["정확성", "요구명세는 정확히 기술"],
          ["명확성", "요구 명세는 이해당사자별 명확히 제시"],
          ["완전성", "기능성, 성능 및 제약사항 등 모든 중요한 내용이 문서화"],
          ["검증성", "요구명세는 증명 가능"],
          ["일관성", "요구명세는 요구사항 간에 충돌이 없어야 함"],
          ["수정성", "요구사항은 수정 가능"],
          ["추적성", "요구사항은 근원, 원리가 추정 가능"],
          ["이해성", "이해 당사자간에 이해가 용이 해야 함"],
          ["해석성", "요구사항: 해석의 일관성 제공"],
        ],
      },
    ],
    notes: ["교재 두음: 정명완검일수추리해 / 추분명검(개발) / 협기변검(변경관리)"],
  },
  {
    topicId: "se-34",
    title: "페르소나 (Persona)",
    course: "SE",
    definition:
      "어떤 제품 혹은 서비스를 사용할 만한 목표 인구 집단안에 있는 다양한 사용자 유형들을 대표하는 가상의 인물",
    defShort: "목표 사용자 유형을 대표하는 가상의 인물",
    keywords: ["사용자 분석", "사용자 범주 파악", "기간구조 잡기", "페르소나 평가", "프로파일 작성"],
    tables: [
      {
        caption: "페르소나를 통한 사용자 분석 프로세스",
        headers: ["순서", "내용"],
        rows: [
          ["1", "사용자 범주 파악"],
          ["2", "주요 단서분류"],
          ["3", "세부 범주 파악, 기간구조 잡기"],
          ["4", "기간구조 평가, 우선순위 선정"],
          ["5", "페르소나 작성"],
          ["6", "페르소나 평가"],
          ["7", "설문조사를 통한 프로파일 (Profile) 작성"],
        ],
      },
      {
        caption: "사용자 분석 기법",
        headers: ["기법", "설명"],
        rows: [
          ["페르소나", "시스템을 사용할 만한 사용자 유형을 대표할 수 있도록 창조된 가상인물을 기반으로 하는 사용자 분석모형"],
          ["인지", "시스템을 사용하면서 사용자가 시스템을 어떻게 인지하는지 분석하는 사용자 분석모형"],
          ["역할", "사용자와 시스템 간의 관계를 특징 지을 수 있는 사용자의 사용 행태를 분석하는 모형"],
          ["사회기술", "시스템이 개발되고 사용되는 조직의 특성에 초점을 맞춘 사용자 분석 모형"],
        ],
      },
    ],
  },
  {
    title: "ISO/IEC/IEEE 42010:2022",
    course: "SE",
    definition:
      "SW 집약적 시스템의 아키텍처에서 표현해야 하는 내용 및 이들간 관계를 제공하는 아키텍처 명세 위한 표준 메타모델",
    defShort: "아키텍처 표현 내용과 관계를 정의한 명세 표준 메타모델",
    keywords: ["구성요소들 전부"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명", "세부"],
        rows: [
          ["Entity of Interest", "이해관계자가 관심을 가지고 있는 대상 개체", "비즈니스 시스템 및 정보기술 집합"],
          ["Architecture", "엔티티의 기본 개념 또는 속성과 엔티티 및 수명주기 프로세스의 실현 구조", "시스템 요소 간 관계 기본 개념 및 속성"],
          ["Stakeholder Perspective", "우려사항(concerns)과 관련된 관심 개체(Entity of Interest)에 대한 사고방식", "소유자/설계자/빌더의 관점"],
          ["Stakeholder", "대상 시스템 대한 관심 갖는 개인 또는 조직", "클라이언트, 공급자, CEO, 인증 기관등"],
          ["Architecture Description", "아키텍처를 표현하는데 사용되는 작업산출물", "이해/분석/구축 청사진"],
          ["Architecture Rationale", "선택 또는 대체 가능한 아키텍처 기술에 대한 논리적 근거", "선택의 정당성 기록 추론 기록"],
          ["Correspondence", "둘 이상의 아키텍처 설명 요소 사이의 식별되거나 명명된 관계", "일관성, 추적성, 종속성, 제약 관계 표현"],
          ["Correspondence Method", "뷰 및 뷰 구성요소 및 AD(Architecture Description) 요소 간의 일관성을 표현", "모델 종류 및 아키텍처 관점의 사양"],
          ["Concern", "대상 시스템 대한 모든 관심 사항", "목적, 기능, 지원 가능성, 상호 운용성"],
          ["Architecture Viewpoint", "아키텍처 뷰를 위한 해석, 사용 및 분석 위한 규칙", "모델링 방법, 관점 언어 및 기법"],
          ["Architecture View", "이해관계자 관점에서 대상 시스템의 아키텍처를 표현", "뷰 포인트 통해 기술 관심을 표현"],
          ["Architecture Aspect", "측면(Aspect)을 통해 설계자는 문제를 분석하고, 해결 및 구조화", "엔티티의 기능적, 구조적, 정보적 측면"],
          ["Model Kind", "아키텍처 모델 대한 규칙 정의", "Class/Flow 다이어그램"],
          ["View Component", "View를 구성하는 모델. AD의 엔티티의 기능 흐름, 동작 및 보안 기능을 설명", "데이터흐름/클래스 다이어그램"],
        ],
      },
    ],
  },
  {
    title: "SW Architecture 구축 절차",
    course: "SE",
    definition:
      "요구사항을 분석하고 품질속성을 식별하여 아키텍처를 설계하고, 평가·승인까지 수행하는 절차",
    defShort: "요구 분석·품질속성 식별·설계·평가까지의 아키텍처 구축 절차",
    keywords: ["요구사항분석", "아키텍처분석", "아키텍처설계", "검증 및 승인", "품질속성", "아키텍처 스타일", "평가"],
    tables: [
      {
        caption: "구축 절차",
        headers: ["설계단계", "설계항목", "설명"],
        rows: [
          ["요구사항 분석", "요구사항 분석", "기능적/비기능적 요구 사항 분석, 식별, 명세, 분류, 검증"],
          ["아키텍처 분석", "품질속성 식별", "품질 속성 식별, 우선순위 결정, 반영 방법을 개발"],
          ["아키텍처 설계", "관점 정의", "이해 관계자 파악 및 이해 관계자 별 관점(view)을 정의"],
          ["아키텍처 설계", "아키텍처 스타일 선택", "pipe-filter, mvc, layer 등 스타일을 혼용하여 적용"],
          ["아키텍처 설계", "후보 아키텍처 도출", "배경도(context diagram) 및 각 관점별 다이어그램을 작성. 소프트웨어 아키텍처 명세서(SAD) 기술"],
          ["검증 및 승인", "아키텍처 평가", "아키텍처의 요구 사항 만족도, 적합성 등을 평가. 품질속성(성능, 사용, 보안, 안전성, 검증성, 변경성)간 관계 평가"],
          ["검증 및 승인", "아키텍처 상세화(반복)", "설계 패턴을 고려하며 설계 방법을 도출"],
          ["검증 및 승인", "아키텍처 승인", "이해 관계자들이 최종 승인을 함"],
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
    defShort: "4계층 관심사 분리로 모듈성·확장성을 높인 아키텍처",
    keywords: ["관심사 분리", "Entites", "Use Case", "Interface Adapters", "Frameworks & Drivers"],
    tables: [
      {
        caption: "구성 요소 (4계층)",
        headers: ["계층", "특징", "설명"],
        rows: [
          ["Entity", "핵심업무 규칙 캡슐화", "Entity 내부 핵심업무 규칙 호출, 시스템 사용 흐름 표현. 인터페이스나 클래스 내부에 속성과 메소드 형태로 작성"],
          ["Use Case", "시스템의 모든 Use Case 캡슐화&구현", "Entity 와 상호작용하며, Entity 와의 데이터 흐름 조합 및 조정. 엔티티 즉, Project 레벨의 Biz. 규칙 사용해 유즈케이스 목적 달성"],
          ["Interface Adapter", "Presenter, View, Controller", "Domain 과 Infrastructure 사이의 번역기 역할 수행. Use Case 와 Entity의 Output 가져와 GUI에 표시 or DB에 저장하기 편리한 형식으로 변환"],
          ["External Interface", "Framework, Drivers", "모든 I/O components (UI, DB, Frameworks, Devices) 포함. 변화될 가능성 매우 높아 안정적인 도메인과 확실히 분리"],
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
    defShort: "아키텍처 설계의 근간이 되는 요구 항목을 추출·정제한 것",
    keywords: ["기능 요구", "비기능 요구", "품질 요구", "제약 사항"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "사례", "설명"],
        rows: [
          ["기능 요구 사항", "시스템은 차량 트래픽 정보를 제공해야 한다", "System이 갖춰야 할 기본 기능"],
          ["품질 요구 사항", "시스템은 차량 트래픽 정보를 1분 간격으로 최대 10만명에게 제공해야 한다", "System의 기능이 도달해야 하는 목표"],
          ["제약 사항", "시스템 개발은 시간 단축을 위해 J2EE 기반으로 개발되어야 한다", "System과 무관한 제약 사항"],
        ],
      },
      {
        caption: "비기능 요구사항 영역",
        headers: ["영역", "특징", "설명"],
        rows: [
          ["기술적 제약", "Legacy System·신기술 영향", "System이 사용·구성하는 특정 기술을 명시하여 구현기술을 제한"],
          ["비즈니스 제약", "대부분 타협 불가", "거버넌스, 비즈니스 전략 등 측면에서 Business 지속·성장 시키기 위한 제약"],
          ["품질 제약", "Stakeholder간 각 관심 분", "확장성, 가용성, 변경 용이성, 이식성, 사용성, 성능 등에 대한 요구"],
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
    defShort: "품질 특성 기준으로 시나리오를 작성하는 평가 분석 구조",
    keywords: ["유틸리티", "품질속성", "세분화된 품질 속성", "시나리오", "시나리오 우선순위", "부분→전체", "Bottom Up"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "설명"],
        rows: [
          ["품질 속성", "시스템이 이해당사자의 요구를 얼마나 잘 만족시키는지를 나타내는 측정 가능하고 테스트가 가능한 특성"],
          ["시나리오", "특정 작업(task)을 위해 소프트웨어를 사용하는 방법에 대한 설명. 작업을 위한 프로세스를 거치면서, 사용자가 어떻게 행동하는지에 대한 시뮬레이션(simulation)과 설명"],
        ],
      },
      {
        caption: "유틸리티 트리와 브레인 스토밍 비교",
        headers: ["비교항목", "유틸리티 트리", "브레인 스토밍"],
        rows: [
          ["이해관계자", "아키텍트, 프로젝트 리더", "모든 이해관계자"],
          ["참여규모", "평가자 2~3명", "평가자 5~10명"],
          ["1차 목표", "품질 속성 요구 사항 도출→구체화→우선순위 결정", "이해 관계자들 사이 원활한 우선 순위 도출 목적, 유틸리티 트리에서 도출한 품질 속성 목표의 적합성 검증"],
          ["접근법", "품질 속성으로부터 시나리오 도출 / 부분→전체 / Bottom Up 방식", "시나리오로부터 품질 속성 도출 / 전체→부분 / Top-Down 방식"],
          ["형식", "MECE, Tree", "특정 형식 없음"],
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
    defShort: "비기능 요구를 상호작용 시나리오로 도출하는 기법",
    keywords: ["자극유발원", "환경", "응답측정"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성항목", "상세설명", "특징"],
        rows: [
          ["자극 유발원(Source)", "자극을 만들어 내는 존재", "사람, 시스템, 기타 장치"],
          ["자극(Stimulus)", "시스템 반응의 원인이 되는 조건", "시스템 도달 시 고려사항"],
          ["환경(Environment)", "자극 발생 시 상황이나 시스템의 상태", "정상 상태, 과부하 상태 등"],
          ["대상(Artifact)", "자극에 의해 자극을 받는 대상", "전체 시스템 또는 시스템 일부"],
          ["응답(Response)", "자극이 시스템 도달 후 취해지는 동작", "측정 가능한 결과값 발생"],
          ["응답 측정(Response Measure)", "측정이 가능한 결과값", "요구사항 검증이 가능한 상태"],
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
    defShort: "반복 문제 해결과 품질 달성의 검증된 아키텍처 유형",
    keywords: ["칠저일파", "번규주원래클", "마슬마서", "이브"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "서브타입", "설명"],
        rows: [
          ["데이터 중심(Data-Centered)", "칠판형 (Blackboard)", "데이터의 정확성을 위한 품질특성 구현 목적"],
          ["데이터 중심(Data-Centered)", "저장소형 (Repository)", "광범위하게 접근되는 데이터 저장소에 대한 접근과 갱신작업 초점"],
          ["데이터 흐름(Data Flow)", "일괄 순차형 (Batch Sequence)", "컴포넌트들이 독립적인 프로그램으로 구성. 한 컴포넌트가 수행 완료 후 다음 컴포넌트 수행. 전통적 데이터 처리 응용분야에서 사용"],
          ["데이터 흐름(Data Flow)", "파이프 필터형 (Pipes and filters)", "연속 컴포넌트들에 의한 데이터의 점진적 변형 구조. 필터: 데이터 스트림 변환기 / 파이프: 필터 간 단순한 데이터 이동"],
          ["가상 머신(Virtual Machine)", "번역기형 (Interpreter)", "S/W 시스템의 이식성 구현에 초점"],
          ["가상 머신(Virtual Machine)", "규칙기반 시스템형 (Rule-Based System)", "시스템이 구현될 H/W나 S/W에서의 Simulation 수행"],
          ["호출과 리턴(Call and Return)", "주 프로그램과 서브루틴 (Main Program and subroutine)", "하나의 프로그램을 작은 단위의 서브루틴으로 구성하여 소프트웨어 시스템의 수정성, 품질 특성 구현"],
          ["호출과 리턴(Call and Return)", "원격 프로시저 호출 (Remote Procedure call)", "SW 시스템을 네트워크로 연결된 컴퓨터 상에서 실행되는 작은 단위의 서브루틴으로 구성해 분산처리"],
          ["호출과 리턴(Call and Return)", "Layered Architecture", "SW를 계층 단위로 분할, 각 계층은 인접 이웃과 통신. 시스템 수정용이성, 이식성 품질특성 구현"],
          ["호출과 리턴(Call and Return)", "Client and Server", "Client는 Server에게 서비스를 요청하고 Server는 관련 서비스를 Client에게 제공"],
          ["분산 구조", "Master and Slave", "Master는 일을 분산시키고 Slave가 반환하는 결과값 들을 종합하여 처리"],
          ["분산 구조", "Micro Service Architecture", "각 응용프로그램을 독립적으로 배치 가능한 서비스 단위로 분리하고, 이들의 조합으로 시스템을 구성하는 아키텍처 스타일. REST API를 이용하여 Micro service와 API Gateway간 통신"],
          ["중계", "Event-bus Pattern", "이벤트 소스, 이벤트 리스너, 이벤트 채널, 이벤트 버스. 소스들은 채널의 이벤트 버스를 통해 메시지 전달, 리스너들은 채널 구독"],
          ["중계", "Broker", "서버의 서비스 정보를 broker에 제공. 클라이언트는 broker에게 서비스요청. broker는 등록된 서버 중 적당한 서버를 클라이언트에게 리다이렉트"],
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
    defShort: "아키텍처가 품질 특성을 충족하는지 평가하는 절차",
    keywords: ["SAAM", "CBAM", "ATAM", "EATAM", "ADR", "ARID"],
    tables: [
      {
        caption: "SW아키텍처 평가모델 상세 설명",
        headers: ["구분", "모델", "목표", "설명"],
        rows: [
          ["시나리오 기반 평가모델", "SAAM", "수정 가능성과 기능성에 집중", "Software Architecture Analysis Method. 수정 가능성과 기능 분석 중심의 최초의 아키텍처 평가 방법"],
          ["시나리오 기반 평가모델", "ATAM", "SAAM 계승, 품질 요소간 Trade-Off 평가", "Architecture Tradeoff Analysis Method. 품질목표 간에 Trade off가 있는지 파악 가능한 아키텍처 평가방법"],
          ["시나리오 기반 평가모델", "CBAM", "편익 분석을 통해 투자가치 판단", "Cost Benefit Analysis Method. ATAM의 평가를 보완하여 시스템 구축 시 경제성 평가까지 하여 수익이 최대가 될 수 있도록 의사결정을 도와주는 SW아키텍처 평가모델"],
          ["시나리오 기반 평가모델", "EATAM", "Product Line 확장 평가", "Extending Architecture Trade off Analysis Method. 개별 평가모델의 확장, 스테이지 기반 모델을 통한 Product Line 아키텍처 평가 수행"],
          ["설계/혼합 기반 평가모델", "ADR", "ATAM과 ARID 혼합", "Active Design Review. 설계기반 아키텍처 구성요소 간 응집도 평가"],
          ["설계/혼합 기반 평가모델", "ARID", "특정 부분의 품질 요소 집중", "Active Reviews for Intermediate Designs. 초기에 일부 설계만 완료되었더라도 쉽게 평가하도록 하여 초기 발생 가능성 위험 감소. 시나리오 중심의 ATAM, SAAM과 설계 검토 방법인 ARD를 혼합"],
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
    defShort: "시나리오별 효용을 이득·비용으로 분석하는 평가 프레임워크",
    keywords: ["비용 효율", "2단계 반복", "효용-반응 곡선", "불확실성 고려"],
    tables: [
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["2단계 반복", "1차 반복: 아키텍처 접근법 우선순위 / 2차 반복: 위험, 불확실성, 자원관계까지 고려하여 재평가"],
          ["효용-반응 곡선", "시나리오의 반응값(성능, 비용, 보안 등의 지표)과 이에 따른 효용(총 가치 또는 만족도)의 관계 시각화"],
          ["불확실성 고려", "효용 곡선 값은 이해관계자의 경험에 따라 결정되기 때문에 불확실성 초래 가능성 있음"],
        ],
      },
      {
        caption: "CBAM 상세 절차",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["시나리오 결정", "시나리오 수집", "기존의 ATAM의 시나리오 또는 신규 시나리오 수집"],
          ["시나리오 결정", "시나리오 정제", "시나리오마다 최선, 최악, 현재, 기대 반응 값을 찾아 시나리오 집합 생성"],
          ["시나리오 결정", "시나리오 우선순위", "기대 반응 값에 따라 상위 1/2 시나리오 선별, 우선 순위별 가중치 부여"],
          ["효용-반응값 곡선 선정", "효용-반응 값 곡선 작성", "2단계에서 찾은 최선, 최악, 현재, 기대 반응 값으로 효용-반응 값 곡선 추정"],
          ["아키텍처 접근법 이익 계산", "예상반응 값 결정", "시나리오를 담당하는 아키텍처 접근법 연결, 예상 반응 값 결정"],
          ["아키텍처 접근법 이익 계산", "예상 효용 계산", "효용-반응 값 곡선 이용해서 예상 반응 값에 대한 예상 효용을 계산"],
          ["아키텍처 접근법 이익 계산", "전체 이익 계산", "시나리오 별 우선순위 가중치를 반영하여 모든 시나리오의 이익 계산"],
          ["아키텍처 접근법", "ROI 계산, 순위 결정", "ROI를 기준으로 아키텍처 접근법들의 순위 결정"],
          ["아키텍처 접근법", "선정, 결과 검증", "비용과 일정을 고려하여 아키텍처 접근법을 선정, 결과검증"],
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
    defShort: "언어·공정에 독립적인 표준 모델링 언어",
    keywords: ["가시화", "구체화", "명세화", "문서화", "정적/동적 다이어그램", "13개 다이어그램 명칭"],
    tables: [
      {
        caption: "정적 다이어그램 (Structure Diagram)",
        headers: ["다이어그램", "내용"],
        rows: [
          ["Class", "시스템 내 클래스들의 정적 구조를 표현"],
          ["Component", "컴포넌트(component)는 논리적 클래스 혹은 클래스 자신의 구현에 대한 정보를 포함함"],
          ["Object", "Object 이름에 밑줄 표시를 하며, 관계 있는 모든 인스턴스를 표현함"],
          ["Deployment", "HW와 SW간의 물리적 구조를 표현하며, 실질적인 컴퓨터와 Device간의 관계를 표현하는데 이용"],
          ["Composite Structure", "분류자의 복합 구조를 표현하는 다이어그램. port, part, connector, Collaboration으로 분류자 내부 구조 표현"],
          ["Package", "패키지들과 패키지 내부의 요소를 표현. 클래스, 인터페이스 분류자 등을 그룹화하여 표기"],
        ],
      },
      {
        caption: "동적 다이어그램 (Behavior Diagram)",
        headers: ["다이어그램", "내용"],
        rows: [
          ["Activity", "행위(Activity)의 순서적 흐름을 표시함"],
          ["Use Case", "외부 행위자(Actor)와 시스템이 제공하는 여러 개의 Use Case(시스템을 사용하는 다양한 경우)에 연결하여, Use Case 다이어그램은 유즈케이스 뷰를 다룬다"],
          ["State", "클래스의 객체가 가질 수 있는 모든 가능한 상태 기술"],
          ["Interaction", "4개의 다이어그램을 통합한 그룹 (시퀀스·커뮤니케이션·인터랙션 오버뷰·타이밍)"],
          ["Sequence", "여러 객체 사이에 동적인 협력 사항을 표현함. 오브젝트(Object) 사이에 메시지를 보내는 순서를 보여주기 위해 사용"],
          ["Communication", "객체들 간의 상호작용을 연결에 초점을 맞춰 기술"],
          ["Interaction Overview", "액티비티 다이어그램과 시퀀스 다이어그램의 혼합 다이어그램"],
          ["Timing", "시간의 흐름에 따른 상태를 표현"],
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
    defShort: "객체 타입과 정적 관계를 표현한 정적 다이어그램",
    keywords: ["이름", "Attribute", "Operation", "접근제어자(Public, Private, Protected, Package)", "관계(연관, 직접연관, 집합연관, 복합연관, 의존, 일반화, 실체화)"],
    tables: [
      {
        caption: "접근 제어자",
        headers: ["구성요소", "설명", "표기법"],
        rows: [
          ["Public", "어떤 클래스의 객체에서든 접근 가능", "+"],
          ["Private", "해당 클래스에서 생성된 객체들만 접근 가능", "−"],
          ["Protected", "해당 클래스와 동일 패키지에 있거나 상속 관계에 있는 하위 클래스의 객체들만 접근 가능", "#"],
          ["Package", "동일 패키지에 있는 클래스의 객체들만 접근 가능", "~"],
        ],
      },
      {
        caption: "관계",
        headers: ["관계", "설명", "표기법"],
        rows: [
          ["연관관계(Association)", "두 클래스간 서로 어떠한 연관을 가지고 있는 의미 (인스턴스 표기법: 1, 0..1, *, 1..*)", "실선"],
          ["직접연관관계(Direct Association)", "연관관계와 다르게 방향성 존재. 참조하는 쪽과 참조 당하는 쪽을 구분", "실선 화살표"],
          ["집합연관관계(Aggregation)", "클래스와 클래스간의 부분과 전체의 관계를 의미", "속이 빈 마름모"],
          ["복합연관관계(Composition)", "집합연관관계와 같이 부분과 전체 관계이나, 전체 클래스 소멸 시 부분클래스도 소멸되는 관계", "채워진 마름모"],
          ["의존관계(Dependency)", "한 클래스의 변화가 다른 클래스에 영향을 미치는 관계", "점선 화살표"],
          ["일반화 관계(Generalization)", "상위와 하위의 관계를 의미. 하위는 상위의 공통점을 상속받아 가짐 'is a 관계' 또는 'is a kind of' 관계라고도 함", "속이 빈 삼각형 화살표"],
          ["실체화 관계(Realization)", "인터페이스와 그 인터페이스를 구현한 클래스 사이의 관계를 의미", "점선 + 속이 빈 삼각형"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["클래스", "모델링 하고자 하는 시스템의 내부 개념을 표현하며 이름, attribute, operation 으로 구성. 이름(클래스 이름 기입, 예: Animal) / Attribute(접근제어자, 변수이름, 자료형이 포함, 예: −name : string) / Operation(메소드이름, 접근제어자, 리턴타입이 포함, 예: +eat() : void)"],
          ["스테레오 타입(Stereo Type)", "UML에서 제공하는 추가적인 확장 요소. 길러멧(guillemet, « ») 사이에 스테레오 타입의 특성 정의. «interface», «utility», «abstract», «enumeration»"],
        ],
      },
    ],
  },
  {
    title: "유즈케이스 다이어그램",
    course: "SE",
    definition:
      "시스템이 제공하고 있는 기능 및 그와 관련된 외부요소를 사용자의 관점에서 표현하는 동적 다이어그램",
    defShort: "기능과 외부요소를 사용자 관점에서 표현한 다이어그램",
    keywords: ["액터", "유즈케이스", "시스템", "연관", "확장", "포함", "일반화", "그룹화"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["분류", "구분", "설명", "표기법"],
        rows: [
          ["기본 구성", "Usecase", "시스템이 제공해야 하는 서비스. Actor가 시스템을 통한 일련의 행위", "타원"],
          ["기본 구성", "Actor(행위자)", "사용자가 시스템에 대해 수행하는 역할(role). 시스템과 상호작용하는 사람 또는 사물", "졸라맨"],
          ["기본 구성", "시스템(System)", "전체시스템의 영역을 표현. 특별한 의미를 가지지 못함", "사각 테두리"],
          ["관계 표현", "연관(Association)", "Usecase와 Actor의 관계 표현(실선)", "실선"],
          ["관계 표현", "확장(Extend)", "기본 Usecase 수행 시 특별한 조건을 만족할 때 수행하는 Usecase", "«extend» 점선 화살표"],
          ["관계 표현", "포함(Include)", "시스템의 기능이 별도의 기능을 포함(점선). Usecase 를 수행할 때 다른 Usecase 가 반드시 수행되는 것", "«include» 점선 화살표"],
          ["관계 표현", "일반화(Generalization)", "하위 Usecase/Action이 상위 Usecase/Actor에게 기능/역할을 상속 받음", "속이 빈 삼각형"],
          ["관계 표현", "그룹화(Grouping)", "여러 개의 Usecase를 단순화 하는 방법", "Package"],
        ],
      },
      {
        caption: "작성 절차",
        headers: ["절차", "설명"],
        rows: [
          ["Actor 식별", "시스템의 사용자 식별, 상호작용 하는 타 시스템 식별"],
          ["Use Case 식별", "액터가 요구하는 서비스 식별, 액터가 요구하는 정보 식별, 액터가 시스템과 상호작용하는 행위를 식별"],
          ["Relationship 정의", "액터와 액터간의 관계 분석 및 정의, 액터와 유스케이스 관계 분석 및 정의, 유스케이스와 유스케이스 관계 분석 및 정의"],
          ["Use Case 구조화", "2개 이상의 유스케이스에 있는 공통 서비스 추출, 추출된 서비스를 유스케이스로 정의, 추출된 유스케이스를 사용하는 유스케이스 및 사용자 관계 정의"],
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
    defShort: "객체의 상태와 사건에 따른 전이를 묘사한 다이어그램",
    keywords: ["상태", "전이", "이벤트", "전이조건"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명", "표기법"],
        rows: [
          ["상태", "객체가 가질 수 있는 조건이나 상황. 두영역을 분리하여 기입. 상단: 상태 이름(필수) / 하단: 진입(Entry), do, 탈출(Exit) 등 상세활동(선택적)", "모서리 둥근 사각형"],
          ["시작상태", "객체의 Lifetime 시작", "● (검은 원)"],
          ["종료상태", "객체의 Lifetime 종료", "◉ (겹친 원)"],
          ["전이", "하나의 상태에서 다른 상태로 변화하는 것. 상태 간의 관계를 의미", "화살표"],
          ["이벤트", "객체의 전이를 유발하는 자극", "화살표 위 이름"],
          ["전이조건", "특정 조건 만족 시, 전이 발생하도록 하기 위해 사용되는 속성 값의 불리언 식", "[전이조건]"],
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
    defShort: "객체 간 메시지 교환을 시간 순서로 표현한 동적 다이어그램",
    keywords: ["액터", "활성 객체", "생명선", "제어사각형", "메시지", "프레임", "연산자"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명", "표기법"],
        rows: [
          ["액터(Actor)", "시스템과 상호작용하는 사용자", "졸라맨"],
          ["활성 객체", "메시지 교환에 참여하는 객체. 다이어그램 맨 위에 위치", "사각형"],
          ["생명선", "객체가 인터랙션이 시작되기 전에 존재하고 끝난 후에도 계속 있다면 점선은 맨 위에서 아래까지 이어짐", "세로 점선"],
          ["제어사각형", "객체가 메시지를 주고받는 상태. 생명선 위에 위치", "가는 세로 막대"],
          ["메시지", "동기식: 호출 후 응답을 대기해야 함 / 비동기: 호출 후 응답을 대기할 필요 없음 / 응답: 메시지를 받은 객체로부터 제어가 돌아옴", "동기식 실선 채운 화살표, 비동기 실선 열린 화살표, 응답 점선 화살표"],
          ["프레임", "UML2.0 에서는 시퀀스 다이어그램을 프레임 안에 작성함. 왼쪽 위 부분에 종류와 제목을 표시", "sd 이름"],
          ["연산자", "loop: 여러 번에 걸쳐 실행됨, 반복 조건 명시 / opt: 주어진 조건이 참일 때 실행 / par: 병렬처리 동작을 나타낼 수 있음", "loop, opt, par"],
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
    defShort: "액티비티 대신 시퀀스로 흐름을 상세 표현한 행위 다이어그램",
    keywords: ["Activity와 Sequence의 결합"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["Diagram", "구성요소", "설명", "표기법"],
        rows: [
          ["Activity", "Activity State", "워크 플로우 상의 작업 단계", "ActionState"],
          ["Activity", "Initial/Final state", "시작 및 종료 지점", "● / ◉"],
          ["Activity", "Decision", "의사결정 지점", "◇"],
          ["Activity", "Transition", "제어 흐름의 전달", "화살표"],
          ["Sequence", "활성 객체", "시스템의 행위자 또는 유효한 객체", "«javascript» Comments"],
          ["Sequence", "메시지", "다른 활성 객체 간의 의사소통 묘사", "Message 화살표"],
          ["Sequence", "제어 사각형", "객체의 제어와 정보의 대기상태 표시", "세로 막대"],
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
    defShort: "앱을 작은 서비스 단위로 나눠 변경·조합 가능한 아키텍처",
    keywords: ["API Gateway", "Orchestration", "REST API", "Persistent", "DevOps", "DDD(Domain Driven Design, 도메인 주도 설계)", "Polyglot(폴리글랏, 크로스 플랫폼인 데이터 교환을 의미)"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "설명", "구현 기능"],
        rows: [
          ["API Gateway", "User Layer와 Micro-service layer 연계. API에 대한 Endpoint 통합. RESTful 기반의 Request, Response 관리", "API Policy Management, Load Balancing, Transaction/Session Monitoring"],
          ["API Server", "상호 독립적으로 배포/관리 가능한 단위로 분리된 개별 서비스를 API 형태로 구현한 서버 계층", "DDD기반 비즈니스 기능 분리"],
          ["Persistence", "API Server에서 사용하는 데이터 지속성 계층. 다양한 기술기반 데이터 베이스 활용", "RDB/NoSQL/New SQL, Polyglot Persistence 구현"],
          ["User/Client", "웹/모바일 등 Client 애플리케이션. MSA 제공 서비스를 API를 통해 활용하는 주체", "Web 서비스"],
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
    defShort: "클라이언트 요청을 내부 API 형태로 변환·전달하는 게이트웨이",
    keywords: ["프록시", "프로토콜 변환", "보안(인증, 로깅)", "라우팅", "마이크로 서비스"],
    tables: [
      {
        caption: "역할",
        headers: ["구분", "역할", "설명"],
        rows: [
          ["보안", "내부 데이터 보호", "내부 인프라의 보호 및 민감 데이터 암호화를 담당하여 내부에서 사용되는 데이터를 외부로부터 보호"],
          ["보안", "접근 통제", "비인가자의 접근을 막기 위한 계정에 대한 증명, 보안정책을 적용한 접근 관리"],
          ["보안", "로깅 및 모니터링", "비정상 행위를 감지하기 위한 모니터링, 장애처리를 위한 로그 수집 및 저장"],
          ["서비스 연결", "클라이언트 요청 변환", "모바일 디바이스, 웹 브라우저, 외부 API 요청 등에 대하여 내부 마이크로 서비스가 처리가 가능하도록 서비스 변환"],
          ["서비스 연결", "백엔드 처리 결과 반환", "각 마이크로 서비스가 처리 완료된 결과를 클라이언트에 적합한 형태로 변환하여 전달"],
        ],
      },
      {
        caption: "주요 기능",
        headers: ["기능", "세부 기능", "설명"],
        rows: [
          ["보안", "인증 및 인가", "클라이언트 인증을 통한 API Token 생성 및 발급, Token 이용한 인증요청 및 검증"],
          ["보안", "암호화 통신", "데이터 보호를 위한 SSL 암호화 통신 구축과 인증서 관리"],
          ["보안", "로그 기능", "다양한 경로 별 호출 로그 기록 및 관리, 로그 패턴 분석을 통한 장애 관리"],
          ["라우팅", "서비스 매칭", "다수 엔드 포인트와 마이크로 서비스 간 라우팅 결정"],
          ["라우팅", "로드 밸런싱", "백엔드 서버 로드 밸런싱, 메시지/헤더 기반 라우팅"],
          ["Mediation", "HTTP/JSON 기반 프로토콜 변환", "클라이언트의 요청 메시지에 대하여 마이크로 서비스 처리를 위한 프로토콜 변환"],
          ["기타", "서비스 오케스트레이션", "다양한 마이크로 서비스를 묶어 신규 서비스 제공"],
          ["기타", "서비스 디스커버리", "서비스별 위치(동적IP 및 포트번호)에 대한 관리"],
          ["기타", "서비스 통계", "서비스별 접속 통계를 통한 미터링 및 빅데이터 연계"],
        ],
      },
    ],
  },
  {
    title: "SAGA패턴",
    course: "SE",
    definition:
      "마이크로 서비스들끼리 이벤트를 주고 받는 도중 작업이 실패하면 이전까지의 작업이 완료된 마이크서비스들에게 보상(complementary)이벤트를 소싱함으로써 분산 환경에서 원자성을 보장하는 패턴",
    defShort: "실패 시 보상 이벤트로 데이터 정합성을 지키는 MSA 패턴",
    keywords: ["트랜잭션처리", "Choreography 방식", "Orchestration 방식", "데이터 정합성 보장"],
    tables: [
      {
        caption: "Choreography 와 Orchestration 비교",
        headers: ["구분", "Choreography Based SAGA", "Orchestration Based SAGA"],
        rows: [
          ["개념", "보유한 서비스 내의 Local 트랜잭션을 관리하며 Event 전파를 통해 트랜잭션을 관리하는 패턴", "트랜잭션 처리를 위해 Saga 인스턴스(Manager)가 별도로 존재하며, 트랜잭션에 관여하는 모든 App은 Manager에 의해 트랜잭션을 수행하여 일관성을 보장하는 패턴"],
          ["트랜잭션 설명", "트랜잭션을 수행해야 하는 App으로 이벤트를 보내고, 해당 App은 완료 Event를 수신 받고 다음 작업을 진행하며 Kafka와 같은 메시지 큐를 통해 비동기방식으로 전달", "중앙 트랜잭션 관리 인스턴스를 통해서 트랜잭션을 요청하고 완료를 수신함으로써 트랜잭션 처리를 하고 모든 앱이 완료되면 인스턴스 종료로 트랜잭션 처리를 완료"],
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
    defShort: "공통 언어로 모델링·개발 불일치를 해결하는 도메인 중심 설계",
    keywords: ["유비쿼터스 언어", "도메인", "서브도메인", "바운디드 컨텍스트", "컨텍스트 맵", "도메인 모델", "Entity", "Value", "Aggregate", "Repository", "Service"],
    tables: [
      {
        caption: "설계 유형",
        headers: ["구분", "설명"],
        rows: [
          ["전략적 설계(Strategic Design)", "비즈니스상 전략적으로 중요한 것을 구분하고 찾는 과정으로 유비쿼터스 언어로 바운디드 컨텍스트(Bounded Context, 제한된 경계)를 도출하고 컨텍스트 맵을 작성하며, 최종적으로 서비스를 도출. 분석 단계에 수행"],
          ["전술적 설계(Tactical Design)", "도메인 모델을 만드는 데 사용할 수 있는 디자인 패턴 집합을 제공하며, 내부 아키텍처 설계. 설계 단계에 수행"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["계층 구조", "User Interface", "사용자 요청을 하위 계층에 전달"],
          ["계층 구조", "Application", "App 상태관리, Biz처리는 도메인에 요청"],
          ["계층 구조", "Domain", "Domain 정보 및 상태 포함 Biz. Logic 제공"],
          ["계층 구조", "Infrastructure", "다른 계층 지원 라이브러리 영속성 구현"],
          ["구현 패턴", "엔티티(Entity)", "영속성이 필요한 고유한 식별자(ID)를 가진 객체"],
          ["구현 패턴", "값 객체(Value Object)", "개념적으로 식별이 필요 없고, 단순히 값 만을 가지고 있는 객체"],
          ["구현 패턴", "서비스(Service)", "Entity 등 여러 객체에서 발생하는 행위 담당"],
          ["구현 패턴", "어그리거트(Aggregate)", "도메인을 구성하는 엔티티(Entity)와 값 객체(Value Object)의 묶음"],
          ["구현 패턴", "팩토리(Factory)", "객체 생성의 절차 캡슐화"],
          ["구현 패턴", "레파지토리(Repository)", "생성된 Aggregate에 대한 영속성 관리. 엔티티 저장, Aggregate 업데이트 및 삭제"],
          ["구현 패턴", "도메인 이벤트(Domain Event)", "도메인내 변경의 파생 작업을 명시적으로 구현. 트리거, 타 시스템간 데이터 동기화"],
          ["모델 관리", "Module", "낮은 결합도, 높은 응집도 구현"],
          ["모델 관리", "Refactoring", "코드 및 모델 리팩토링, 설계영역 재검토"],
        ],
      },
    ],
  },
  {
    title: "Event Driven Architecture",
    course: "SE",
    definition:
      "데이터의 변경, 생성, 삭제 등 이벤트 발생 등 상태변화에 반응하여 서비스가 변화하는 형태의 소프트웨어 아키텍처",
    defShort: "상태변화 이벤트에 반응해 서비스가 동작하는 아키텍처",
    keywords: ["이벤트 프로듀서", "이벤트 채널", "이벤트 처리 엔진", "다운스트림 이벤트 기반활동"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성요소", "설명", "특징"],
        rows: [
          ["이벤트 프로듀서", "이벤트를 감지하고 감지한 이벤트를 메시지로 표현. Publisher, Producer, Creator 등 다양한 표현", "감지된 이벤트를 채널로 전달"],
          ["이벤트 채널", "이벤트 프로듀서로 응답, 이 응답을 다운스트림으로 이벤트 소비자에게 전달. 큐에 저장하고 나중에 이벤트 처리 엔진에서 처리 대기", "실시간 이벤트 처리 필요, 비동기식"],
          ["이벤트 처리 엔진", "수신한 이벤트를 식별한 후 다음 이벤트에 맞는 반응을 실행하는 논리적인 계층", "비즈니스 로직 실행"],
          ["다운스트림 이벤트 기반 활동", "이벤트의 결과가 표시되는 논리적인 계층으로 알림, 경고 표시", "싱크 수준에 따른 다운스트림 활동 불필요"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["활용 사례", "설명"],
        rows: [
          ["시스템 확장성", "시스템의 성능보다 확장성이 중요하고, 복합 이벤트 처리가 필요한 경우 활용"],
          ["병렬 처리", "여러 하위 시스템이 동일한 이벤트를 처리하거나 병렬로 실행해야 하는 경우 활용"],
        ],
      },
    ],
    notes: ["Event Producers(Web Site·Mobile App·Retail App) → Event Router/Broker/Bus → Event Consumers(Inventory·Order·Payment Service)가 구독"],
  },
  {
    title: "디자인 패턴 (Design Pattern)",
    course: "SE",
    definition:
      "소프트웨어 개발의 여러 가지 문제 해결 설계 사례를 분류하고, 각 문제 유형별로 가장 적합한 설계를 일반화한 패턴",
    defShort: "문제 유형별 최적 설계를 일반화한 패턴(생성·구조·행위)",
    keywords: ["개발 중 문제 해결 사례 모음", "생성 패턴", "구조 패턴", "행위 패턴"],
    tables: [
      {
        caption: "디자인 패턴 형식",
        headers: ["구분", "설명", "요소"],
        rows: [
          ["패턴이름(Pattern name)", "설계 의도 표현, 개발자들간 의사소통 지원", "패턴 이름과 분류, 별칭"],
          ["문제(Problem)", "언제 해당 패턴을 사용할지, 해결할 문제와 배경 설명(캡슐화 대상 설명)", "의도/목적, 적용대상"],
          ["해법(Solution)", "패턴의 구성요소, 각 구성요소의 역할, 요소들 간의 관계 표현(캡슐화, 인터페이스, 구성과 위임)", "구조(클래스 다이어그램), 구성요소, 협력방법, 구현/샘플코드"],
          ["결과(Consequence)", "적용해서 얻는 결과, 장단점 서술", "효과, 주의사항, 활용사례, 관련패턴"],
        ],
      },
      {
        caption: "디자인 패턴 분류 [생구행]",
        headers: ["구분", "생성패턴(Creational)", "구조패턴(Structural)", "행위패턴(Behavioral)"],
        rows: [
          ["의미", "객체의 생성방식 결정. 클래스의 정의, 객체 생성 방식의 구조화, 캡슐화", "객체를 조직화하는 일반적인 방식 제시. 클래스 라이브러리를 통합 시 유용", "객체의 행위를 조직화, 관리, 연합하고 객체나 클래스 연동에 대한 유형 제시"],
          ["클래스 범위", "Factory Method", "Adapter(Class)", "Interpreter, Template Method"],
          ["객체 범위", "Abstract Factory, Builder, Prototype, Singleton, Factory method 패턴", "Adapter(Object), Bridge, Composite, Decorator, Facade, Flyweight, Proxy", "Chain of Responsibility, Command, Mediator, Memento, Iterator, State, Strategy, Observer, Visitor"],
          ["암기법", "아 베 프로 시 파", "A B C D 파 플 로", "CCMMISSOTIV"],
        ],
      },
    ],
    notes: ["교재 두음: [생구행] / 생성 '아베프로시파' / 구조 'ABCD파플로' / 행위 'CCMMISSOTIV'"],
  },
  {
    title: "싱글턴 패턴 (Singleton pattern)",
    course: "SE",
    definition:
      "클래스의 인스턴스가 오직 하나만 생성되도록 보장하고, 해당 인스턴스에 접근할 수 있는 전역적인 접근 지점을 제공하는 생성 패턴",
    defShort: "인스턴스를 하나만 생성해 전역 접근을 제공하는 생성 패턴",
    keywords: ["Private 생성자", "Static 인스턴스", "Public 정적 메서드"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["항목", "설명"],
        rows: [
          ["Private 생성자", "외부에서 직접 인스턴스를 생성하지 못하도록 생성자를 private으로 선언"],
          ["Static 인스턴스", "클래스 내부에 static으로 선언된 유일한 인스턴스를 보관할 변수"],
          ["Public 정적 메서드(getInstance)", "외부에서 유일한 인스턴스에 접근할 수 있도록 하는 정적 메서드"],
        ],
      },
      {
        caption: "구현 방식",
        headers: ["항목", "설명"],
        rows: [
          ["Lazy Initialization", "최초 호출 시 객체 생성. 지연 초기화"],
          ["Eager Initialization", "클래스 로딩 시 객체 즉시 생성. 빠름"],
          ["Double-Checked Locking", "멀티스레드 안전성 및 성능 개선"],
          ["Enum Singleton", "Java에서 가장 안전한 싱글턴 구현 방법 (Serialization, Reflection 우회 방지 가능)"],
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
    defShort: "다양한 이해관계자 관점으로 아키텍처를 설계·문서화하는 틀",
    keywords: ["Logical View", "Implementation View", "Process View", "Deployment View", "Use Case View"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "관점", "설명"],
        rows: [
          ["Logical View", "Designers, Analysts", "Use Case View에 표현된 요구사항들을 Class Diagram 등을 이용하여 시스템의 구조와 행동으로 명세화"],
          ["Implementation View", "Programmers (개발자 관점)", "Logical View와 Process View에서 설계한 UML 모델요소(Class와 Interface)들을 물리적인 소프트웨어 모듈로 표현"],
          ["Process View", "System Integrators (시스템 통합관점)", "Thread와 Process에 의한 동작을 중점적으로 표현"],
          ["Deployment View", "System Engineers (시스템 엔지니어)", "Implementation View에서 정의한 UML 모델요소(Component, Interface)를 배치할 하드웨어를 표현"],
          ["Use Case View", "End Users (최종 사용자)", "요구 사항을 분석해 시스템의 기능(Functionality)을 명세화. 전체 View를 아우르는 통합 관점의 View를 제공"],
        ],
      },
      {
        caption: "유사 아키텍처 뷰와 비교",
        headers: ["구분", "4+1 View", "Siemens Four Views"],
        rows: [
          ["목적", "다양한 이해관계자의 관점 충족 및 시스템 복잡성 관리", "아키텍처 설계 과정에서 분석 요인 파악 및 설계 전략 도출"],
          ["핵심", "4가지 주요 관점과 1가지 시나리오 관점으로 설명", "시스템의 아키텍처를 4가지 상호 보완적인 뷰로 분리"],
          ["관점", "논리, 프로세스, 개발, 물리 +1 유즈케이스 뷰", "개념(Conceptual), 코드(Code), 모듈(Module), 실행(Execution)"],
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
    defShort: "데이터 바인딩으로 뷰와 뷰모델 통신을 자동화한 패턴",
    keywords: ["Model", "View", "View Model", "Data Binding"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Model", "어플리케이션에서 사용되는 데이터와 그 데이터를 처리"],
          ["View", "사용자에게 보여지는 UI"],
          ["View Model", "View를 나타내 주기 위한 Model이자 View를 나타내기 위한 데이터 처리"],
          ["Data Binding", "어플리케이션에서 화면의 객체와 데이터를 동기화 시키는 기법. View와 View Model 간의 데이터와 명령을 연결해주는 매개체가 되어 서로의 존재를 명확히 알지 못하더라도 다양한 인터랙션을 도움"],
        ],
      },
      {
        caption: "패턴의 동작",
        headers: ["순번", "동작", "설명"],
        rows: [
          ["1", "요청 처리", "사용자의 Action들은 View를 통해 진입"],
          ["2", "요청 처리", "View에 Action이 들어오면, Command 패턴으로 View Model에 Action을 전달"],
          ["3", "데이터 처리", "View Model은 Model에게 데이터를 요청"],
          ["4", "데이터 처리", "Model은 View Model에게 요청 받은 데이터를 응답"],
          ["5", "데이터 처리", "View Model은 응답 받은 데이터를 가공하여 저장"],
          ["6", "화면 처리", "View는 View Model과 Data Binding하여 화면을 표현"],
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
    defShort: "테스트 케이스를 먼저 만들고 통과 코드를 개발하는 기법",
    keywords: ["[요테구리] 요구사항", "테스트", "구현", "리팩토링"],
    tables: [
      {
        caption: "단계 설명 (요테구리)",
        headers: ["단계", "설명"],
        rows: [
          ["요구사항", "사용자, BA, 제품 개발자 등이 요구사항 Story 작성"],
          ["테스트 작성", "동작 요구기능에 대한 인터페이스 개발"],
          ["구현(코드 작성)", "테스트에 대해 실행 가능한 코드를 빠르게 작성 (임시코드/자료 삽입, 가짜 구현, 명백한 구현)"],
          ["리팩토링", "중복코드/임시코드의 제고, 모듈화, 디자인 패턴"],
          ["체크인", "모든 테스트가 작동하는 깔끔한 코드 저장. 짧은 구현, 많은 반복을 통한 개발을 위해 테스트 사이 간격 조절 능력 필요. 체크인 후 해당 모듈에 대해 요구기능 고도화, 테스트 발전"],
        ],
      },
      {
        caption: "단계별 코드 (Red-Green-Refactor)",
        headers: ["코드", "설명"],
        rows: [
          ["RED", "실패하는 테스트 작성"],
          ["GREEN", "테스트에 통과할 만한 작은 코드 작성"],
          ["REFACTOR", "반복되는 코드, 긴 메소드, 큰 클래스, 긴 매개변수 목록 등의 코드를 좀 더 효율적으로 개선"],
        ],
      },
    ],
    notes: ["TDD의 주문: red, green, refactor — 실패 테스트부터 쓰고, 통과시키고, 다듬는다"],
  },
  {
    topicId: "se-139",
    title: "데브옵스 (DevOps)",
    course: "SE",
    definition:
      "시스템 개발자와 운영을 담당하는 정보기술 전문가 사이의 소통, 협업, 통합 및 자동화를 강조하는 소프트웨어 개발론",
    defShort: "개발과 운영의 소통·협업·자동화를 강조하는 개발론",
    keywords: ["CI/CD", "프로비저닝"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["측면", "구성요소", "설명"],
        rows: [
          ["품질", "품질기준", "시나리오기반 품질 특성 기술"],
          ["품질", "테스트 자동화", "Xunit등으로 단위 테스트 자동화"],
          ["프로세스", "사이클타임 축소", "기능의 흐름(the flow of features)을 지속적으로 향상"],
          ["프로세스", "완료시점 범위확장", "완료(Done)시점 = 운영서버 정상동작 시점"],
          ["프로세스", "지속적 출시(CD)", "지속적 통합(CI)처럼 운영서버 반영 시 자동화, 개발 초기부터 운영 환경 갖춤"],
          ["프로세스", "릴리즈와 배포의 분리", "추상화된 브랜치, 기능 토글: 설정, 다크 런칭: 소스 사용자 대상 배포. 블루 그린배포: 운영환경 두개로 나눠 신규 버전과 이전 버전 병행"],
          ["도구", "지속적 통합(CI)", "Git+Jenkins. 코드는 변경 시마다 통합되어 빌드되고, 자동으로 테스트가 실행되어 결과 리포트 발송"],
          ["도구", "Application 릴리즈 자동화", "형상관리 서버에 자동화된 트리거 기반의 배치 유닛 제공. 자동화된 가드나 조건에 따라 통제된 운영팀은 표준화된 게이트웨이 사용"],
          ["도구", "프로비저닝", "운영조직에서 서버에 빌드 된 코드 블록을 자동으로 설치, 시스템 구성 및 관리하기 위하여 사용"],
        ],
      },
    ],
    notes: ["개념도: DEV(Create·Plan·Verify·Package) ↔ OPS(Release·Configure·Monitor) 무한 루프. Development ∩ QA ∩ Operations = DevOps"],
  },
  {
    topicId: "se-141",
    title: "SRE (Site Reliability Engineering)",
    course: "SE",
    definition:
      "대규모 시스템의 지속적이고 적절한 수준의 안정성을 확보하기 위하여 고도의 자동화와 자가 치유 기능을 제공하는 SW 엔지니어링 기술",
    defShort: "자동화·자가치유로 대규모 시스템 안정성을 확보하는 기술",
    keywords: ["안정성", "자가치유", "자동화", "카나리 배포", "Toil 관리", "Error Budget", "구글 운영팀"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["기법", "설명", "지표 및 기법"],
        rows: [
          ["Metric & Monitoring", "모니터링 지표 정의 및 목표 시각화 관리, 데이터 기반 의사 결정", "SLI(Service Level Indicator), SLO(Service Level Objective)"],
          ["Capacity Planning", "리소스 요청에 대한 유연한 대응, 필요 용량·확보 용량, SW 최적화", "수요 기반 예측, SW 성능 튜닝"],
          ["Change Management", "장애 원인 70%는 시스템 변경. 점진적 배포와 변경, 빠른 롤백", "카나리 배포, 롤링 업데이트"],
          ["Emergency Response", "Play book 기반의 장애 대응 자동화, 장애 복구 모의 훈련", "MTTR(Mean time to recover), Playbook, Toil 관리"],
          ["Culture", "데이터 기반 합리적 의사결정, 비난하지 않는 장애 대응 및 책임 공유 문화", "Error Budget"],
        ],
      },
      {
        caption: "주요 성공 요소(CSF)",
        headers: ["CSF", "설명", "비고"],
        rows: [
          ["Silo 조직의 통합", "SRE와 개발자 간 정보 및 책임 공유, 동일한 개발 및 의사소통 도구 사용", "오너십 공유"],
          ["실패에 대한 수용", "위험에 대한 감수 및 발생 후 대책 수립, 오류와 가용성에 대한 정량화", "Postmortem 회고, Error Budget 관리"],
          ["점진적 구현과 개선", "실패 비용을 줄이고, 올바른 방향에 대한 지원", "카나리 배포, 롤링 업데이트"],
          ["자동화 시스템 사용", "일상적, 반복적 업무 자동화, 사람의 운영 및 오류 최소화", "Toil 관리"],
          ["모든 것에 대한 측정", "측정하기 위한 방법 정의, 시스템 작동의 문제 원인은 SW 문제", "시스템 지표, 수동 작업 시간, 장애 시간"],
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
    defShort: "서비스 중단 없이 운영 환경에 코드를 배포하는 기법",
    keywords: ["Rolling Update", "Blue/Green Deployment", "Canary Release"],
    tables: [
      {
        caption: "무중단 배포 기법 비교",
        headers: ["기법", "설명", "장점", "단점"],
        rows: [
          ["Rolling Update", "동일한 인스턴스를 띄우고, 준비가 된 상황에서 1개씩 Rolling을 통해 점진적으로 인스턴스를 변경하는 기법", "관리 및 롤백이 용이", "서버 처리 용량에 대한 사전 고려 필요"],
          ["Blue/Green Deployment", "Old 버전을 블루, New 버전을 그린으로 호명하고, New 버전을 모두 배포 후 서비스 준비가 되었을 때 모든 트래픽을 New 버전으로 한 번에 Switching 하는 기법", "운영 환경에 영향을 주지 않고, 실제 서비스 환경으로 신버전 테스트 가능", "시스템 자원이 두배로 필요하여 비용이 증가"],
          ["Canary Release", "트래픽 제어를 통해 일부 사용자만 신규 서버로 접속하게 하여 모니터링과 디버깅을 수행한 후 문제가 없는 경우 모든 서버를 교체하는 기법", "Risk를 빠르게 감지 가능, A/B 테스트로도 활용 가능", "네트워크 트래픽에 대한 제어 부담"],
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
    defShort: "안정적·예측 가능한 배포 방법을 연구하는 엔지니어링",
    keywords: ["배포·구현·유지보수", "파이프라인(pipeline)"],
    tables: [
      {
        caption: "주요 역할",
        headers: ["역할", "설명"],
        rows: [
          ["CI/CD 파이프라인 구축", "지속적 통합(CI)과 지속적 배포(CD) 시스템을 개발하고 관리"],
          ["배포 자동화", "사람의 직접 개입에 따른 배포가 아닌 자동화 구축으로 배포 수행"],
          ["설정 관리", "다양한 환경에서의 소프트웨어 설정이 반영 및 유지되도록 관리"],
          ["모니터링 및 분석", "릴리즈 과정과 결과를 모니터링하고 분석하여 지속적인 개선"],
        ],
      },
      {
        caption: "파이프라인 단계",
        headers: ["단계", "주요 업무", "설명"],
        rows: [
          ["A. 통합(Integration)", "브랜칭 및 병합(Branching and Merging)", "개발자의 코드 변경사항을 팀 브랜치, 제품 브랜치를 거쳐 마스터 브랜치로 이동시키는 과정. 버전 관리 시스템(VCS)이 사용되며, Subversion 또는 Git이 대표적인 도구"],
          ["B. 지속적 통합(Continuous Integration)", "빌드 및 테스트", "코드 변경사항을 자동으로 빌드하고 초기 테스트를 수행. Jenkins, Bamboo, Team Foundation Server와 같은 도구를 이용"],
          ["C. 빌드 시스템(Build System)", "빌드 명세 관리", "소스 코드로부터 바이너리, 라이브러리 또는 패키지를 생성하기 위한 명세 파일 집합. GNU Make, Ant, Maven, CMake 등의 빌드 도구가 사용"],
          ["D. 코드형 인프라(IaC, Infrastructure-as-Code)", "환경 설정 자동화", "테스트 및 배포를 위한 서버, 클라우드 또는 가상 머신 환경을 자동으로 생성. Puppet, Chef, Ansible, Docker 등의 도구(tool) 이용"],
          ["E. 배포(Deployment)", "릴리즈 준비를 위한 단계", "릴리즈 준비 단계로, 웹 애플리케이션에서는 파일을 서버로 전송하거나, 모바일 앱에서는 앱 스토어에 제출하는 과정이 포함. 블루/그린 배포, 카나리 배포, A/B 테스트 등의 전략이 사용"],
          ["F. 릴리즈(Release)", "사용자에게 릴리즈 공개", "최종 사용자가 새로운 버전을 이용할 수 있도록 하는 단계. DNS 항목을 변경하거나 앱 스토어에 새 버전을 게시하는 방식으로 수행"],
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
    defShort: "인위적 혼돈으로 분산 시스템의 취약점을 찾아 보강하는 방식",
    keywords: ["Hypothesis", "Fault Injection", "Measuring", "Verify"],
    tables: [
      {
        caption: "프로세스 상세 설명",
        headers: ["절차", "세부 활동", "설명"],
        rows: [
          ["Step 1: Creating a Hypothesis", "Steady System State", "정상 동작을 나타내는 시스템의 측정 가능 통계치로 '정상상태' 정의. 임계값(메트릭) 기준 시스템 장애 시 어떻게 동작할지 예측. 주요 메트릭: 주요 지표별 지연 시간, 초당 요청 또는 시스템 리소스에 미치는 영향을 측정"],
          ["Step 1: Creating a Hypothesis", "Hypothesis", "기대되는 정상상태 및 정상 값에 대한 가설 수립"],
          ["Step 2: Fault Injection", "Fault Injection", "시스템에 특정 오류를 추가하여 정상 상태가 대조군과 실험군 모두에서 계속될 것으로 가정. 역방향 옵션 통해 예측 불가능한 동작에 대한 백업계획 수립"],
          ["Step 3: Measuring the Impact", "Analyze the metrics", "서버 장애, 하드 디스크 오작동, 네트워크 끊김 등과 같은 실제 문제에 대한 변수 정의"],
          ["Step 3: Measuring the Impact", "Fix the failure", "버그가 문제를 일으키는 동안 시스템을 모니터링 수행. 테스트 통해 해결할 수 있는 최선의 방법 모색"],
          ["Step 4: Verify(or Disprove) Your Hypothesis", "Verify", "대조군과 실험군 사이의 정상상태 차이 조사하여 가설 검증. 시스템의 복원력을 확인하거나 해결해야 할 문제 탐색"],
          ["Step 4: Verify(or Disprove) Your Hypothesis", "Improve System", "도출된 결과값 통해 가설된 정상동작 상태를 개선"],
        ],
      },
    ],
    notes: ["넷플릭스 Chaos Monkey가 원조 — 운영 중 서버를 일부러 죽여 복원력을 검증한다"],
  },
  {
    topicId: "sec-341",
    title: "DevSecOps",
    course: "SE",
    definition:
      "Development 와 Operation의 융합과 협업을 통한 개발 주기에서 보안 측면의 주기를 포함하는 개발 방법론",
    defShort: "DevOps 개발 주기에 보안 측면을 포함하는 개발 방법론",
    keywords: ["Development", "Operation", "Security", "Agile", "Visualization", "FMEA", "RASP", "Analysis"],
    tables: [
      {
        caption: "리스크 및 신뢰평가(CARTA) 접근법",
        headers: ["요소", "설명"],
        rows: [
          ["Continuous (지속적인)", "지속적인 보안이 위험관리의 핵심"],
          ["Adaptive (적응형)", "컨텍스트 기반 대처 가능하도록 지속적 학습, 모니터링 관리 중점"],
          ["Risk (위험)", "위험은 단일 이벤트가 아니며 일련의 이벤트 조합에 의해 결정"],
          ["Trust (신뢰)", "사용자 경험에 영향을 주지 않고 지속적인 액세스 관리"],
          ["Assessment (평가)", "이전 단계의 데이터 요소들을 자동으로 실시간 요약, 최종의사결정"],
        ],
      },
      {
        caption: "생명 주기",
        headers: ["구분", "SW 생명주기", "도구 및 기술"],
        rows: [
          ["Cycle별 보안기법", "테스트", "IAST(Interactive Application Security Testing): 정적 + 동적. Fuzzing Test, Pen Testing"],
          ["Cycle별 보안기법", "분석", "FMEA분석"],
          ["Cycle별 보안기법", "컨테이너", "RASP(Runtime Application Self-Protection): 익스플로잇 대응"],
          ["도구", "Code / Build / Test / Release", "형상관리·코드 추적성·단일 버전 유지 / 자동화된 코드 빌드 / 동적·정적 커버리지 자동화 테스트 / 변경관리·변경승인·릴리즈 계획·릴리즈 자동화"],
          ["보안 기능", "Security Engineering / Operations / Science", "보안에 대한 공학적 접근 방법 및 자동화 도구의 제공 / 보안성 확보를 위한 지속적 Monitoring, Detecting 제공 / 보안 모델에 대한 수립, 학습, 전파 및 예측성 제공"],
        ],
      },
    ],
    notes: ["Dev ∞ Ops 무한 루프 한가운데에 Sec — 전 주기에 보안이 스며든 그림"],
  },
  {
    topicId: "se-149",
    title: "테스트 원리",
    course: "SE",
    definition:
      "결함 발견·불완전·초기 시작·결함 집중·살충제 패러독스·정황 의존·오류 부재의 궤변 등 SW 테스트가 따르는 7가지 원리",
    defShort: "결함 발견·결함 집중·살충제 패러독스 등 테스트 7원리",
    keywords: ["살충제 패러독스", "오류부재 궤변", "결함발견", "초기 시작", "불완전", "결함 집중", "정황의존"],
    tables: [
      {
        caption: "SW 테스트 원리",
        headers: ["원리", "내용", "원인 또는 목적"],
        rows: [
          ["결함발견", "결함 제거가 아닌 결함의 발견이 목적", "Test 목표"],
          ["불완전", "완벽한 Testing은 불가능", "자원의 한계"],
          ["초기 시작", "개발 설계 시부터 테스트 고려. 결함 조기 발견 및 재유입 방지", "품질 비용 감소"],
          ["결함 집중(Defect Clustering)", "결함의 80%는 20%의 특정 모듈에 집중", "파레토 법칙"],
          ["살충제 패러독스(Pesticide Paradox)", "동일한 테스트 케이스로 동일한 테스트를 반복적으로 수행한다면 나중에는 더 이상 새로운 결함을 찾아내지 못함", "테스트 케이스에 맞춰진 프로그램 수정"],
          ["정황 의존적", "테스트는 테스트 주변 환경에 영향을 받음", "테스트 목표는 도메인 분야에 영향 받음"],
          ["오류 부재의 궤변(Absence-errors fallacy)", "사용자/비즈니스의 요구사항을 충족시키지 못한다면, 결함을 모두 발견하여 제거하였다 하더라도 아무 소용이 없음", "프로그램 목적은 비즈니스 요구 충족"],
        ],
      },
      {
        caption: "살충제 패러독스와 오류부재의 궤변 개선방안",
        headers: ["구분", "개선방안", "설명"],
        rows: [
          ["살충제 패러독스", "테스트 케이스 개선", "시스템에 잠재된 보다 많은 결함을 발견하기 위하여 테스트 기법을 다른 모듈, 다른 시각에서 재적용하고 개선"],
          ["살충제 패러독스", "테스트 케이스 추가", "여러 테스트케이스 추가"],
          ["오류부재의 궤변", "검증 및 확인", "Validation & Verification을 통하여 사용자와 비즈니스 요구사항에 따라 테스트 대상 제품이 개발되었는지 확인 필요"],
          ["오류부재의 궤변", "제품/프로세스 품질개선", "고객의 적극적 참여를 통한 품질 확인. CMMI, SPICE 등과 같은 SW 품질 프로세스 진단 & 측정"],
        ],
      },
    ],
  },
  {
    title: "리뷰(Review)",
    course: "SE",
    definition:
      "코드를 포함하여 요구사항 정의서, 설계서 등 개발 중간산출물을 실행하지 않고 검토하여, 개발 초기 단계에서 결함을 발견하고 예방하는 핵심적인 정적 테스팅 기법",
    defShort: "산출물을 실행 없이 검토해 초기에 결함을 발견·예방하는 활동",
    keywords: ["비공식적 리뷰", "기술적 리뷰", "워크쓰루", "인스펙션", "페이건의 인스펙션", "Process-계시사미RF", "참여자-관중기작검"],
    tables: [
      {
        caption: "리뷰(Review)의 Process (계시사미RF)",
        headers: ["단계", "목표/산출물", "공식적 리뷰 추가 활동"],
        rows: [
          ["① 계획활동", "참가 인원 선정·역할 분배, 문서·코드 중 Review 대상 선정", "시작·종료 기준 정의"],
          ["② 시작(Kick-Off)", "문서 배포, 리뷰 목표·절차·문서 설명", "시작 기준 점검"],
          ["③ 사전 검토/개별 준비", "참석자별 사전 리뷰 활동, 잠재적 결함·제기할 질문과 의견 기록", "추가 활동 없음"],
          ["④ 리뷰 미팅", "토의와 결과 기록, 결함 여부 결정, 결함 처리 방안 제안", "상세의견록(Minutes) 작성"],
          ["⑤ Re-Work(재작업)", "발견된 결함 대상 수정", "추가 활동 없음"],
          ["⑥ Follow-Up(후속처리 확인)", "결함 조치 여부 확인", "관련 측정치(Metrics) 수집 및 종료 기준 점검"],
        ],
      },
      {
        caption: "리뷰의 형식",
        headers: ["형식", "설명"],
        rows: [
          ["비공식적 리뷰", "절차 생략, 비공식 검토"],
          ["기술적 리뷰", "기술 관점의 동료 검토"],
          ["워크쓰루", "사전 준비 과정이 대부분 생략, 참여 인원도 동일 조직·동일 Level 등으로 역할 제한적, 참여 인원은 비제한적"],
          ["인스펙션", "가장 공식적. 페이건 인스펙션 — 능력있는 2배수의 인력 요구, 전체 비용의 15%로 계획·요구사항·설계·코딩·테스트 전 단계 결함 조기 발견"],
        ],
      },
      {
        caption: "리뷰의 참여자 역할 (관중기작검)",
        headers: ["리뷰 역할", "주요 특징", "설명"],
        rows: [
          ["관리자", "리뷰 목적 달성 승인", "Review 실행 여부 결정, Review 시간 할당"],
          ["중재자(Moderator)", "리뷰 리더 교육 이수", "문서의 리뷰 리드(계획·진행·후속 조치 관리), 참석자들의 다양한 관점 중재"],
          ["기록자", "중간 산출물 작성자", "리뷰 대상 문서의 저자·책임자"],
          ["작성자", "Minutes 작성", "리뷰 미팅에서 발견된 모든 이슈, 문제점, 미해결점 문서화"],
          ["검토자", "테스트 전문가", "해당 도메인의 기술적·비즈니스적 배경 소유, 리뷰 대상에서 인시던트를 발견하는 기술"],
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
    defShort: "내부 구조 없이 입력 대비 출력으로 기능을 확인하는 테스트",
    keywords: ["동등분할", "경계값분석", "의사결정 테이블", "상태전이", "유즈케이스", "분류트리", "페어와이즈 테스트", "원인-결과 그래프 기법", "오류예측기법"],
    tables: [
      {
        caption: "블랙박스 테스트 기법",
        headers: ["기법", "상세 설명"],
        rows: [
          ["동등 클래스 분할 기법", "프로그램의 입력 도메인을 등가 분할 후 각 영역별로 대표되는 값들을 선정하여 테스트 케이스를 설계하는 방법"],
          ["경계값 분석", "입력 영역의 분할 클래스의 경계값으로 테스트 케이스를 설계하는 방법. 결함은 경계 값 근처에서 많이 발생 이용"],
          ["의사결정 테이블 테스팅", "주요한 의사결정 요소들을 표(결정테이블)로 만들고, 요소들간의 결합에 의한 테스트 케이스 설계"],
          ["상태전이 테스팅", "상태전이 다이어그램 통해 이벤트, 액션, 활동, 상태 변화로 발생되는 관계, 동작 파악하며 테스트. 임베디드SW 테스트시 적용"],
          ["유스케이스 테스팅", "유즈케이스를 통해 도출된 비즈니스 시나리오(기본 흐름, 대체 흐름)를 기반으로 테스트를 명세화하여 테스트"],
          ["분류 트리 기법", "SW의 일부 또는 전체를 트리 구조로 분석 및 표현하여 테스트 케이스를 설계하는 기법"],
          ["페어와이즈 테스팅", "대부분 결함이 2개의 요소(Pair)의 상호 작용에 기인한다는 것에 착안하여, 각 값들이 다른 파라미터의 값과 최소 한번씩은 조합을 이루도록 구성하는 테스트 기법"],
          ["원인-결과 그래프", "입력 데이터간 관계가 출력에 영향을 미치는 상황을 체계적으로 분석하여 테스트 케이스 설계 및 테스트"],
          ["오류예측 기법", "각 시험 기법들이 놓치기 쉬운 오류들을 감각과 경험으로 찾아 검증. 예) 입력값 없이 Return 친다. 문법에 어긋난 입력을 시험한다 등"],
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
    defShort: "내부 구조·코드를 보며 논리 흐름을 검증하는 테스트",
    keywords: ["내부 구조(Internal Structure)", "논리 흐름(Logical Flow)", "코드 커버리지(Code Coverage)", "제어구조", "루프"],
    tables: [
      {
        caption: "화이트박스 테스트 종류",
        headers: ["유형", "설명"],
        rows: [
          ["제어 구조 테스트", "소프트웨어의 논리적 복잡도를 측정. 복잡도에 따라 수행할 기본 경로의 집합을 정의"],
          ["루프 테스트", "루프의 경계선에서 발생하는 경계오류. 루프유형: 단순, 중첩, 연결, 비구조적"],
          ["구문 커버리지", "프로그램 내의 모든 구문들이 최소한 한번은 실행될 수 있는 입력 데이터를 테스트 데이터로 선정"],
          ["결정 커버리지", "프로그램 내의 전체 결정문이 적어도 한번은 참과 거짓의 결과를 수행하는 테스트 케이스 생성"],
          ["조건 커버리지", "결정 명령문 내의 각 조건이 적어도 한 번은 참과 거짓의 결과가 되도록 수행하는 테스트 케이스"],
          ["조건/결정 커버리지", "전체 조건식 뿐만 아니라 개별 조건식도 참 한번, 거짓 한번 결과가 되도록 수행하는 테스트 케이스"],
          ["변경조건/결정 커버리지", "각 개별 조건식이 다른 개별 조건식에 영향을 받지 않고 전체 조건식에 독립적으로 영향을 주도록 하는 테스트 케이스"],
          ["다중조건/결정 커버리지", "결정 포인트 내에 있는 모든 개별식 조건의 모든 조합을 고려한 커버리지"],
        ],
      },
      {
        caption: "블랙박스, 그레이박스, 화이트박스 비교",
        headers: ["비교항목", "블랙박스", "그레이박스", "화이트박스"],
        rows: [
          ["테스트 수행 관점", "사용자 관점", "사용자+개발자 관점", "개발자 관점"],
          ["테스트 기준 문서", "요구사항 명세서", "요구사항 + 단위 설계", "단위 설계 명세서"],
          ["V 모델 위치", "상위 레벨(사용 환경)", "하이브리드", "하위 레벨(개발 환경)"],
          ["TestCase 설계 유형", "동등분할, 경계값 분석 등", "통합테스트", "루프, 제어구조 테스트 등"],
          ["결함 여부 기준", "예상된 출력값과 일치 여부", "기존 테스팅에서 발견되지 않은 결함", "설계문서와 논리구조 일치 여부"],
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
    defShort: "테스트가 실행한 코드의 비율을 나타내는 지표",
    keywords: ["구문(SC)", "결정(DC)", "조건(CC)", "조건(C/DC)", "변경조건(MC/DC)", "다중조건(MCC)", "Test Case"],
    tables: [
      {
        caption: "코드 커버리지 종류 (포함 관계: SC ⊂ DC ⊂ C/DC ⊂ MC/DC ⊂ MCC ⊂ 경로)",
        headers: ["구분", "기술", "설명"],
        rows: [
          ["SC 구문", "Statement", "프로그램 영역의 모든 문장이 한번씩 호출 (조건과 결과 참/거짓 여부 무관)"],
          ["DC 결정", "Decision(Branch)", "프로그램 영역의 모든 분기문을 선정. 조건문의 결과가 참/거짓이면 만족"],
          ["CC 조건", "Condition", "프로그램 영역의 분기문 내부에 있는 모든 조건이 참/거짓을 포함되도록 선정. 모든 조건이 참/거짓(결과 무관)"],
          ["C/DC 조건/결정", "C/DC", "분기문의 참/거짓 + 분기문 내부 조건의 참/거짓"],
          ["MC/DC 변경조건", "Modified C/DC", "개별 조건식이 다른 개별 조건식과 무관하게 전체 조건문에 독립적 영향"],
          ["MCC 다중조건", "Multi Condition", "수행 가능한 모든 경로 검사, 가장 강력, 100% 커버리지 달성"],
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
    defShort: "테스터의 경험·직관으로 동작을 조사해 결함을 찾는 테스트",
    keywords: ["[세차노요] Heuristic 기반", "Time-boxing", "테스트세션", "테스트 차터", "테스트노트", "요약보고"],
    tables: [
      {
        caption: "구성 요소 (세차노요)",
        headers: ["구성요소", "설명", "특징"],
        rows: [
          ["테스트 세션(Session)", "테스트를 방해받지 않는 테스트 수행시간. Time boxing", "45분 ~ 수 시간"],
          ["세션 차터(Charter)", "세션 당 완수 해야 할 목표, 비전 제시. 기술적 설명이 아닌 비전을 설명하는 한 두 문장으로 구성", "1세션 당 1차터"],
          ["테스트 노트(Note)", "테스트 중 얻은 새로운 테스트 아이디어, 제품에 대한 제안 등 꼭 필요한 최소한의 내용만 기록", "세션 리포트 작성"],
          ["요약 보고(Debrief)", "테스트 경험의 공유를 통한 테스트 팀의 학습과 성장 도모", "PROOF 아젠다 활용"],
        ],
      },
      {
        caption: "Debriefing의 PROOF",
        headers: ["항목", "설명"],
        rows: [
          ["Past", "테스트 수행 내용(What happened during the testing?)"],
          ["Results", "테스트 수행 성과(What was achieved during the testing?)"],
          ["Outlook", "추가(보충)해야 할 사항(What still needs to be done?)"],
          ["Obstacles", "개선이 필요한 요소(What got in the way of good testing?)"],
          ["Feelings", "테스트 중 느낀 점(How does the tester feel about all this?)"],
        ],
      },
    ],
  },
  {
    title: "경험 기반 테스트",
    course: "SE",
    definition:
      "유사 어플리케이션이나 기술에서의 경험, 직관, 테스터의 기술 능력으로부터 테스트 케이스를 추출하는 기법",
    defShort: "경험·직관·기술 능력으로 테스트 케이스를 추출하는 기법",
    keywords: ["[경탐오체분] 탐색적 테스팅", "오류추정", "체크리스트", "분류 트리"],
    tables: [
      {
        caption: "주요 기법",
        headers: ["유형", "설명", "고려사항"],
        rows: [
          ["탐색적 테스팅", "테스트 목표를 포함하는 테스트 차터(Charter)를 기반으로 정해진 시간내에 테스트 설계, 수행, 기록과 학습하는 테스팅 기법", "명세가 거의 없고 시간이 부족한 경우, Formal 기법을 보충할 경우"],
          ["오류추정", "Ad-hoc Testing이라고도 불리며, 어떤 특정한 형태의 결함이 발생할 것이라고 예측하고, 이 결함을 발견하기 위한 테스트 케이스를 설계하는 기법. 테스터는 직관과 경험에 기반하여 결함을 예측. 테스터가 시스템에 대한 완전히 이해한다는 전제로 적용되는 기법", "테스트의 마지막 단계에 사용"],
          ["체크리스트", "테스트하고 평가해야 할 내용과 결함을 분류하여 나열해 놓은 목록. 체계적으로 도출되기 보다는 테스트 경험과 노하우를 정리하고 목록화 하여 다음 테스팅에서 해당 내용을 누락없이 재활용하는 것을 목적으로 작성", "공식적인 테스팅을 보완하는 용도로 활용"],
        ],
      },
      {
        caption: "탐색적 테스팅과 테스트케이스 기반 테스팅 비교",
        headers: ["구분", "탐색적 테스팅", "테스트케이스 기반 테스팅"],
        rows: [
          ["초점", "문서화에 소요되는 시간을 최소화 하여 테스트를 '실행'하는 것에 집중", "문서화 기반의 공식적인 수행으로 테스트의 체계적인 '설계' 향상에 집중, 테스트케이스의 재사용 및 공유"],
          ["구성 요소", "테스트 차터(각 세션의 임무 정의), 타임 박싱(세션당 시간제약), 테스트 노트(머리속으로 작성한 테스트케이스), 요약보고(세션 종료 후 팀원에게 간략보고)", "테스트 계획서(인력·일정·환경 등 계획), 테스트 케이스(테스트 내용의 명세화 문서), 테스트 시나리오(테스트 케이스의 흐름 집합), 테스트 결과서(단위/통합테스트 결과서)"],
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
    defShort: "위험 우선순위가 높은 곳에 테스트 자원을 집중하는 전략",
    keywords: ["테스트 자원 한정", "STA", "STTA", "ITA", "FTA"],
    tables: [
      {
        caption: "위험 기반 테스팅 절차",
        headers: ["절차", "설명"],
        rows: [
          ["위험 식별", "각 아이템별 위험 도출, 테스트 항목 도출"],
          ["위험 분석", "발생 가능성, 영향도 평가, 우선순위화"],
          ["위험 대응 계획", "위험 최소화 계획 수립, STA·STTA·ITA·FTA"],
          ["Test 계획", "테스트 종료/완료 조건 정의, 인력/일정/자원 계획"],
          ["분석/모니터링", "하위/상위 테스트"],
        ],
      },
      {
        caption: "위험 수준에 따른 테스팅 영역 (가능성 × 영향)",
        headers: ["영역", "설명"],
        rows: [
          ["STA (Severe Test Area)", "반드시 테스트 해야 함 — 가능성↑ 영향↑"],
          ["STTA (Strong Test Area)", "테스트 해야 함 — 가능성↓ 영향↑"],
          ["ITA (Intensive Test Area)", "테스트 해야 함 — 가능성↑ 영향↓"],
          ["FTA (Fundamental Test Area)", "테스트 하지 않을 수 있음 — 가능성↓ 영향↓"],
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
    defShort: "테스트 결과가 기대 결과인지 판단하는 메커니즘",
    keywords: ["[참샘휴일] 참 오라클", "샘플링 오라클", "휴리스틱 오라클", "일관성 검사"],
    tables: [
      {
        caption: "테스트 오라클의 유형 (참샘휴일)",
        headers: ["유형", "설명"],
        rows: [
          ["참 오라클(True Oracle)", "모든 입력 값들에 대해 원하는 결과들을 생성하여 발생된 오류를 놓치지 않고 검출 할 수 있는 오라클"],
          ["샘플링 오라클(Sampling Oracle)", "특정 몇몇 입력 값들에 대해서만 원하는 결과를 제공해주는 오라클. 예를 들어 Sine 함수를 테스트 할 때 0, 90, 180, 270, 360 도에 대해서만 정확한 참 값을 제공"],
          ["휴리스틱 오라클(Heuristic Oracle)", "샘플링 오라클의 단점을 개선하기 위해 특정 몇몇 입력 값들에 대해서는 샘플링 오라클의 경우처럼 올바른 결과를 제공하고, 나머지 입력 값들에 대해서는 휴리스틱(추정)으로 처리하는 오라클"],
          ["일관성 검사 오라클(Consistent Oracle)", "이전수행결과와 현재수행결과가 동일한지 검증. 회귀테스트시 수정 전후의 프로그램 실행 결과 확인 또는 비교시 사용. 상용테스트 자동화 도구에서 사용"],
        ],
      },
      {
        caption: "AI시스템이 테스트 오라클 불가능 이유와 블랙박스 기법",
        headers: ["구분", "내용"],
        rows: [
          ["불가능 이유", "시스템 명세(불완전·비공식적), 테스트 입력 데이터(비구조화·개인정보 처리), 자가학습 시스템(학습 후 재현 불가), 확률적·비결정적(매번 동일 결과 아님), 복잡성(심층신경망 이해 어려움)"],
          ["AI 블랙박스 테스트 기법", "조합테스트(Combination testing), 백투백 테스트(Back-to-back testing), A/B testing, 변성 테스트(Metamorphic testing), 탐색적 테스트(Exploratory testing)"],
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
    defShort: "정답 유무에 따라 지도·비지도·준지도·강화로 나뉘는 학습 방식",
    keywords: ["지도학습", "비지도학습", "준지도학습", "강화학습", "진화학습"],
    tables: [
      {
        caption: "학습방법 유형",
        headers: ["분류", "설명", "알고리즘"],
        rows: [
          ["지도 학습(Supervised Learning)", "이미 유형(class)을 구분 짓는 속성(attribute)을 갖는 주어진 데이터 집합(Training set)으로부터 유형(class)을 구분하는 함수적 모델(model)을 찾아 유형을 구분 짓는 속성을 갖지 않는 새로운 데이터의 유형을 구분하는 기술. 고양이의 모습에 대한 특징을 학습시키고 YouTube 에서 고양이 영상을 찾는 경우", "Bayesian classification, Decision tree, Regression, Neural Network, hidden Markov model(HMM)"],
          ["비지도 학습(Unsupervised Learning)", "유형(class)을 구분 짓는 정답(Label)을 갖지 않는 주어진 데이터 집합(Training set)으로부터 데이터 자체의 상호 유사성(likelihood or distance)을 통하여 유형을 구분하는 함수적 모델을 찾아 새로운 데이터의 유형을 구분하는 기술. 입력 x만 주어지고 그에 대한 목표 출력 y를 제시하지 않는 학습 방식", "K-Means clustering, EM clustering, Self-organizing feature map(SOM), Principal component analysis(PCA), Independent Component Analysis(ICA)"],
          ["준지도 학습(Semi-supervised Learning)", "지도학습과 비지도 학습을 병행(레이블이 표시된 데이터를 기반으로 학습 후 레이블이 표기되지 않은 데이터를 자율 학습)", "그래프생성모형, Self-training, Co-training, Label Propagation"],
          ["강화 학습(Reinforcement Learning)", "에이전트(Agent)가 환경(Environment)과 상호작용하면서 보상(Reward)을 최대화하는 정책(model)을 학습하는 방법", "Monte Carlo methods, Markov Decision Processes, Value Functions, Q-Learning, DQN, PPO"],
          ["진화 학습", "진화를 모방한 탐색 알고리즘", "유전 알고리즘"],
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
    defShort: "학습된 모델의 지식을 옮겨 데이터 부족·훈련 시간을 줄이는 기법",
    keywords: ["미세조정(Fine Tuning)", "과업/도메인 전이", "Inductive/Transductive/Unsupervised"],
    tables: [
      {
        caption: "주요학습 기법 [파프도레]",
        headers: ["기법", ""],
        rows: [
          ["Fine-tuned CNN(파인튜닝)", "Pre-trained Model(프리트레인드 모델)"],
          ["Domain Adaptation(도메인 적응)", "Layer Re-use(레이어 재사용)"],
        ],
      },
      {
        caption: "학습방법 유형 [적태도 레귀변자]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["적용 범위", "과업(Task) 전이", "영상인식에서 음성인식으로 전이하는 것처럼 응용분야가 변경되는 경우. 동결(Freeze): 유사 학습모델의 일부 계층을 재사용 / 미세조정(Fine Tuning): 현재 학습모델을 위한 새로운 구조를 적용하여, 가지고 있는 데이터 셋으로 학습 진행. 원래 가중치가 훼손되지 않도록 학습률은 낮게 설정하여 진행"],
          ["적용 범위", "도메인(Domain) 전이", "영불번역기를 영한번역기로 전이하는 것처럼 특징공간의 데이터 확률분포가 다른 경우. Daume2009: 특징 공간을 3배로 확장하여 두 도메인의 확률분포 맞춤 / Sun2016: 화이트닝 변환과 컬러링 변환으로 두 도메인의 확률분포 맞춤"],
          ["데이터셋 label 여부", "귀납(Inductive)", "소스 도메인과 타겟 도메인이 동일하지만, 타겟 태스크가 다를 경우 타겟 태스크를 미세조정하여 학습. 알고리즘: Multi-task Learning, Self-taught Learning"],
          ["데이터셋 label 여부", "변형(Transductive)", "소스 도메인과 타겟 태스크가 동일하지만, 도메인이 다를 경우 소스 도메인의 라벨 정보를 활용하여 타겟 도메인의 데이터를 특징 공간에 일치 시킴. 알고리즘: Domain Adaptation"],
          ["데이터셋 label 여부", "자율(Unsupervised)", "Unlabeled Data간 학습 진행"],
        ],
      },
    ],
    notes: ["개념도: Pretrained A의 하위 계층(Hidden layer 1~3)을 가중치 고정(Freeze)으로 재사용하고 상위 계층만 학습(Trainable)하여 B 모델 구성"],
  },
  {
    title: "자기지도학습(Self-supervised Learning)",
    course: "AI",
    definition:
      "데이터에 스스로 레이블을 생성하여 학습하는 지도학습 형태의 비지도학습 (지도학습이 필요한 작업에 비지도 학습 사용)",
    defShort: "데이터에 스스로 레이블을 만들어 학습하는 지도형 비지도학습",
    keywords: ["프리텍스트 태스크(pre-text task)", "다운스트림 태스크(downstream task)", "전이학습"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "기법"],
        rows: [
          ["생성 기반", "오토인코더, GAN, MAE(Masked Autoencoders)"],
          ["Pre-text Task 기반", "공간적 관계 기반, 시간적 관계 기반"],
          ["대조학습 기반", "SimCLR, MoCo(Momentum Contrast)"],
        ],
      },
      {
        caption: "학습방법 유형 [프다]",
        headers: ["단계", "설명"],
        rows: [
          ["프리텍스트 태스크(pre-text task)", "레이블이 없는 데이터를 대상으로 하는 작업으로, 데이터의 핵심 표현을 추출하는 레이어(feature extraction layer)를 학습"],
          ["다운스트림 태스크(downstream task)", "연구자가 최종적으로 원하는 이미지 분류, 물체 인식과 같은 작업을 소량의 레이블 데이터만으로 수행"],
        ],
      },
      {
        caption: "학습단계 [프다파]",
        headers: ["단계", "설명"],
        rows: [
          ["1) 프리텍스트 태스크 단계", "레이블링 없는 데이터를 프리텍스트 태스크로 학습"],
          ["2) 다운스트림 태스크 단계", "학습된 특징들로 분류기를 학습하여 더 적은 레이블을 가진 새로운 데이터에도 적용 가능하게 학습"],
          ["3) 파인튜닝 단계", "더 적은 레이블의 새로운 데이터에도 적용 가능하도록 파인튜닝. 사전 학습된 가중치를 미세 조정"],
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
    defShort: "데이터 공유 없이 로컬 기기와 서버가 협력 학습하는 분산 ML",
    keywords: ["전역모델", "지역모델", "FedSGD", "FedAVG"],
    tables: [
      {
        caption: "동작 원리 (전지취갱)",
        headers: ["절차", "설명"],
        rows: [
          ["① 전역(Global) 모델 분배(Broadcast)", "서버는 사전에 정의한 최적 참여자를 선정한 후 각 단말로 수행해야 할 작업 관련 정보를 전달"],
          ["② 지역 모델 갱신(Local Update)", "단말에 저장된 개인 데이터를 사용하여 로컬 AI 모델을 생성"],
          ["③ 지역 모델 취합(Aggregate)", "서버와 접속 등 특정 조건 만족 시, 단말은 생성한 로컬 AI 모델의 결과값(파라미터)을 압축·암호화하여 서버로 전달"],
          ["④ 전역 모델 갱신(Global Update)", "취합된 값을 이용하여 전역 모델을 갱신"],
        ],
      },
      {
        caption: "알고리즘",
        headers: ["알고리즘", "설명"],
        rows: [
          ["FedSGD(Federated Stochastic Gradient Descent)", "각 단말에서 한번 학습한 파라미터를 중앙 서버로 전달. 중앙 서버는 취합한 로컬 파라미터 평균 계산 후 글로벌 파라미터 갱신. 갱신된 글로벌 파라미터가 수렴 조건 만족 시까지 과정 반복"],
          ["FedAVG(Federated Averaging)", "각 단말에서 일정 횟수 K만큼 반복 수행 후 파라미터를 서버로 전달. Batch Size 크기로 분할 학습하여 minibatch 효과를 주어 글로벌 파라미터가 수렴에 이르는 시간을 단축"],
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
    defShort: "학습된 모델에서 특정 데이터를 선택적으로 제거하는 기술",
    keywords: ["데이터가 모델에 미친 영향 제거", "개인정보 보호", "AI윤리", "재학습", "언러닝 알고리즘", "잊혀질 권리"],
    tables: [
      {
        caption: "언러닝 절차",
        headers: ["핵심", "설명"],
        rows: [
          ["언러닝 대상 정의", "삭제할 데이터 샘플 결정"],
          ["영향도 분석", "해당 데이터가 모델에 미친 영향 추정"],
          ["Impair 단계", "제거 대상 데이터의 성능을 고의로 저하시키는 노이즈 생성 및 주입"],
          ["Repair 단계", "나머지 데이터의 정확도 회복 위해 일반적 학습 기법 재적용"],
          ["평가 및 검증", "Forget/Retain accuracy 등으로 언러닝 품질 검증 및 리더보드 평가"],
        ],
      },
      {
        caption: "기술 요소와 평가",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["기술 요소", "Error-maximizing Noise", "제거할 데이터에서 loss를 극대화하는 노이즈 생성으로 학습 영향 제거"],
          ["기술 요소", "Impair & Repair 프레임워크", "손상 후 성능 복구하는 2단계 접근, 계산 효율성과 성능 유지 동시 달성"],
          ["기술 요소", "Zero-glance Unlearning", "삭제 대상 데이터에 직접 접근하지 않고도 언러닝 가능하도록 설계"],
          ["기술 요소", "SISA", "Sharded(분할), Isolated(독립화), Sliced(슬라이싱), Aggregated(통합)"],
          ["평가", "효율성", "재학습 대비 알고리즘이 얼마나 빠른지"],
          ["평가", "모델 효용성", "보존해야할 데이터나 직교 태스크에서의 성능 저하 여부"],
          ["평가", "망각 품질", "망각해야할 데이터가 실제로 얼마나 언러닝되었는지"],
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
    defShort: "특정 도메인 데이터로 그 분야 문제를 해결하는 특화 AI",
    keywords: ["범용 데이터", "특화 데이터", "파인 튜닝", "sLLM"],
    tables: [
      {
        caption: "버티컬 AI와 수평적 AI 비교",
        headers: ["항목", "버티컬 AI(Vertical AI)", "수평적 AI(Horizontal AI)"],
        rows: [
          ["학습 데이터", "특화된 도메인 데이터 사용(의료, 금융 등)", "광범위한 비정형 데이터(웹 콘텐츠, 뉴스 등)"],
          ["기술 요소", "소형 언어 모델(sLLM), 파인 튜닝, 도메인 특화 알고리즘", "대규모 언어 모델(LLM), 클라우드 기반 AI"],
          ["데이터 품질", "고도의 정확성과 신뢰성이 필요한 특화 데이터", "일반적인 텍스트, 이미지 등의 비라벨링 데이터"],
          ["개발 주체", "주로 스타트업이나 중소기업이 개발", "대형 테크 기업(Google, Apple 등) 주도"],
          ["학습 방식", "파인튜닝(Fine-tuning) 기반 맞춤형 학습", "대규모 데이터 학습(Pre-training)"],
          ["기능 및 목적", "산업별 맞춤형 솔루션 제공, 효율성 향상", "범용 서비스 제공(검색, 번역 등)"],
          ["활용 영역", "의료(영상 분석), 금융(신용평가), 제조(공정 최적화)", "음성비서, 고객 서비스, 스마트홈 애플리케이션"],
          ["비용 및 인프라", "상대적으로 저비용, 특정 산업에 집중된 인프라 요구", "고비용, 클라우드 및 대규모 인프라 필수"],
          ["확장성", "특정 산업에 집중, 여러 산업으로 확장 제한적", "다양한 도메인에 쉽게 확장 가능"],
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
    defShort: "물리 기기에 탑재되어 현실을 인식하고 상호작용하는 AI",
    keywords: ["LWM", "Tokenizer", "디지털트윈", "온디바이스AI", "모델 경량화", "sLLM", "벡터DB", "휴머노이드", "자율주행"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["피지컬AI", "카메라/Lidar", "현실세계 객체 인식을 위한 센서 기술"],
          ["피지컬AI", "온디바이스AI", "디바이스에서 사용 가능한 AI 모델 및 H/W 기술"],
          ["피지컬AI", "모델 경량화 기술", "양자화, 파라미터 가지치기, 증류학습"],
          ["피지컬AI", "sLLM", "파라미터 압축을 통한 경량화 대형언어모델"],
          ["피지컬AI", "AI칩셋", "디바이스단 AI 학습/예측/제어를 위한 전용 칩 기술"],
          ["피지컬AI 개발F/W", "LWM", "Large World Model — 가상 세계 생성을 위한 수천조 파라미터 크기의 모델, 합성데이터 활용한 Physical AI 학습 데이터 생성"],
          ["피지컬AI 개발F/W", "Tokenizer", "3D 데이터 압축 저장을 위한 데이터 토큰화"],
          ["피지컬AI 개발F/W", "디지털 트윈", "현실 세계와 동일한 가상 세계 구현 기술"],
          ["피지컬AI 개발F/W", "메타버스", "3D 가상"],
          ["피지컬AI 개발F/W", "AI 가속기", "빠른 AI 학습을 위한 가속기"],
          ["DB", "벡터DB", "대용량 데이터 벡터 형태로 효율적 저장"],
          ["서비스", "자율주행차", "피지컬 AI의 한 형태로 자율주행차 서비스 제공"],
          ["서비스", "휴머노이드 로봇", "피지컬 AI의 한 형태로 휴머노이드 로봇 서비스 제공"],
        ],
      },
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["대형언어모델 적용", "디바이스에 대형 언어 모델 적용으로 자연어 기반 의사소통 가능"],
          ["물리세계인식", "실제 현실세계 환경을 인식하고 이해하는 능력 보유"],
          ["산업 현장 활용", "자율주행, 로봇, 병원, 공장 등에서 AI 기반 시스템 운영 지원"],
        ],
      },
      {
        caption: "엔비디아 개발 솔루션 (피지컬 AI 개발 솔루션)",
        headers: ["단계", "역할"],
        rows: [
          ["코스모스(COSMOS)", "현실 객체 인식, 물리세계 이해"],
          ["옴니버스(Omniverse)", "가상 공간 생성"],
          ["DGX", "가상 공간 학습"],
          ["AGX", "자율주행용 개발 플랫폼"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.04 KPC 모의고사 3교시, 2025.03 ITPE 모의고사 1교시"],
  },
  {
    title: "온디바이스 AI",
    course: "AI",
    definition:
      "클라우드 서버가 아닌 단말 기기 내부에서 인공지능(AI) 모델의 추론(inference) 및 연산이 이루어지는 기술",
    defShort: "클라우드 없이 단말 내부에서 AI 추론·연산하는 기술",
    keywords: ["레이턴시 지연", "보안", "모델 성능 제한", "모델 경량화", "전력 관리", "자원 제약", "하이브리드 AI"],
    tables: [
      {
        caption: "한계점 (레이턴시 & 비용)",
        headers: ["구분", "한계점", "설명"],
        rows: [
          ["클라우드 AI 한계점", "네트워크 지연(레이턴시)", "클라우드는 요청 왕복으로 지연 발생, 온디바이스는 지연 거의 없음"],
          ["클라우드 AI 한계점", "운영 비용 폭증", "LLM 운영은 전력·정비 비용이 매우 높아 비용이 크게 증가"],
          ["클라우드 AI 한계점", "보안·개인정보보호 제한", "외부 전송으로 데이터 유출 위험, 민감 데이터는 업로드 제한 있음"],
          ["클라우드 AI 한계점", "인터넷 의존성과 오프라인 한계", "클라우드는 오프라인 작동 불가, 네트워크 불안정 시 기능 제한"],
          ["온디바이스 AI 한계점", "모델 성능 제한", "온디바이스 모델은 경량화가 필수라 LLM 수준의 종합적 작업 수행이 어려움"],
          ["온디바이스 AI 한계점", "하드웨어 한계", "스마트폰은 연산·메모리·전력 제약이 커서 모델 크기·성능에 제한 존재"],
          ["온디바이스 AI 한계점", "업데이트 복잡성", "수많은 기기에 개별 배포해야 해 업데이트가 어렵고 일관성 유지가 힘듦"],
          ["온디바이스 AI 한계점", "확장성 부족", "클라우드처럼 리소스를 확장하거나 다양한 작업을 동시에 처리하기 어려움"],
        ],
      },
      {
        caption: "성능 최적화 및 전력관리 기술",
        headers: ["분류", "기법"],
        rows: [
          ["연산 최적화", "양자화, 프루닝, 저랭크 분해"],
          ["전력 관리", "DVFS, 배치 크기조정"],
          ["발열 관리", "점진적 조정, 작업 분산"],
        ],
      },
      {
        caption: "모델 실행을 위한 기술 스택",
        headers: ["스택", "핵심 기술", "설명"],
        rows: [
          ["하드웨어", "NPU(Neural Processing Unit)", "딥러닝 연산에 특화된 전용 프로세서. 저전력·고효율 구조로, 엣지 기기에 탑재되어 실시간 추론"],
          ["하드웨어", "GPU(Graphics Processing Unit)", "병렬 연산에 강점을 가진 범용 연산 장치로, CNN·Transformer 등 대규모 행렬 연산을 가속"],
          ["하드웨어", "DSP(Digital Signal Processor)", "음성·영상·센서 신호 등 아날로그-디지털 변환 기반의 특화된 프로세서"],
          ["런타임", "TensorFlow Lite", "구글의 온디바이스용 경량 딥러닝 프레임워크"],
          ["런타임", "PyTorch Mobile", "PyTorch 모델을 모바일 환경에서 구동할 수 있도록 경량화한 런타임"],
          ["런타임", "ONNX Runtime Mobile", "다양한 프레임워크(TensorFlow 등)에서 변환된 ONNX 포맷 모델을 실행하는 범용 런타임"],
          ["하드웨어 추상화 계층(HAL)", "NNAPI(Android Neural Networks API)", "Android OS에서 AI 연산을 NPU, GPU, DSP 등 하드웨어 가속기에 자동 매핑하는 인터페이스"],
          ["하드웨어 추상화 계층(HAL)", "Qualcomm SNPE", "Qualcomm Snapdragon 칩셋의 온디바이스 추론 최적화 엔진"],
          ["하드웨어 추상화 계층(HAL)", "ARM NN(Neural Network)", "ARM 기반 SoC(System on Chip)용 오픈소스 신경망 추론 라이브러리"],
          ["경량화 기술", "MobileNet 계열", "구글이 제안한 모바일·엣지용 경량 CNN 모델"],
          ["경량화 기술", "EfficientNet", "신경망 구조 탐색(NAS) 기반으로 파라미터 수 대비 성능을 최적화한 모델"],
          ["경량화 기술", "TinyML 모델", "센서·IoT 기기·마이크로컨트롤러(MCU) 등 극저전력 환경에서도 추론 가능"],
          ["어플리케이션", "ML Kit(Google)", "Google이 제공하는 온디바이스 AI SDK"],
          ["어플리케이션", "Vision F/W(Apple)", "iOS/macOS용 온디바이스 비전 처리 F/W"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.10 ITPE 모의고사 3교시"],
  },
  {
    title: "AEI(Artificial Emotional Intelligence)",
    course: "AI",
    definition:
      "인공지능과 감성지능의 결합으로 AI가 스스로 감정을 가져 자신과 타인의 감정을 구별 및 새로운 사고와 행동을 결정하며 감정을 공유하는 인공지능 기술",
    defShort: "AI와 감성지능을 결합해 감정을 인식·생성·증강하는 기술",
    keywords: ["AI + 감성", "감성인식", "감성생성", "감성증강 기술"],
    tables: [
      {
        caption: "기술구성",
        headers: ["기술구성", "기술요소", "설명"],
        rows: [
          ["감성 인식기술", "생리신호 기반 인식 기술", "외부 자극에 의한 생리적 반응 분석. 심혈관계(ECG/PGG), 피부(GSR/SKT), 중추신경계(EEG)"],
          ["감성 인식기술", "행태반응/멀티모달 기반 인식 기술", "감성 자극에 의한 행동적 특성 분석. 얼굴(PCA/LDA/ASM), 제스처/음성(MFCC/HMM/GMM)"],
          ["감성 생성기술", "감성 엔진 기반 반응 생성 기술", "외부 자극의 특정 패턴에 대한 감성 반응 생성. 의사결정트리, 3D 감성 모델"],
          ["감성 생성기술", "감성 합성 기반 표현 기술", "기계와의 감정 합성 통해 감성 인터랙션. TTS, 멀티모달 UI, Display 소자, BCI, 해부학적 모델링"],
          ["감성 증강기술", "감성 유형 기반 평가 기술", "표현 가능한 감성의 군집화를 통한 감성 유형 정의. OCC(Ortony, Clore, Collins) 감성 평가 모델"],
          ["감성 증강기술", "감성 모델링 기반 추론 기술", "발생된 이벤트의 감성 유발 상황 도출, 새로운 감성 증강. 감성 추론기(Affective Reasoner)"],
        ],
      },
      {
        caption: "적용가능 분야",
        headers: ["분야", "설명"],
        rows: [
          ["AEI 자동차", "AI를 기반으로 운전자 생체정보와 감정 상태를 차량이 학습해 여기에 맞는 음악, 온도, 조명, 진동, 향기 등 제공"],
          ["로봇", "사람 감정을 흉내내는 지능형 감성 로봇으로 진화. 다양한 분야에 전반적으로 잠재력을 갖을 것으로 기대"],
          ["헬스케어", "감정 상태를 분석하고 우울증 등 감정상태를 진단. 치료 목적으로 하는 AEI 기술 기반 특수 어플리케이션이 개발되는 등 다양한 지역에서 상용화 진행"],
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
    defShort: "신경망 입력 총합을 비선형 출력으로 변환해 활성화를 결정하는 함수",
    keywords: ["출력 신호 변환", "활성화 여부 결정"],
    tables: [
      {
        caption: "문제점",
        headers: ["문제점", "설명", "해결"],
        rows: [
          ["0.5 문제", "시그모이드 함수는 출력값을 (0, 1) 사이의 확률값으로 변환하는데, 입력이 0일 때 출력이 정확히 0.5. 이진 분류(Binary Classification)에서 임계값(Threshold) 설정 문제가 발생", "ReLU, Leaky ReLU, Tanh"],
          ["기울기 소실", "입력 값이 매우 크거나 작을 때, 시그모이드의 출력값은 0 또는 1에 가까워지며, 기울기(미분 값)가 매우 작아짐. 그로 인해 기울기가 0으로 수렴", "ReLU, Leaky ReLU, Tanh"],
        ],
      },
      {
        caption: "단극성 함수 (단시레)",
        headers: ["활성화 함수", "설명"],
        rows: [
          ["Sigmoid Function", "f(x) = 1/(1+e^-x). 0~1 사이의 값 출력, 평균 0.5. 장점: 이진 분류 출력층 노드 활용 / 단점: 경사 기울기 소실 문제"],
          ["ReLU", "f(x) = max(0, x). 음수는 0 출력, 양수는 그대로 출력. 깊은 신경망(DNN) 가능. 장점: 0 이상에서 기울기 소실 방지, 빠른 속도 / 단점: 음수에서 기울기가 0이 되는 문제"],
        ],
      },
      {
        caption: "양극성 함수 (양탄리프)",
        headers: ["활성화 함수", "설명"],
        rows: [
          ["Tanh", "-1~1 사이의 값 출력, 평균 0. 장점: 시그모이드보다 성능 좋음 / 단점: 경사 기울기 소실 문제"],
          ["Leaky ReLU", "f(x) = max(ax, x). x에 0.01과 같은 작은 값 곱해줌. ReLU의 음수에서의 기울기 문제 해결. 장점: x가 음수일 때 ReLU보다 학습 더 잘함"],
          ["PReLU", "음수 영역의 기울기 학습 가능. 장점: 기울기 조절이 가능 / 단점: 계산량 증가"],
        ],
      },
    ],
  },
  {
    title: "손실함수(Loss Function)",
    course: "AI",
    definition:
      "신경망의 최적 가중치를 찾기 위해 실제 값과 신경망의 예측 값의 차이를 수치화(오차계산)해주는 함수",
    defShort: "실제 값과 신경망 예측 값의 차이를 수치화하는 함수",
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
        headers: ["유형", "설명"],
        rows: [
          ["Mean Squared Error(MSE)", "출력·타겟이 연속인 회귀문제에 사용. 데이터와 평균 사이의 차이를 나타내는 손실함수. 차이가 커질수록 제곱 연산으로 인하여 손실함수 결과값이 명확"],
          ["Root Mean Squared Error(RMSE)", "MSE와 동일한 회귀문제에 사용. 제곱근을 적용함으로써 값의 왜곡을 감소"],
          ["Mean Absolute Error(MAE)", "MSE와 동일한 회귀문제에 사용. 에러 절대값의 평균 계산"],
          ["Binary Crossentropy(BCE)", "출력이 0 또는 1인 이진 분류기를 훈련할 때 자주 사용되는 손실함수. 예측값과 실제값이 같으면 수식은 0에 수렴하고, 다르면 무한대로 출력"],
          ["Categorical Crossentropy(CCE)", "출력이 클래스 소속 확률에 대한 예측으로 이해할 수 있는 문제에서 사용. 클래스가 2개 이상일 경우, 라벨이 one-hot encoding된 형태(이진)로 제공될 때 사용가능"],
          ["Sparse Categorical Crossentropy(SCCE)", "CCE와 동일하게 클래스가 2개 이상일 경우 사용. 라벨이 one-hot encoding된 상태일 필요 없이 정수로 제공될 때도 수행가능"],
        ],
      },
    ],
    notes: ["개념도: 예측값 ↔ 실제값(레이블) 차이 → 손실함수 → 옵티마이저(역전파 과정)로 가중치 업데이트"],
  },
  {
    title: "머신러닝 옵티마이저(Optimizer)",
    course: "AI",
    definition:
      "손실함수의 최소값을 찾기 위해 신경망의 가중치를 갱신하여 신경망 모델을 최적화하는 알고리즘",
    defShort: "손실함수 최소값을 찾아 가중치를 갱신하는 최적화 알고리즘",
    keywords: ["가중치 갱신", "에포크", "러닝레이트", "경사하강법", "SGD", "Momentum", "NAG", "AdaGrad", "RMSProp", "AdaDelta", "Adam"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["Stochastic Gradient Descent(SGD)", "학습률을 기준으로 손실함수(Loss Function) 그래프의 경사를 따라 내려가면서 가중치를 Update하는 옵티마이저. 오버슈팅 문제 및 지역 최소점(Local Minimum) 문제가 발생"],
          ["Momentum", "이동거리와 관성계수를 이용하여 파라미터를 업데이트하는 옵티마이저. SGD에 관성의 개념을 적용하여 지역최소점 문제를 해결"],
          ["NAG", "Momentum으로 이동된 지점에서의 기울기를 활용하여 업데이트를 수행. 관성에 의해 빨리 이동하는 이점을 누리면서 전역최소점에 중지해야 하는 곳에 효과적으로 제동하여 Momentum의 오버슈팅 문제를 해결"],
          ["AdaGrad", "동일기준으로 업데이트 되는 각각의 파라미터에 개별 기준을 적용하여 업데이트하는 옵티마이저. 최적화된 파라미터는 작은 변화를 주고 최적 거리가 먼 파라미터는 큰 변화를 적용"],
          ["RMSProp", "AdaGrad의 문제점을 개선하기 위해 지수이동평균법을 적용한 옵티마이저. 학습이 진행됨에 따라 파라미터 사이 차별화는 유지하되 학습의 최소 Step을 유지하여 0에 수렴하는 것을 방지"],
          ["AdaDelta", "AdaGrad의 개선을 위해 제안된 방법. 계산은 RMSProp와 동일하게 수행되지만 가중치를 업데이트하는 과정에서 학습률을 사용하지 않음"],
          ["Adam", "RMSProp와 Momentum의 기법을 합친 옵티마이저. 기울기 값과 기울기의 제곱값의 지수이동평균을 활용하여 Step 변화량을 조절"],
        ],
      },
    ],
    notes: ["개념도: 입력값→가중치→예측값→손실함수(실제값과 비교)→오차→옵티마이저가 역전파로 가중치 갱신", "계보: SGD → (관성) Momentum → NAG / (개별 학습률) AdaGrad → RMSProp·AdaDelta → 합체 Adam"],
  },
  {
    title: "서포트 벡터 머신 SVM(Support Vector Machine)",
    course: "AI",
    definition:
      "데이터가 사상 된 공간에서 경계선과 가장 근접한 데이터(Support Vector)간의 거리가 가장 큰 경계를 식별하는 알고리즘",
    defShort: "서포트 벡터와의 마진이 최대인 분류 경계를 찾는 알고리즘",
    keywords: ["분류", "패턴인식", "지도학습", "종속변수", "독립변수", "Support Vector", "Margin", "초평면", "커널함수", "과적합"],
    tables: [
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["과적합 회피", "과적합을 회피하고 예측 정확도를 최대화하는 방법"],
          ["통계적 학습", "통계적 학습 이론 기반으로 다양한 영역에서 적용 가능"],
          ["차원의 저주 회피", "고차원의 문제에서 데이터 집합을 두 집단으로 나누는 무수히 많은 의사결정 경계 중에서 최대 마진 초평면을 통한 극복"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Support Vector", "학습 데이터들 중에서 분류 경계에 가장 가까운 곳에 위치한 데이터"],
          ["Margin", "학습 데이터들 중에서 분류 경계에 가장 가까운 데이터로부터 분류 경계까지의 거리. 하드마진: 최대 마진안에 이상치(outlier)를 허용하지 않는 방법 / 소프트마진: 최대 마진안에 이상치(outlier)를 허용하도록 분류 기법"],
          ["초평면(hyperplane)", "다차원의 공간의 구분을 위해 결정 되는 n-1평면. 경계선에서 가장 가까이 있는 support vector를 지나는 선으로 생각해도 무방"],
          ["커널기법(Kernel trick)", "비선형 패턴을 분리하기 위하여 비선형 패턴의 input space를 선형 패턴의 feature space로 변환(고차 공간)하고 해당 비선형 경계면을 찾는 방법"],
        ],
      },
    ],
  },
  {
    title: "데이터라벨링과 어노테이션",
    course: "AI",
    definition:
      "라벨링: 인공지능이 기계학습에 활용할 수 있도록 기능이나 목적에 부합하는 정보를 원천데이터에 부착하는 활동 / 어노테이션: 라벨링 공정에서 인간이 부여한 식별기준을 기계가 인식할 수 있도록 선정된 데이터에 추가적인 정보를 기입하여 알고리즘이 이해할 수 있도록 만드는 과정",
    defShort: "원천데이터에 정답 정보를 부착·기입하는 데이터 구축 활동",
    keywords: ["라벨링", "어노테이션", "바운딩박스", "폴리곤", "텍스트 전사"],
    tables: [
      {
        caption: "기능",
        headers: ["구분", "라벨링 기능", "어노테이션 방식"],
        rows: [
          ["텍스트(Text)", "텍스트분류(Text Classification)", "클래스 라벨(단일, 다중)"],
          ["텍스트(Text)", "개체명인식(Named Entity Recognition)", "단어(구문) 라벨"],
          ["텍스트(Text)", "관계-의존성정의(Relation-Dependencies)", "단어(구문) 라벨링 및 두단어 사이의 관계 이미지"],
          ["이미지(Image)", "이미지분류(Image Classification)", "클래스 라벨(단일, 다중)"],
          ["이미지(Image)", "객체인식(Object Recognition)", "바운딩박스(사각형), 폴리곤(다각형)"],
          ["비디오(Video)", "동영상 분류(Video Classification)", "클래스 라벨(단일, 다중)"],
          ["비디오(Video)", "객체 인식(Object Recognition)", "바운딩 박스(사각형), 키포인트(정점)"],
          ["비디오(Video)", "객체 추적(Object Tracking)", "폴리곤(다각형), 폴리라인(선)"],
          ["오디오(Audio)", "오디오 분류(Audio Classification)", "클래스 라벨"],
          ["오디오(Audio)", "오디오 세그먼테이션 / 음성인식(Speech to Text)", "텍스트 전사"],
          ["기타", "시계열 세그먼테이션(Time-Series Segmentation) / HTML 문서분류", "클래스라벨"],
        ],
      },
    ],
  },
  {
    title: "지식 증류(Knowledge Distillation)",
    course: "AI",
    definition:
      "사전 학습된 모델(Teacher Model)이 학습한 지식을 다른 작은 모델(Student Model)에게 전달하여, 학습한 내용이나 예측 성능을 모방하도록 학습하는 기법",
    defShort: "교사 모델의 지식을 작은 학생 모델에 전달해 모방 학습시키는 기법",
    keywords: ["지식전달", "Teacher model", "Student model", "Distillation Loss"],
    tables: [
      {
        caption: "구성요소 및 동작절차",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["구성요소", "Teacher Model", "고성능의 대형 모델로부터 Soft Label을 생성"],
          ["구성요소", "Student Model", "Teacher Model의 지식을 모방하며 학습"],
          ["구성요소", "Distillation Loss", "지식 증류에서 사용되는 손실 함수"],
          ["구성요소", "Soft Loss", "Teacher 모델의 출력 확률 분포와 Student 모델의 출력 확률 분포 간의 차이를 줄이는 데 사용"],
          ["구성요소", "Hard Loss", "일반적인 Cross-Entropy Loss로, Student 모델이 실제 레이블을 잘 예측하도록 함"],
          ["동작절차", "1. 교사 모델 학습", "고성능의 복잡한 모델을 충분한 데이터로 학습"],
          ["동작절차", "2. 소프트 타겟 생성", "교사 모델이 입력 데이터를 예측할 때, 일반적인 예측 레이블(hard target) 대신, 소프트 타겟(확률 분포 형태)을 추출"],
          ["동작절차", "3. 학생 모델 정의", "교사 모델보다 구조가 단순하고 경량화 된 학생 모델 설계"],
          ["동작절차", "4. 지식 전이", "학생 모델은 교사 모델의 소프트 타겟과 정답 레이블(hard target)을 모두 사용해 학습"],
          ["동작절차", "5. 학생 모델 학습 및 최적화", "최적화 알고리즘을 통해 학생 모델을 학습"],
        ],
      },
      {
        caption: "지식 증류 유형 (로피관)",
        headers: ["기법", "설명"],
        rows: [
          ["로짓 기반 증류(응답 기반)", "교사 모델의 출력 로짓의 분포를 학생모델이 직접 학습하여 출력 분포의 미세한 차이를 학습 — 출력값이 지식"],
          ["피처 기반 증류", "교사 모델의 중간 레이어 출력을 학생 모델이 모방하여, 저수준 및 고수준 특징을 모두 학습 — 중간 계층이 지식"],
          ["관계 기반 증류", "교사 모델의 관계 정보를 학생 모델이 학습하도록 유도 — 관계가 지식"],
        ],
      },
      {
        caption: "지식 전달 방법 (오온자)",
        headers: ["기법", "설명"],
        rows: [
          ["오프라인 증류(Offline Distillation)", "교사 모델은 학습 후 고정되며, 학생 모델 학습 동안 업데이트되지 않음. 지식 전이 메커니즘 개선에 중점. 성능이 우수한 교사 모델에서 학생 모델로 지식 전이, 모델 성능 향상"],
          ["온라인 증류(Online Distillation)", "교사 모델과 학생 모델이 실시간으로 함께 학습하며, 교사 모델은 지속적으로 업데이트됨. 피드백 루프를 통해 학생 모델의 성능 피드백을 교사 모델이 반영"],
          ["자기 증류(Self-Distillation)", "동일한 네트워크를 교사와 학생으로 사용하며, 중간 레이어에 얕은 분류기 부착. 정확도 저하 문제 해결 및 외부 교사 모델 의존도 감소"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.05 ITPE FR 5일차 1교시, 2025.04 KPC 모의고사 4교시, 123회 컴시응 1교시", "교재 두음: 유형 [로피관] / 전달 방법 [오온자]"],
  },
  {
    title: "배치 정규화(Batch Normalization)",
    course: "AI",
    definition:
      "학습 시의 배치를 한 단위로 정규화를 하는 것으로 분포의 평균이 0, 분산이 1이 되도록 정규화하는 작업",
    defShort: "배치 단위로 평균 0·분산 1이 되도록 정규화하는 기법",
    keywords: ["기울기 소실문제", "배치정규화 Layer(BN Layer)", "데이터 분포 정규화(평균0, 분산1)"],
    tables: [
      {
        caption: "절차",
        headers: ["수행절차", "수행활동", "설명"],
        rows: [
          ["1. Input 미니배치 평균/분산 계산", "feature 분류 / 배치단위 분리", "각 feature 별 평균, 표준편차 구한 뒤 적용 / mini-batch 단위로 데이터를 로드"],
          ["2. BN층 활성화값/출력값 정규화", "Modify / 활성함수", "Input값을 Modify통해 활성함수로 넘겨준다 / 정규화 후 새로운 값이 적용된 활성함수 산출"],
          ["3. 활성함수 은닉층 적용", "변환 Scale/Shift / 입력분포 확인", "변환 된 Scale/Shift 값 기반 수행 / 가중치 이상유무 판단 활동 진행"],
          ["4. Output 확인", "재수행 여부 / 개선판단", "반복여부 결정 / 알고리즘 개선점 판단·전달"],
        ],
      },
      {
        caption: "필요성과 효과",
        headers: ["구분", "내용"],
        rows: [
          ["필요성(학습측면)", "1. 기울기 소실 문제 해결책 2. Learning Rate 상승 요인 3. 학습마다 Regularizer 역할 수행 4. 학습 시 초기 값 선택 의존성 저하"],
          ["효과(알고리즘 관점)", "Propagation 시 파라미터의 scale에 영향 받지 않음 — Learning Rate의 자유로운 설정, 빠른 학습 수행"],
          ["효과(절차 관점)", "자체 Regularization으로 인한 Drop out 제외 가능 — 러닝 단계 간소화, 프로세스 속도 향상"],
        ],
      },
    ],
  },
  {
    title: "정규화, 규제화, 표준화",
    course: "AI",
    definition:
      "정규화: 데이터를 일정한 범위로 변환하여 특징간의 스케일 차이를 맞추는 기법 / 규제화: 모델의 과적합을 방지하기 위해 손실함수에 패널티 항을 추가하는 기법 / 표준화: 데이터를 평균 0, 표준편차 1을 갖는 표준정규분포로 변환하는 데이터 전처리 기법",
    defShort: "입력 스케일 조정(정규·표준화)과 가중치 패널티(규제화) 기법",
    keywords: ["Min-Max 스케일링", "L1(Lasso)", "L2(Ridge)", "Z-score 스케일링"],
    tables: [
      {
        caption: "비교",
        headers: ["구분", "표준화", "정규화", "규제화"],
        rows: [
          ["대상", "입력 데이터", "입력 데이터", "모델 가중치"],
          ["목적", "서로 다른 피처(Feature)의 스케일을 평균 0, 분산 1로 통일", "데이터 범위를 특정 구간(주로 0~1)으로 압축", "모델의 복잡도를 제어하여 과적합(Overfitting) 방지"],
          ["대표기법", "Z-score 스케일링", "Min-Max 스케일링", "L1(Lasso), L2(Ridge)"],
          ["효과", "경사하강법 속도 향상, 이상치 영향 축소", "거리 기반 알고리즘 성능 향상", "모델의 일반화 성능 향상"],
        ],
      },
      {
        caption: "수식",
        headers: ["구분", "수식", "특징"],
        rows: [
          ["정규화", "x_new = (x − x_min) / (x_max − x_min)", "scale이 큰 특징에 영향을 많이 받는 것을 방지, 학습 속도 향상되지만 이상치에 취약"],
          ["표준화", "x_new = (x − μ) / σ  (z ~ N(0,1))", "scale이 큰 특징에 영향 방지, 학습 속도 향상"],
          ["규제화", "J(w) = MSE + λ||w||²", "제약 조건을 만족하며 에러가 최소인 지점(Ridge estimator)을 찾음"],
        ],
      },
    ],
  },
  {
    title: "Dropout",
    course: "AI",
    definition:
      "신경망의 과적합을 방지하기 위해 은닉층의 일부 노드를 무작위로 비활성화 시켜 정규화(성능 일반화)하는 신경망 학습 기법",
    defShort: "은닉층 노드를 무작위 비활성화해 과적합을 방지하는 기법",
    keywords: ["노드 비활성화", "Overfitting", "co-adaption", "dropout rate"],
    tables: [
      {
        caption: "Dropout 유형",
        headers: ["유형", "설명"],
        rows: [
          ["Fast Dropout", "드랍아웃은 매번 무작위로 노드를 선택하기 때문에 속도가 매우 느려 노드를 가우시안 마스크로 추출해 적용"],
          ["Ad-hoc Dropout", "Fast Dropout과 비슷하지만 가우시안 분포 대신에 0에서 1 사이에서 균일 분포로 추출한 마스크를 사용"],
          ["DropConnect", "드랍아웃이 노드를 비활성화 하는 것이라면 DropConnect는 가중치를 비활성화 시키고 노드는 그대로 두는 방법"],
        ],
      },
      {
        caption: "동작원리",
        headers: ["구분", "동작원리", "설명"],
        rows: [
          ["학습", "Dropout Rate 입력", "하이퍼 파라미터로 입력된 수치만큼 노드가 제거될지 말지를 랜덤하게 결정. 0.5가 입력되면 50% 확률로 노드 비활성화를 결정"],
          ["학습", "노드 비활성화", "은닉층의 임의의 노드를 선택해 확률 P 기준으로 비활성화"],
          ["학습", "신경망 학습", "임의 노드가 비활성화 된 상태에서 학습 수행"],
          ["학습", "오류 역전파", "노드 비활성화를 다시하여 반복해 학습을 수행"],
          ["테스트", "테스트 수행", "비활성화된 노드를 복원하여 확률 P와 가중치 W를 곱하여 연산"],
        ],
      },
      {
        caption: "Dropout 효과",
        headers: ["구분", "효과"],
        rows: [
          ["학습측면", "동조현상 회피, 낮은 모델 복잡도, 앙상블 효과"],
          ["과적합 예방", "과적합 해결, Voting 효과"],
        ],
      },
    ],
  },
  {
    title: "밀도기반 클러스터링(DBSCAN)",
    course: "AI",
    definition:
      "임의의 클러스터 중심을 이동시키며 중심으로부터 정해진 반경 거리 내에 최소 데이터 포인트 개수를 확인하며 밀도 기반으로 군집화를 수행하는 알고리즘",
    defShort: "반경 내 최소 데이터 수 기준 밀도로 군집화하는 알고리즘",
    keywords: ["밀도", "군집화", "core", "border", "Epsilon", "connected"],
    tables: [
      {
        caption: "구성요소 (코보노)",
        headers: ["구성요소", "설명"],
        rows: [
          ["Core Point", "거리 e(Epsilon) 이내에 데이터가 m개 이상 존재하여 하나의 군집으로 인정되는 데이터 집합"],
          ["Border Point", "군집의 중심이 되는 core point는 되지 못하지만, core point로 하는 군집에는 속하는 데이터"],
          ["Connected", "core point와 core point가 반경내에 겹칠 경우 연결되어 있다고 보고 하나의 군집으로 정의"],
          ["Noise Point", "어떤 점의 중심으로도 조건을 만족시키지 못하는 데이터"],
        ],
      },
      {
        caption: "동작방식",
        headers: ["동작방식", "설명"],
        rows: [
          ["① Epsilon 설정", "두 인스턴스 최대 허용 거리. 이 거리 이내에 있는 인스턴스는 neighbor로 분류"],
          ["② minPts 설정", "군집을 형성하기 위해 Epsilon 내에 포함되어야 하는 인스턴스의 최소 개수. 낮은 minPts 값은 많은 noise point를 생성"],
          ["③ Core point 분류", "Epsilon 내에 minPts만큼의 neighbor가 포함된 포인트. 군집(cluster)을 형성하는 포인트"],
          ["④ Border Point 분류", "Epsilon 내에 minPts만큼의 neighbor가 포함되지 않는 포인트지만, 군집에는 포함되는 포인트. 군집의 경계 형성하는 포인트"],
        ],
      },
    ],
    notes: ["K-means와 비교: 반달 모양처럼 임의 형태의 데이터에서 K-means는 실패, DBSCAN은 성공 — 밀도 기반이라 군집 모양에 제약이 없다"],
  },
  {
    title: "오류 역전파(Backpropagation)",
    course: "AI",
    definition:
      "신경망에서 최적의 결과를 유도하기 위하여 계산된 예측 값과 실제 값과의 차이인 오류(Error)를 신경망의 각 노드에 역방향으로 전파하여 각 노드의 가중치를 업데이트하여 최적화하는 기법",
    defShort: "오차를 역방향 전파해 각 노드 가중치를 갱신하는 최적화 기법",
    keywords: ["오차(오류)", "Chain Rule", "Delta Rule", "경사하강법", "가중치 업데이트"],
    tables: [
      {
        caption: "역전파 절차",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["오차 계산 및 역전파", "출력값과 실제값 간 오차계산", "출력층의 출력값과 실제값 간의 오차 계산"],
          ["오차 계산 및 역전파", "경사하강법 이용", "역전파 알고리즘을 통해 각 가중치에 대한 기울기 계산"],
          ["최적화", "가중치 조정", "경사하강법을 통한 가중치 업데이트"],
          ["최적화", "반복", "가중치 업데이트 과정을 반복하며 모델의 성능 향상"],
        ],
      },
      {
        caption: "학습 단계",
        headers: ["동작원리", "설명"],
        rows: [
          ["출력층 오차", "출력층에서의 오차: 현재의 출력값과 정답의 차이. E_total = Σ½(target−output)² = E1+E2"],
          ["은닉층 오차", "출력층의 오차가 가중치를 고려하여 역방향으로 전파"],
          ["Chain Rule", "합성함수의 미분은 합성함수를 구성하는 각 함수의 미분의 곱으로 표현 가능. ∂E/∂W5 = ∂E/∂o1 × ∂o1/∂z3 × ∂z3/∂W5"],
          ["Delta(δ) Rule", "어떤 입력 노드가 출력 노드의 오차에 기여했다면, 두 노드의 연결 가중치는 오차에 비례하여 조절해야 함. w_ij ← w_ij + α·e_i·x_j (α: 학습률, e_i: 출력노드 i의 오차, x_j: 입력노드 j의 출력)"],
          ["가중치 업데이트(경사하강법 활용)", "W5+ = W5 − α·∂E_total/∂W5 (α: 학습률)"],
        ],
      },
    ],
  },
  {
    title: "K-NN(Nearest Neighbor) Classification",
    course: "AI",
    definition:
      "라벨링 된 데이터로부터 거리가 가까운 'k'개의 다른 데이터의 레이블을 참조하여 분류하는 알고리즘",
    defShort: "가까운 K개 이웃의 레이블을 참조해 분류하는 알고리즘",
    keywords: ["Classification", "회귀", "지도학습", "예측", "거리기반"],
    tables: [
      {
        caption: "동작과정",
        headers: ["순서", "설명"],
        rows: [
          ["1) 숫자 K값 설정", "탐색할 이웃 수 K 결정 (K가 작으면 과적합 가능성·노이즈 민감, K가 크면 과소적합 가능성·데이터의 일반화 어려움)"],
          ["2) 거리 측정방법 설정", "유클리드 거리, 맨하탄 거리 등 거리 측정 기준 선택"],
          ["3) K개의 최근접 이웃 탐색", "분류하려는 샘플에서 K개의 최근접 이웃을 탐색"],
          ["4) 가장 많은 클래스에 속한 클래스에 할당", "다수결로 클래스 결정"],
          ["5) 클래스 확정", ""],
        ],
      },
      {
        caption: "성능평가 방법 (정정재F RA)",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["혼동행렬 환산수식", "정확도(Accuracy)", "(TP+TN) / (TP+FP+FN+TN)"],
          ["혼동행렬 환산수식", "정밀도(Precision)", "TP / (TP+FP)"],
          ["혼동행렬 환산수식", "재현율(Recall)", "TP / (TP+FN)"],
          ["혼동행렬 환산수식", "F-1 Score", "2 × (Precision × Recall) / (Precision + Recall)"],
          ["임계값 변화", "ROC", "Receiver Operating Characteristic — X축 위 양성률, Y축 진 양성률로 나타냄"],
          ["임계값 변화", "AUC", "Area Under the ROC Curve — ROC curve의 아래 면적. 1에 가까울수록 좋은 모델임"],
        ],
      },
      {
        caption: "거리 (유맨민체코)",
        headers: ["거리", "설명"],
        rows: [
          ["유클리디안 거리", "두 점 사이의 직선 거리"],
          ["맨하탄 거리", "격자형 경로를 따라 이동하는 거리(축). 차원이 증가해도 계산이 간단해 고차원에서 안정적 결과 보임"],
          ["민코프스키 거리", "유클리디안 거리와 맨해튼 거리의 일반화(기법 선택)"],
          ["체비쇼프 거리", "최대 거리를 기준으로 측정"],
          ["코사인 유사도", "두 벡터 간 각도를 기반으로 유사도를 측정"],
        ],
      },
    ],
  },
  {
    title: "기울기 소실과 기울기 폭주",
    course: "AI",
    definition:
      "기울기 소실: 깊은 인공 신경망 학습 시, 역전파 과정에서 기울기가 점차 작아져 가중치가 업데이트 되지 않는 현상 / 기울기 폭주: 역전파 과정에서 기울기가 점차 커져 가중치들이 비정상적인 큰 값으로 발산하는 현상",
    defShort: "역전파 중 기울기가 소멸하거나 발산해 학습이 실패하는 현상",
    keywords: ["ReLU", "Leaky ReLU", "Gradient Clipping"],
    tables: [
      {
        caption: "발생원인",
        headers: ["분류", "구분", "설명"],
        rows: [
          ["활성화 함수 측면", "은닉층 시그모이드(Sigmoid) 함수 사용", "(소실) 함수의 출력값이 0 또는 1에 수렴 / (폭주) 은닉층에 임계값을 넘어선 기울기가 전달되어 발산"],
          ["가중치 측면", "가중치 영향", "역전파(Backpropagation) 과정 중 가중치 폭주 / 훈련 모델에 적합하지 않은 가중치 사용"],
        ],
      },
      {
        caption: "해결방안",
        headers: ["분류", "구분", "설명"],
        rows: [
          ["활성화 함수 측면", "ReLU, ReLU 변형 함수 사용", "은닉층에서 시그모이드(Sigmoid) 함수 사용 지양. 기울기 수렴, 발산을 위한 ReLU, ReLU 변형함수 사용"],
          ["가중치 측면", "Gradient Clipping", "기울기 폭주를 막기 위해 임계값을 넘지 않도록 기울기 자름"],
          ["가중치 측면", "가중치 초기화", "훈련 모델 적합한 가중치로 초기화. Xavier 초기화: 여러 층의 기울기 분산 사이 균형 / He 초기화: Xavier 초기화의 ReLU 부적합성 한계 극복 방법"],
          ["가중치 측면", "배치 정규화", "인공 신경망의 각 층에 들어가는 입력을 평균과 분산으로 정규화하여 효율적 학습 제공"],
        ],
      },
    ],
  },
  {
    title: "K-평균 알고리즘",
    course: "AI",
    definition:
      "n개의 데이터를 K개의 군집으로 분류하기 위해 거리 기반으로 반복적으로 계산해 나가는 Clustering 알고리즘",
    defShort: "n개 데이터를 거리 기반 반복 계산으로 K개 군집화하는 기법",
    keywords: ["Clustering", "비지도학습", "군집화", "거리기반"],
    tables: [
      {
        caption: "성능평가 방법 (실엘)",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["실루엣 계수", "인접클러스터와의 비중 계산", "대부분의 개체가 높은 값을 가질 때 적정"],
          ["응집도", "중심과 거리 기반", "중심과 거리와의 오차의 제곱 합"],
          ["외부평가", "이미 정답을 정하여 평가", "이미 정해진 일부 데이터의 정답지 바탕으로 정확도를 평가"],
          ["Dunn Index", "군집간 거리 기반", "클러스터 내 최대거리에 대한 클러스터 간 최소거리. 군집 간 거리가 멀고 군집 내부의 분산값이 작으면 클러스터링이 잘 된 결과로 해석"],
          ["Elbow Method", "중심과 거리 기반", "적정 K값에서 가장 최소값을 보이는 모델. 응집도라고도 함"],
        ],
      },
      {
        caption: "수행절차",
        headers: ["단계", "설명"],
        rows: [
          ["1) 시작", "데이터를 모두 받아들임(lazy learning)"],
          ["2) Cluster K개 지정", "파라미터 값으로 K개의 cluster개수를 사전에 입력 받음"],
          ["3) 초기 평균값 선정", "임의 정해진 일부 데이터 오브젝트 중 무작위로 뽑음"],
          ["4) 초기 평균값 기준으로 데이터 선별", "K의 각 데이터 오브젝트들은 가장 가까이에 있는 평균값 기준으로 묶임"],
          ["5) 최소 거리를 가진 데이터들로 그룹핑", "최소 거리에 기반하여 grouping 수행"],
          ["6) 평균값 재조정", "k개의 클러스터 중심점을 기준으로 평균값 재조정(수렴할때까지 3-5 단계 반복수행)"],
          ["7) 알고리즘 종료", "더 이상 평균값이 변경되지 않는 경우, 그룹핑을 완료"],
        ],
      },
    ],
  },
  {
    title: "PCA(Principal Component Analysis)",
    course: "AI",
    definition:
      "고차원 공간의 표본들을 선형 연관성이 없는 저차원공간(주성분)의 표본으로 변환하는 알고리즘",
    defShort: "고차원 표본을 분산 최대의 저차원 주성분으로 변환하는 기법",
    keywords: ["차원 축소", "잡음제거", "공분산", "Eigen Vector", "Eigen Value"],
    tables: [
      {
        caption: "동작과정",
        headers: ["절차", "설명"],
        rows: [
          ["1. 데이터 셋 로드", "PCA 분석을 위한 데이터셋을 준비"],
          ["2. 평균, 공분산 계산", "평균값과 편차를 구하고, 공분산을 계산"],
          ["3. 고유값, 고유 벡터 계산", "해당 데이터집합을 가장 잘 표현하는 고유 값, 고유벡터를 구함"],
          ["4. 주성분 선택", "고유값이 큰 순서대로 주성분 선택. 설명된 분산 비율(Explained Variance Ratio)로 몇 개의 주성분을 선택할지 결정"],
          ["5. 변환(Transform) 수행", "고유 값, 고유벡터를 이용하여 회전, 확장을 하여 새로운 기존 데이터셋을 설명하거나, 새로운 데이터셋 예측"],
        ],
      },
      {
        caption: "주요수식",
        headers: ["구분", "수식", "설명"],
        rows: [
          ["공분산", "Σ(X−X̄)(Y−Ȳ)/(n−1)", "두 확률 변수의 상관관계를 나타내는 값. C>0 양의 상관관계, C<0 음의 상관관계, C=0 두 변수는 독립임"],
          ["Eigen Vector", "Ax = λx (x: Eigen Vector)", "행렬 A를 선형변환한 결과가 자기 자신의 상수배가 되는 벡터"],
          ["Eigen Value", "(λ: Eigen Value)", "행렬 A를 선형변환한 결과가 자기 자신의 상수배가 되게 하는 값"],
        ],
      },
    ],
    notes: ["차원 축소 예시: 투영했을 때 분산이 큰 벡터를 찾는다"],
  },
  {
    title: "차원 축소(Dimensionality Reduction)",
    course: "AI",
    definition:
      "매우 많은 피처로 구성된 다차원 데이터 세트의 차원을 축소해 새로운 차원의 데이터 세트를 생성",
    defShort: "다차원 데이터의 차원을 줄여 새 데이터 세트를 만드는 기법",
    keywords: ["차원의 저주", "PCA", "LDA", "ISOMAP", "로컬 선형 임베딩"],
    tables: [
      {
        caption: "목적",
        headers: ["목적", "설명"],
        rows: [
          ["직관적 분석", "다량의 차원을 2,3차원으로 변환하여 시각적으로 빠른 분석이 가능"],
          ["차원의 저주 완화", "샘플의 특성이 너무 많으면 학습이 매우 어려워지지 않도록 함"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "내용"],
        rows: [
          ["선형", "PCA", "고차원 공간의 표본들을 연관성 없는 저차원 공간(주성분)의 표본으로 변환 알고리즘"],
          ["선형", "LDA", "클래스간 분산과 클래스내 분산의 비율을 최대화하는 방식으로 데이터에 대한 특징 벡터의 차원을 축소하는 알고리즘"],
          ["선형", "특이값 분해(SVD)", "임의의 m×n 차원의 행렬에 대해 행렬을 분해할 수 있는 '행렬 분해' 방법"],
          ["선형", "요인 분석", "다수 변수들을 변수들 간의 관계를 분석하여 공통 차원들을 통해 축약하는 통계 기법"],
          ["비선형", "ISOMAP", "다차원 스케일링(MDS) 또는 주성분 분석(PCA)의 확장 및 두 방법론을 결합한 알고리즘"],
          ["비선형", "로컬 선형 임베딩(LLE)", "고차원의 공간에서 인접해 있는 데이터들 사이의 선형적 구조를 보존하면서 저차원으로 임베딩하는 알고리즘"],
          ["비선형", "AutoEncoder", "입력 데이터를 최대한 compression 시킨 후, 다시 본래의 입력 형태로 복원하는 신경망"],
          ["비선형", "SOM(Self-Organizing Map)", "저차원 격자에 고차원 데이터의 각 개체들이 대응하도록 인공신경망과 유사한 방식의 학습을 통해 군집을 도출해내는 기법"],
        ],
      },
    ],
  },
  {
    title: "유전 알고리즘(Genetic Algorithm)",
    course: "AI",
    definition:
      "자연세계의 진화현상인 유전학의 원리에 근거하여, 세대를 거치면서 적자생존을 통해 점진적으로 최적해를 탐색해가는 최적화 문제해결 알고리즘",
    defShort: "진화 원리로 적자생존을 반복해 최적해를 탐색하는 알고리즘",
    keywords: ["최적화 알고리즘", "반복"],
    tables: [
      {
        caption: "절차 (선교변대반)",
        headers: ["No.", "절차", "설명"],
        rows: [
          ["1", "초기화(Initialize)", "유전 알고리즘으로 해결하고자 하는 해를 유전자로 표현, 랜덤한 유전자를 적당한 개수만큼 준비"],
          ["2", "선택(Selection)", "개체군에서 적합도 계산하여 다음 세대로 전해질 후보 선택. 기법: 룰렛휠 선택, 순위 선택, 토너먼트 선택"],
          ["3", "교차(Crossover)", "선택한 유전자로 여러 방법을 이용해서 후대 유전자 생성. 기법: 단일점 교차, 다점 교차, 균등 교차, 산술 교차"],
          ["4", "변이(Mutation)", "일정한 변이 확률에 따라 생성된 자손 염색체의 일부 값 변이. 기법: 전형적 변이, 비균등 변이"],
          ["5", "대체(Replace)", "새로운 자손 염색체 개체군에 포함, 현재 유전자를 후대 유전자로 교체"],
          ["6", "반복(Loop)", "거의 모든 유전자가 같아졌고 변화가 없을 때까지 절차 반복. 반복 될때 해를 구하지 못할 가능성도 있으므로 튜닝 필요"],
        ],
      },
      {
        caption: "기법 (룰랭토 일다균산)",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["선택", "룰렛 휠", "적합도에 비례하여 선택 확률을 차등 적용하여 선택"],
          ["선택", "순위(랭크)", "적합도 순으로 순위를 매긴 후 가장 높은 해부터 순차적으로 선택"],
          ["선택", "토너먼트", "개체군 중 일정 개수 개체 임의 선택, 가장 높은 적합도 개체 선택"],
          ["교차", "단일점/다점 교차", "특정 지점을 기준으로 유전자 교차 진행"],
          ["교차", "균등 교차", "각 유전자에 대해 난수 발생 후 값에 따라 선택"],
          ["교차", "산술 교차", "현재 유전자에 특정 산술 연산 적용 진행"],
        ],
      },
    ],
    notes: ["출제 이력: 137회 정보관리 4교시, 113회 정보관리 3교시, 80회 정보관리 1교시"],
  },
  {
    title: "앙상블 학습(Ensemble Learning)",
    course: "AI",
    definition:
      "여러 개의 분류기를 생성하고, 그 예측을 결합함으로써 보다 정확한 예측을 도출하는 기법",
    defShort: "여러 분류기의 예측을 결합해 정확도를 높이는 기법",
    keywords: ["과적합", "결합", "보팅"],
    tables: [
      {
        caption: "4대 기법",
        headers: ["기법", "설명"],
        rows: [
          ["보팅(Voting)", "여러 개 분류기가 투표 통해 예측 결과 결정. 다수 분류기 예측 — 하드보팅 / 결정 확률 평균 — 소프트보팅. 서로 다른 유형의 알고리즘 결합"],
          ["배깅(Bagging)", "데이터 샘플링(Bootstrap)을 통해 모델 학습. 투표 방식 결정(Categorical), 평균 방식 결정(Continuous). 동일 유형 알고리즘을 서로 다른 샘플 데이터로 학습"],
          ["부스팅(Boosting)", "여러 개 분류기를 순차적 학습 수행, 강한 분류기를 만드는 방법. 오류를 줄이는데 초점 — 다음 분류기에 가중치(Weight) 부여. 유형: AdaBoost(Adaptive), GB(Gradient Boosting — 잔차를 경사하강법으로 보정), XGBoost, LightGBM, CatBoost"],
          ["스태킹(Stacking)", "Cross Validation 기반으로 개별 모델이 예측한 데이터를 meta dataset으로 하여 최종 모델 Meta Learner에서 학습"],
        ],
      },
    ],
    notes: ["배깅의 대표가 랜덤 포레스트, 부스팅의 대표가 XGBoost — 한 줄 연결로 암기"],
  },
  {
    title: "유사도(Similarity)",
    course: "AI",
    definition:
      "단어나 문장을 벡터화하여 특징벡터를 만들고, 벡터가 얼마나 같은지 나타내주는 척도",
    defShort: "벡터화된 데이터가 얼마나 같은지 나타내는 척도",
    keywords: ["벡터", "교집합의 크기/합집합의 크기", "코사인 각도", "유사도"],
    tables: [
      {
        caption: "유사도 측정법",
        headers: ["측정법", "공식", "특징"],
        rows: [
          ["코사인 유사도", "similarity = cos(θ) = A·B / (||A||·||B||)", "두 벡터 간의 코사인 각도를 이용하여 계산. 방향성 — 유사도가 0일 경우 두 항목에 일치점이 없음"],
          ["해밍 거리", "D(p,q) = Σ|p_i − q_i|  (p,q: 1 또는 0)", "두 문자열 또는 이진 벡터 간 서로 다른 위치(비트)가 몇 개인지를 측정하는 거리. 동일 길이 필요 — 길이가 다를 경우 측정 불가. XOR 연산으로 거리 측정"],
          ["자카드 인덱스", "J(A,B) = |A∩B| / |A∪B|", "두 집합 관계를 합집합과 교집합의 비율로 유사도 산출. 비율 — 0이면 관계없음, 1에 가까울수록 동일"],
          ["소렌슨-다이스 인덱스", "S(A,B) = 2|A∩B| / (|A|+|B|)", "공동 원소 수와 평균 원소 수의 비율로 유사도 산출. 자카드 인덱스 대비 교집합 크기를 두 배로 반영해 일치 정도를 강조"],
        ],
      },
    ],
  },
  {
    title: "LDA(Linear Discriminant Analysis)",
    course: "AI",
    definition:
      "클래스간 분산과 클래스 내 분산의 비율을 최대화하는 방식으로 데이터에 대한 특징 벡터의 차원을 축소하는 알고리즘",
    defShort: "클래스 간/내 분산 비율을 최대화해 차원 축소하는 알고리즘",
    keywords: ["클래스 간 분산/클래스 내 분산", "고유벡터", "고유 값", "decision boundary"],
    tables: [
      {
        caption: "동작과정 (전산고변)",
        headers: ["절차", "설명"],
        rows: [
          ["1. 데이터 전처리", "데이터 정규화 수행"],
          ["2. 산포행렬 계산", "클래스 간 산포행렬 S(B) 구성, 클래스 내부 산포행렬 S(W) 구성"],
          ["3. 고유값, 고유 벡터 계산", "S(W) 역행렬, S(B) 곱행렬을 통한 고유 값, 고유벡터 계산"],
          ["4. 변환(Transform) 수행", "고유 값, 고유벡터를 이용하여 회전, 확장을 하여 새로운 기존 데이터셋을 설명하거나, 새로운 데이터셋을 예측"],
        ],
      },
      {
        caption: "PCA와 LDA 비교",
        headers: ["구분", "PCA", "LDA"],
        rows: [
          ["목적", "데이터 분산 최대화", "클래스 분리 최대화"],
          ["학습 방식", "비지도 학습", "지도 학습"],
          ["기준", "데이터 자체의 분포 고려", "클래스 간/내 분산 비율 고려"],
          ["차원 축소 가능 범위", "모든 차원 가능", "최대 (클래스 수 − 1)"],
          ["데이터 성질", "선형 구조", "선형 구조, 라벨 필요"],
          ["사용 사례", "차원 축소, 노이즈 제거, 데이터 압축", "분류 문제, 클래스 간 차원 축소"],
        ],
      },
    ],
    notes: ["LDA 가정: ① 각 집단이 정규분포 형태의 확률분포 가짐 ② 각 집단은 비슷한 형태의 공분산 구조를 가짐. 평균의 차이를 극대화하고 분산을 최소화"],
  },
  {
    title: "거리 공식(Distance Formula)",
    course: "AI",
    definition:
      "두 데이터 간의 차이를 측정하기 위한 방법으로 데이터 간의 거리가 가까울수록 유사한 데이터로 판별하는 척도",
    defShort: "데이터 간 차이를 측정해 유사성을 판별하는 척도",
    keywords: ["직선거리", "절대값거리", "L2거리", "L1거리"],
    tables: [
      {
        caption: "거리 공식 유형",
        headers: ["거리", "공식", "특징"],
        rows: [
          ["유클리디안 거리(L2, 직선)", "√Σ(p_i − q_i)²", "벡터 공간 내 두 점 사이의 직선 거리를 이용해 유사도 측정"],
          ["맨하탄 거리(L1, 직각)", "d = Σ|a_i − b_i|", "벡터 공간 내 두 점 사이의 수평, 수직 이동 거리를 이용해 유사도 측정"],
          ["체비쇼프 거리", "d(A,B) = max|x_i − y_i|", "좌표 차원 중 가장 긴 거리를 이용해 유사도 측정"],
          ["마할라노비스 거리(상관관계)", "d_M(x̄) = √((x̄−μ̄)ᵀ S⁻¹ (x̄−μ̄))", "상관관계(correlation)와 분산(covariance)을 고려하는 통계적 거리. 두 변수가 상관관계 높을수록 가깝게 평가, 평균에서 멀리 떨어질수록 이상치로 탐지됨"],
          ["민코프스키 거리(복합)", "d(x,y) = (Σ|x_i − y_i|^p)^(1/p)", "유클리드·맨해튼·체비쇼프 거리의 일반화. p=1 맨하탄, p=2 유클리디안, p=∞ 체비쇼프"],
        ],
      },
    ],
  },
  {
    title: "트랜스포머(Transformer)",
    course: "AI",
    definition:
      "어텐션 메커니즘을 사용하여 입력된 문장을 병렬적으로 처리하여 문장 내 단어들의 위치 정보를 보존하면서 효율적으로 처리하는 자연어 처리(NLP)를 위한 딥러닝 모델",
    defShort: "어텐션으로 문장을 병렬 처리하는 NLP 딥러닝 모델",
    keywords: ["인코더", "디코더", "어텐션 메커니즘", "LLM"],
    tables: [
      {
        caption: "구성요소 [입포 인언피 디마인피 출리소]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["입력", "포지셔널 인코딩(Positional Encoding)", "입력단어의 위치 값 추가. 사인, 코사인 함수 이용. RNN 미 적용으로 인한 단어 위치 문제해결"],
          ["인코더", "인코더 셀프 어텐션(Encoder Self-Attention)", "멀티 헤드 셀프 어텐션: 입력 토큰 병렬처리. Query=Key=Value. 6개의 인코더가 이전 인코더의 어텐션 참조"],
          ["인코더", "피드 포워드 신경망(Feed Forward NN)", "Position-Wise 완전 연결망. 잔차(Residual) 연결이용 및 정규화 수행"],
          ["디코더", "마스크드 셀프 어텐션(Masked Self-Attention)", "멀티 헤드 셀프 어텐션: 입력 토큰 병렬처리. Query=Key=Value. 현재 이후 단어 마스킹 처리"],
          ["디코더", "인코더-디코더 어텐션", "셀프 어텐션 아님. 인코더 어텐션과 디코더 어텐션 결합 사용. 인코더 셀프 어텐션=Key=Value, 디코더 셀프 어텐션=Query"],
          ["디코더", "피드 포워드 신경망", "인코더 구조와 동일"],
          ["출력", "Linear Layer(Fully Connected Layer)", "디코더 출력을 벡터화하여 신경망 연결"],
          ["출력", "Softmax", "출력단어 예측"],
        ],
      },
    ],
    notes: ["개념도: Input Embedding+Positional Encoding → [Multi-Head Attention → Add&Norm → Feed Forward → Add&Norm]×N(인코더) / Output Embedding(shifted right) → Masked Multi-Head Attention → 인코더-디코더 어텐션 → Feed Forward → Linear → Softmax → Output Probabilities(디코더)"],
  },
  {
    title: "자연어처리(NLP, Natural Language Processing)",
    course: "AI",
    definition:
      "인간의 언어를 기계적으로 분석해서 컴퓨터가 이해할 수 있는 형태로 만들거나 혹은 컴퓨터가 처리한 이해할 수 있는 언어로 표현하는 기술",
    defShort: "인간 언어를 컴퓨터가 이해·표현하도록 처리하는 기술",
    keywords: ["자연어이해(NLU)", "자연어생성(NLG)", "자연어처리(NLP)"],
    tables: [
      {
        caption: "자연어 처리 모델 (LLM)",
        headers: ["모델", "설명"],
        rows: [
          ["GPT(Generative pre-trained Transformer)", "트랜스포머의 디코더 구조로 구성되어 few shot Learning 된 순방향 자연어 처리 모델"],
          ["BERT(Bidirectional Encoder Representations from Transformers)", "트랜스포머의 인코더 구조로 구성되어 fine tuning된 양방향 자연어 처리 모델"],
          ["T5(Text-to-Text Transfer Transformer)", "문제와 정답을 쌍으로 제공하여, 전이 학습을 사용하여 자연어 처리를 수행하는 자연어 처리 모델"],
        ],
      },
      {
        caption: "자연어 처리 주요기술 [형구의담]",
        headers: ["구분", "주요 기술", "설명"],
        rows: [
          ["NLP", "형태소 분석", "사용자가 발화한 문장에 대한 명사, 동사, 형용사, 조사 등의 품사 정보를 인식"],
          ["NLP", "구문 분석", "형태소를 결합해 구문이나 문장을 만드는 규칙, 특정 기준으로 구분한 각 chunk 사이의 관계 분석"],
          ["NLP", "의미 분석", "구문 분석 결과를 해석하여 문장 내 단어의 의미보다 문장 성분간 의미관계를 파악"],
          ["NLP", "담화 분석", "문맥 속에서 단어나 문장의 의미를 분석"],
          ["NLU", "Word Embedding", "여러 문장을 모델에 제공하고 문장의 문맥을 통해 단어의 의미를 학습시키는 방식"],
          ["NLU", "문장 분류(Sentence Classification)", "자연어로 입력된 문장을 K개 카테고리 중 하나로 분류하는 기술"],
          ["NLU", "Seq2Seq", "자연어로 문장을 입력으로 받고, 출력하는 기술"],
          ["NLU", "MRC(Machine Reading Comprehension)", "모델이 주어진 지문(Context)을 학습하고 질의(Query)에 대한 답변을 추론하는 기술"],
          ["NLU", "대화 모델(Conversation Model)", "입력 문장을 이해하고 답변을 생성하는 기능 뿐만 아니라 대화의 흐름을 관리하는 기술"],
          ["NLG", "담화 생성(Discourse Generation)", "사용자에게 원하는 질문의 답변을 하기 위해 상황에 적합한 자연어로 변환하는 과정"],
          ["NLG", "문장 계획(Sentence Planning)", "질문에 적합한 자연어 문법을 계획 및 생성"],
          ["NLG", "Lexical 선택", "생성된 문장에서 구문(명사/동사/형용사/부사) 선택"],
          ["NLG", "Morphological 생성", "문장 텍스트가 상황에 적합하지 않은 표현 또는 오류를 검출해서 최종 문장을 확정하는 과정"],
          ["NLG", "TTS(Text To Speech)", "컴퓨터의 프로그램을 통해 텍스트를 사람의 목소리로 구현해내는 기술"],
        ],
      },
    ],
    notes: ["개념도: 화자 → 음성 인식 → 언어 이해(NLU: 자연어 이해) → 대화 관리 ↔ Data Base → 언어(발화) 생성(NLG: 자연어 생성) → 음성 합성 → 화자", "LLM: GPT·BERT·T5와 같이 대량의 텍스트 데이터를 학습하여 인간과 유사한 언어 이해 및 생성 능력을 갖춘 초거대 언어 AI 모델"],
  },
  {
    title: "VAE(Variational Autoencoder)",
    course: "AI",
    definition:
      "모델평균(μ)과 표준편차(σ)를 학습하여 사후확률을 최대화 하여 입력 데이터와 유사한 새로운 데이터를 생성하는 AI 기술",
    defShort: "평균·표준편차를 학습해 유사한 새 데이터를 생성하는 모델",
    keywords: ["목표 지향", "실시간 피드백", "적응형 학습", "미세조정"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["인코더(Encoder)", "Input Layer", "학습할 x의 입력 데이터"],
          ["인코더(Encoder)", "Encoder", "입력 데이터의 차원을 축소하여 학습, Auto Encoder 사용"],
          ["Latent Space", "평균, 표준편차 벡터", "Input 값의 평균과 표준편차를 학습한 벡터 값"],
          ["Latent Space", "Sample Latent", "평균, 표준편차를 통한 사후 확률 추론. 변분추론을 통하여 근사적으로 학습"],
          ["디코더(Decoder)", "Decoder", "사후 확률을 최대화하는 확률 분포를 학습하여 네트워크의 출력값을 도출"],
          ["디코더(Decoder)", "Output Layer", "Input 데이터와 유사하지만 새로운 데이터를 생성"],
        ],
      },
      {
        caption: "목적",
        headers: ["목적", "설명"],
        rows: [
          ["데이터 압축 및 표현 학습", "입력 데이터를 잠재 공간(latent space)으로 변환하여 저차원 벡터로 표현. 연속적인 확률분포(정규분포)로 표현하여 일반화된 특성을 학습"],
          ["데이터 생성", "확률적(latent space) 모델을 사용하여 새로운 데이터를 샘플링하고 생성"],
        ],
      },
      {
        caption: "VAE와 AE 비교",
        headers: ["비교 항목", "VAE(Variational Autoencoder)", "AE(Auto Encoder)"],
        rows: [
          ["목적", "Decoder의 학습을 위해 Encoder 사용", "Encoder의 학습을 위해 Decoder 연결"],
          ["Latent Vector", "가우시안 확률 분포에 기반한 확률 값", "어떤 하나의 값"],
        ],
      },
    ],
    notes: ["개념도: INPUT → Encoder(축소) → Latent Space(coding μ · coding σ + Gaussian Noise) → Decoder(생성) → OUTPUT"],
  },
  {
    title: "GAN(Generative Adversarial Network)",
    course: "AI",
    definition:
      "Generator와 Discriminator가 서로 대립 과정을 통해 훈련 타깃을 생성하는 학습 모델로 두개의 네트워크로 구성된 심층 신경망",
    defShort: "생성자와 판별자가 대립하며 학습하는 생성형 심층 신경망",
    keywords: ["Generator", "Discriminator", "Min-Max 학습", "Nash균형", "모드진동", "모드붕괴", "준지도학습"],
    tables: [
      {
        caption: "생성방법 [가신간디]",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["생성자", "D(G(z)) = 1", "가짜데이터 생성하여 1의 확률 판별 목표. V(D,G)에서 최소화(min)하는 방향"],
          ["판별자", "D(x) = 1, D(G(z)) = 0", "가짜데이터는 0, 실제데이터는 1의 확률 판별 목표. V(D,G)에서 최대화(max)하는 방향"],
          ["학습 데이터", "X(Real Data)", "학습할 Real Data. 지속적인 학습 데이터 제공"],
          ["Loss Function", "min_G max_D V(G,D) = E[logD(x)] + E[log(1−D(G(z)))]", "생성자는 최소화, 판별자는 최대화하는 Min-Max 게임"],
        ],
      },
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["DCGAN", "사실적인 이미지를 생성하는 기술"],
          ["SRGAN", "저해상도 이미지를 고해상도 이미지로 변환하는 기법임"],
          ["스택 GAN", "입력된 문장과 단어를 해석해 이미지를 생성하는 인공지능 기법"],
          ["3D-GAN", "입체 모델 생성 네트워크로 가령 가구 사진을 통해 3차원 그림 생성"],
          ["사이클 GAN", "AI가 자율적으로 학습해 이미지의 스타일을 다른 스타일로 변환"],
        ],
      },
      {
        caption: "문제점",
        headers: ["문제점", "해결방안"],
        rows: [
          ["Generator와 Discriminator 간 학습 성능 편차로 인한 성능 한계 문제", "DCGAN활용, 특징 값 추출 통한 학습 성능 향상. Leaky ReLU 병용"],
          ["모드(최빈 값) 진동 및 모드 붕괴로 인한 상호 학습 상쇄 및 Local Minimum 수렴 문제", "Mini-Batch Discrimination, Historical Averaging 활용. 데이터 분포 경계 학습 및 학습 기억 사용"],
        ],
      },
    ],
    notes: ["모드진동: 특정 단계에 머무는 현상 / 모드붕괴: 일부 데이터만 학습", "개념도: Latent Space+Noise → Generator → 생성된 Fake Sample → Discriminator(Real Sample과 판별) → Correct? → Fine Tune Training"],
  },
  {
    title: "SVD(Singular Value Decomposition)",
    course: "AI",
    definition:
      "행렬을 고유한 기하학적 성질을 가진 세 행렬로 분해하여 원본 행렬의 중요한 정보만 유지하면서, 고차원 행렬을 저차원 행렬로 분리하는 기법",
    defShort: "행렬을 세 행렬로 분해해 저차원으로 압축하는 기법",
    keywords: ["특이값", "특이 벡터", "직교행렬", "대각행렬", "전치행렬"],
    tables: [
      {
        caption: "동작과정 [행분선재]",
        headers: ["절차", "설명"],
        rows: [
          ["① 데이터 행렬 준비", "주어진 데이터를 행렬 A형태로 준비. 행렬은 일반적으로 m×n크기를 가지며, m개의 행과 n개의 열로 이루어진 2차원 행렬"],
          ["② 특이값 분해(SVD 수행)", "행렬 A를 특이값 분해하여, A=UΣV^T 형태로 분해"],
          ["③ 특이값 선택", "대각행렬 Σ에서 가장 큰 특이값만 선택 중요 정보를 보존. 나머지 작은 특이값은 노이즈나 덜 중요한 정보로 간주"],
          ["④ 근사 행렬 재구성", "선택한 특이값들과 해당하는 특이벡터들을 이용해, 원본 행렬을 근사하는 저차원 행렬로 재구성"],
        ],
      },
      {
        caption: "주요수식 A = UΣV^T",
        headers: ["구분", "설명"],
        rows: [
          ["A", "m×n 크기의 원본 행렬"],
          ["U", "좌측 특이 벡터 행렬 m×m (직교행렬) — 행 공간"],
          ["Σ", "대각 행렬 m×n (대각) — 특이값"],
          ["V^T", "우측 특이 벡터 행렬 n×n (전치행렬) — 열 공간"],
        ],
      },
      {
        caption: "PCA와 SVD 비교",
        headers: ["비교 항목", "PCA", "SVD"],
        rows: [
          ["개념", "고차원 데이터를 저차원으로 축소하면서 데이터의 분산을 최대화하는 기법", "행렬을 세 개의 행렬의 곱으로 분해하여 데이터의 구조적 특성을 분석하는 기법"],
          ["목적", "데이터 분산을 최대한 설명하며 차원 축소 및 데이터 압축", "행렬의 패턴을 분해해 차원 축소, 데이터 압축 및 노이즈 제거"],
          ["특징", "대칭 행렬에 적용, 데이터의 분산에 기반", "비대칭 행렬에도 적용 가능, 특이값 기반 분해"],
          ["계산방식", "공분산 행렬의 고유값 분해", "특이값 분해를 통해 UΣV^T로 분해"],
          ["사례", "데이터 시각화, 특징 추출, 차원 축소", "추천 시스템, 이미지 압축, 문서 분류"],
        ],
      },
    ],
  },
  {
    title: "검색 삽입 생성(RIG, Retrieval Interleaved Generation)",
    course: "AI",
    definition:
      "대규모 언어 모델 답변 생성 시 텍스트를 생성하는 중간에 필요한 정보를 반복적으로 검색하여 언어 모델 답변의 정확성과 신뢰성을 높이는 기술",
    defShort: "답변 생성 중간에 필요한 정보를 반복 검색하는 기술",
    keywords: ["임베딩", "벡터 DB", "답변 생성 중 검색", "반복 검색", "할루시네이션"],
    tables: [
      {
        caption: "동작절차 [초검생반]",
        headers: ["항목", "설명"],
        rows: [
          ["초기 생성", "입력 쿼리를 바탕으로 초기 텍스트를 생성"],
          ["검색", "생성된 텍스트를 기반으로 추가적으로 필요한 정보를 외부 지식 소스에서 검색"],
          ["생성 업데이트", "검색된 정보를 바탕으로 생성 중인 텍스트를 업데이트"],
          ["반복", "필요에 따라 검색과 생성 업데이트를 반복하여 텍스트를 완성"],
        ],
      },
      {
        caption: "RAG와 RIG 비교",
        headers: ["구분", "RAG", "RIG"],
        rows: [
          ["검색 시점", "생성 전", "생성 중 (필요 시)"],
          ["검색 빈도", "일반적으로 한 번", "여러 번 (필요한 만큼)"],
          ["효율성", "상대적으로 낮음", "상대적으로 높음 (필요한 정보만 검색)"],
          ["복잡성", "상대적으로 낮음", "상대적으로 높음"],
          ["문맥 적합성", "상대적으로 낮을 수 있음", "상대적으로 높을 수 있음"],
          ["학습 난이도", "상대적으로 낮음", "상대적으로 높음"],
          ["대표적인 모델", "RAG (Facebook AI)", "데이터젬마(Google)"],
          ["일관성", "상대적으로 높음", "상대적으로 낮을 수 있음"],
        ],
      },
    ],
    notes: ["개념도: 사용자 질의 → 임베딩 모델(벡터 변환값 전달) → LLM 파운데이션 모델 → 답변생성 — (필요 시) 벡터 DB 검색 ↔ 생성 업데이트 반복 후 전달"],
  },
  {
    title: "검색 증강 생성(RAG, Retrieval Augmented Generation)",
    course: "AI",
    definition:
      "생성형 AI 서비스를 외부 데이터를 검색하고 검색된 관련 데이터를 컨텍스트에 추가하여 AI 모델의 정확성과 신뢰성을 향상시키는 기술",
    defShort: "외부 데이터를 검색해 컨텍스트에 추가, 정확성을 높이는 기술",
    keywords: ["인덱싱", "청크", "임베딩", "벡터 DB", "유사도", "프롬프트 증강", "할루시네이션(hallucination)"],
    tables: [
      {
        caption: "필요성",
        headers: ["구분", "설명"],
        rows: [
          ["지식단절", "모델 학습 이후에 생성된 데이터에 대해서는 학습 부족으로 품질 저하"],
          ["환각현상", "사실에 입각하지 않은 답변을 그럴듯하고 자연스럽게 하는 환각 증상"],
          ["범용성", "다방면에 일정 수준 이상의 답변을 할 수 있지만, 특정 영역의 전문성"],
        ],
      },
      {
        caption: "처리 단계 [저쿼정답출]",
        headers: ["단계", "기술 요소", "설명"],
        rows: [
          ["1. 문서 변환 & 저장", "Sentence Embedding, Vector DB", "문서를 읽어와서(Load) 분할(Split)하고 파싱(Parsing). Dense Vector 형태의 Sentence Embedding 변환. Indexing하여 Vector DB에 저장"],
          ["2. 입력 쿼리 & 문서 검색", "Query, 문서 검색(Document Retrieval)", "검색 시스템 활성화(Retrieval System Activation). 입력 쿼리를 검색 시스템이 이해할 수 있도록 쿼리 처리. 쿼리(Query)를 기반으로 말뭉치(corpus)를 검색하고 관련 문서나 정보 스니펫(snippet)을 검색"],
          ["3. 정보 증강(Information Augmentation)", "맥락 통합(Context Integration), 증강된 입력 형성", "원래 입력과 문서에서 추출된 관련 정보를 결합하는 것을 포함하여 검색된 문서를 입력 쿼리를 강화하는데 사용. 증강된 입력이 형성되며, 쿼리와 검색된 문서의 추가 맥락을 모두 포함"],
          ["4. 답변 생성", "Sequence to Sequence, BART(Bidirectional and Auto-Regressive Transformers)", "강화된(augmentation) 입력을 GPT나 BART와 같은 sequence to sequence 모델에 제공. 언어 모델은 입력된 내용을 처리하고 응답을 생성"],
          ["5. 출력 생성", "정제 및 형식화(Refinement and Formatting)", "생성 응답을 애플리케이션에 따라 요구 사항에 맞게 정제 혹은 형식화. 최종 응답을 RAG 프로세스의 출력으로 전달"],
        ],
      },
    ],
    notes: ["개념도: 사용자 질의 → 임베딩 모델 → 벡터 DB(지식 베이스)에서 컨텍스트 검색 → 질의+컨텍스트로 프롬프트 증강 → LLM 파운데이션 모델 → 답변. 외부지식은 임베딩 모델로 인덱싱하여 벡터 DB에 저장"],
  },
  {
    title: "할루시네이션(Hallucination)",
    course: "AI",
    definition:
      "인공지능 모델이 정확하지 않거나 사실이 아닌 조작된 정보를 생성하는 것을 의미",
    defShort: "AI가 사실이 아닌 조작된 정보를 생성하는 현상",
    keywords: ["편향", "과적합", "맥락이해 부족", "적대적 공격", "복잡한 모델", "고품질 데이터", "문맥개선", "RLHF", "RAG"],
    tables: [
      {
        caption: "발생원인 [불과적모맥제]",
        headers: ["원인", "설명"],
        rows: [
          ["편향, 불충분한 학습 데이터", "학습자료로 사용되는 오픈 데이터에 섞인 잘못된 정보 학습"],
          ["과적합", "학습 데이터는 구체적이고, 새 데이터에는 일반적이지 않은 출력 생성"],
          ["적대적 공격", "악의적인 행위자에 의해 조작되어 발생"],
          ["복잡한 모델 아키텍처", "매개 변수 증가로 복잡성이 높아지면 발생 가능"],
          ["맥락이해 부족", "맥락 이해 부족으로 맥락과 관련 없는 결과 생성"],
          ["제한된 도메인 지식", "설계 목적과는 다른 도메인이나 외부 입력이 제공되면 발생"],
        ],
      },
      {
        caption: "해결방안",
        headers: ["방안", "설명"],
        rows: [
          ["고품질 학습 데이터 제공", "다양한 학습데이터 사용하여 AI 모델의 부정확성 개선"],
          ["자연어 처리기술 기반 문맥 개선", "자연어 처리 기술 사용하여 모델 효율성 향상 및 문맥 이해도 향상"],
          ["RLHF 통한 보상모델 개발", "새로운 데이터와 피드백으로 AI 모델 개선하고 정확도 및 최신 상태 유지"],
          ["RAG(Retrieval-Augmented Generation)", "LLM 출력을 최적화하여 응답을 생성하기 전에 학습 데이터 소스 외부의 신뢰할 수 있는 지식 베이스를 참조하도록 하는 프로세스. 질문에 답하기 위해 필요한 지식을 외부 데이터베이스에서 검색하여 활용. LLM의 단점 중 '사실 관계 오류 가능성'과 '맥락 이해의 한계'를 개선하는 데 초점"],
        ],
      },
    ],
    notes: ["개념도: '이순신'·'거북선' 개별 질문 → 유효 출력 / '이순신과 여객선' 조합 질문 → 조합 결과 출력 발생(부정확 출력) — AI 할루시네이션 현상"],
  },
  {
    title: "초거대 언어 모델(Large Language Model)",
    course: "AI",
    definition:
      "대량 연산이 가능한 컴퓨팅 인프라와 대량의 데이터로 학습하여 사람의 언어를 이해하고 생성가능한 언어모델",
    defShort: "대량 컴퓨팅과 데이터로 언어를 이해·생성하는 언어모델",
    keywords: ["컴퓨팅 파워", "데이터", "모델 알고리즘", "트랜스포머", "BERT", "ChatGPT"],
    tables: [
      {
        caption: "구성도 [컴데모]",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["컴퓨팅 파워", "GPU 자원, 수퍼 컴퓨팅 자원", "학습시간 증가에 따른, 컴퓨팅 자원 중요(OpenAI-MS 협약 등). 추론 성능이 고려되기 시작. 정부 주도의 슈퍼컴퓨팅 센터 구축 또는 민간 기업 협업"],
          ["데이터", "초대규모 모델의 학습을 위한 데이터 구축, AI 학습 데이터 구축 사업", "대규모 데이터 학습을 통해 성능 향상(오픈AI 등). 대규모 언어모델의 비지도학습 활성화에 따른 데이터셋 라벨링 부담 완화. 데이터셋 규모 증가"],
          ["모델 알고리즘", "GPT-3, 트랜스포머, BERT", "연구 분야는 모델의 대형화, 서비스 분야는 모델의 경량화. 자연어 분야 성능평가(GLUE 등) 기준을 통해 모델 성능 측정"],
        ],
      },
      {
        caption: "기술요소",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["학습모델", "제로샷 러닝", "프롬프트를 통해 명시적 훈련 없이 요청에 응답"],
          ["학습모델", "퓨샷 러닝", "적은 데이터를 통해 새로운 작업, 도메인 학습"],
          ["학습모델", "파인튜닝", "용도에 따라 LLM 미세 조정 과정(후처리)"],
          ["프레임워크", "랭체인", "에이전트, 콜백 등 기능 연결 및 통합 간소화"],
          ["프레임워크", "벡터DB", "벡터 임베딩, 유사도 기반 신속 인덱싱 DB"],
          ["프레임워크", "프롬프트 엔지니어링", "원하는 결과 제공받기 위해 프롬프트 설계, 제작"],
        ],
      },
      {
        caption: "문제점 및 대응방안",
        headers: ["구분", "내용"],
        rows: [
          ["문제점", "검증되지 않은 응답 생성(환각 현상). 훈련 데이터 확보 어려움, 개인정보 유출. 편향된 결과 및 응답 품질 저하 발생. 대규모 언어 모델 확장/배포 어려움"],
          ["대응방안", "신뢰 지식베이스 기반 검색 증강 생성(RAG). 개인 정보 없이 실제와 유사한 합성데이터 사용. 프롬프트 엔지니어링 기반 최적 입력 설계. 랭체인, 벡터DB 등 기반 프레임워크 적용"],
        ],
      },
    ],
  },
  {
    title: "어텐션 메커니즘(Attention Mechanism)",
    course: "AI",
    definition:
      "디코더에서 출력 단어를 예측하는 매 시점(time step)마다, 인코더에서의 전체 입력 문장의 예측해야 할 단어와 연관 있는 입력 단어 부분을 집중해 참고하는 방법",
    defShort: "예측 시점마다 연관된 입력 부분에 집중해 참고하는 방법",
    keywords: ["Q(Query)", "K(Key)", "V(Value)", "Attention Score", "Attention Distribution", "Attention Value"],
    tables: [
      {
        caption: "어텐션 함수 [쿼키벨어] — Attention(Q,K,V)=Attention value",
        headers: ["순서", "설명"],
        rows: [
          ["1)", "'쿼리(Query)'에 대해 모든 '키(Key)'의 유사도를 각각 구한다"],
          ["2)", "유사도를 키(Key)와 매핑되어 있는 각각의 '값(Value)'에 반영"],
          ["3)", "'유사도가 반영된' 값(Value)을 모두 더해서 리턴"],
          ["4)", "어텐션 값(Attention value)를 반환"],
        ],
      },
      {
        caption: "어텐션 메커니즘 예측 과정 [스분값연예]",
        headers: ["과정", "설명"],
        rows: [
          ["어텐션 스코어(Attention Score)", "디코더에서 새로운 단어를 예측하기 위해, 디코더의 hidden state와 인코더의 hidden states들이 얼마나 유사한지를 판단하는 점수. score(s_t, h_i) = s_t^T h_i"],
          ["어텐션 분포(Attention Distribution)", "softmax를 활용해 Attention Distribution을 구함. 입력 시퀀스에 대응하는 hidden states를 활용해 Attention scores를 구하고, 어텐션 분포 벡터를 얻게 됨. 이 때 각각의 값을 Attention Weight(어텐션 가중치). α^t = softmax(e^t)"],
          ["어텐션 값(Attention Value)", "Attention Weight와 각 hidden state를 통해 최종적인 Attention value를 얻음. 어텐션 값은 인코더의 맥락을 포함하고 있기 때문에 Context Vector(맥락 벡터)라고도 불림. a_t = Σ α_i^t h_i"],
          ["연결(concatenate)", "어텐션 값과 decoder의 hidden state 값과 연결. decoder의 hidden state의 정보 외에도 encoder에서의 모든 hidden state를 고려한 정보 또한 포함하고 있기 때문에, sequence가 길어지더라도 정보를 크게 잃지 않음"],
          ["최종값 예측", "ŷ_t = Softmax(W_y s̃_t + b_y)"],
        ],
      },
    ],
  },
  {
    title: "랭체인(LangChain)",
    course: "AI",
    definition:
      "언어모델을 활용한 서비스 개발 시 여러 언어 모델과 통합을 간소화 하도록 설계된 SDK이자 다양한 언어모델을 기반으로 하는 애플리케이션 개발을 위한 프레임워크",
    defShort: "언어모델 통합을 간소화한 LLM 앱 개발 프레임워크",
    keywords: ["Agent", "Memory", "Model I/O", "Data Connection", "Chains", "Callbacks"],
    tables: [
      {
        caption: "구성요소 [모커에 체메콜]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["메인 모듈", "Model I/O", "언어모델 인터페이스로 모든 언어모델과 인터페이스 할 수 있는 빌딩 블록을 제공"],
          ["메인 모듈", "Data Connection(데이터 연결)", "애플리케이션 별 데이터와의 인터페이스로 모델 훈련세트의 일부가 아닌 사용자별 데이터가 필요, 데이터를 로드, 변환, 저장 및 쿼리할 수 있는 빌딩 블록을 제공"],
          ["메인 모듈", "Agent(에이전트)", "체인이 사용할 도구를 선택하여 동작하도록 지원. 언어모델을 사용하여 수행할 일련의 작업을 선택"],
          ["추가 모듈", "Chains", "다양한 기능을 제공하는 컴포넌트를 인터페이스를 이용하여 체인으로 연결"],
          ["추가 모듈", "Memory(메모리)", "체인 실행 시에 이전 상황을 기억하여 애플리케이션 상태 유지"],
          ["추가 모듈", "Callbacks", "모든 체인의 중간단계 기록 및 스트리밍. 로깅, 모니터링, 스트리밍 및 기타작업을 위한 연결"],
        ],
      },
      {
        caption: "주요기능",
        headers: ["주요기능", "설명"],
        rows: [
          ["다양한 데이터소스와 통합", "데이터베이스, API, 파일 시스템 등 다양한 데이터 소스와 통합하여 실시간 데이터 활용을 지원"],
          ["유연한 프롬프팅 및 컨텍스트 관리", "LLM을 효과적으로 활용하기 위해 프롬프팅과 컨텍스트 관리 도구를 제공하여 맞춤형 응답을 생성하여 사용자 경험을 향상"],
          ["파인튜닝 및 커스터마이징", "특정 비즈니스 요구에 맞는 언어 모델을 구축할 수 있도록 지원. 특정 작업에 맞춰 모델 조정, 다양한 모델을 최적화 & 유연성 제공"],
          ["데이터 반응형 애플리케이션 구축", "실시간 데이터를 처리하여 반응형 애플리케이션을 구축할 수 있도록 지원"],
        ],
      },
    ],
    notes: ["흐름도: ① Data Sources 외부 데이터 가져오기(Fetch External Data) → ② Word Embeddings 생성 → ③ Vector Database 저장·검색(Store and Retrieve Vectors) → ④ LLM에 프롬프트 전송·응답 수신(Send Prompt and Retrieve Response)"],
  },
  {
    title: "파인 튜닝(Fine-tuning)",
    course: "AI",
    definition:
      "일반적인 학습 과정에서 얻은 모델의 가중치를 초기 설정으로 사용하고, 새로운 데이터셋에 대하여 추가적인 학습을 진행하며 조정하는 과정",
    defShort: "학습된 가중치를 초기값으로 새 데이터셋을 추가 학습하는 과정",
    keywords: ["특정 작업 최적화", "전이 학습", "지도 파인 튜닝", "비지도 파인 튜닝", "미세조정"],
    tables: [
      {
        caption: "절차 [사조학최]",
        headers: ["구분", "핵심", "활용사례"],
        rows: [
          ["데이터처리", "사전 훈련된 모델", "대규모 범용 데이터셋으로 이미 훈련된 모델"],
          ["인터렉션", "타깃 데이터셋", "파인 튜닝을 위해 선택된 특정 작업이나 도메인 관련 데이터"],
          ["인터렉션", "추가 학습", "사전 훈련된 모델에 타깃 데이터셋을 사용하여 추가적인 학습을 진행"],
          ["인터렉션", "성능 평가", "추가 학습을 거친 모델의 성능을 검증하는 단계"],
        ],
      },
      {
        caption: "파인튜닝 방법",
        headers: ["방법", "내용"],
        rows: [
          ["Full Fine-tuning", "사전 학습된 모델의 모든 레이어와 매개변수를 업데이트하여 대상 작업에 맞게 조정하는 방법. 작업과 모델 간 차이가 크거나 높은 유연성이 필요"],
          ["Repurposing", "사전 학습된 모델의 하위 레이어를 유지하고 상위 레이어만 파인튜닝하여 특정 작업에 적용하는 방법. 작업과 모델 간 유사성이 있거나 데이터셋이 작은 경우 적합"],
        ],
      },
      {
        caption: "파인튜닝 유형",
        headers: ["유형", "내용"],
        rows: [
          ["지도 파인튜닝", "레이블이 지정된 학습 데이터셋을 사용하여 모델을 조정하는 과정. 샘플의 레이블을 통해 모델이 목표 출력을 학습하여 특정 작업에 더 잘 적응"],
          ["비지도 파인튜닝", "레이블 없는 데이터셋을 사용하여 모델을 조정하는 과정. 명시적 출력 없이 입력 데이터의 고유 구조를 활용해 유용한 특징을 추출하거나 모델의 표현 능력을 향상이 목적"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["구분", "고려사항", "설명"],
        rows: [
          ["학습측면", "학습률", "원래 가중치가 훼손되지 않도록 학습률 조정이 중요"],
          ["데이터 측면", "데이터 양", "타깃 데이터셋의 크기는 파인 튜닝의 효과에 중요한 요소로 작용"],
          ["모델 측면", "모델의 복잡성", "적절한 복잡성을 가진 모델을 선택하는 것이 중요"],
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
    defShort: "모델은 고정하고 프롬프트를 조정해 응답을 최적화하는 기법",
    keywords: ["최적화", "프롬프트 조합"],
    tables: [
      {
        caption: "프롬프트 튜닝과 파인튜닝 비교",
        headers: ["비교 항목", "프롬프트 튜닝(Prompt Tuning)", "파인 튜닝(Fine Tuning)"],
        rows: [
          ["목적", "다양한 프롬프트 조합을 반복적으로 조합해서 모델 출력 향상", "특정 데이터셋을 추가 학습시켜 모델의 성능을 특정 도메인이나 작업에 맞게 최적화된 모델 구축"],
          ["방법", "소프트 프롬프트(learnable input)를 추가하여 모델 출력을 향상", "모델의 파라미터를 새로운 도메인의 데이터 셋으로 재학습 진행"],
          ["모델의 구조 변경", "모델을 고정 시킨 상태에서 진행하므로 모델은 유지", "기본 모델(base model)에 새로운 데이터로 추가 학습하여 모델의 구조가 변경"],
          ["소요 리소스", "경량 작업으로 최소한의 하드웨어 자원 소요", "모델 학습이 진행되어야 하므로 많은 컴퓨팅 리소스와 시간이 필요"],
          ["정확도", "프롬프트의 품질에 따라 정확도가 결정", "데이터 품질에 따라 정확도가 결정"],
          ["기반 기술", "One-Shot Prompting, Zero-Shot Prompting, CoT(Chain-of-Thought)", "전이 학습(Transfer Learning), LoRA(Low-Rank Adaptation)"],
          ["오버 피팅", "성능은 향상되지만 모델은 고정되어 있으므로 프롬프트 튜닝으로 인한 오버 피팅(overfitting)은 발생 불가", "모델이 변경되는 튜닝이고, 새로 학습하는 데이터가 기존의 빅 데이터가 아닌 스몰 데이터(small data)이므로 오버 피팅(overfitting) 가능성 존재"],
          ["유연성 & 확장성", "다양한 작업에 적용 용이", "특정 도메인에 최적화되어 다른 작업의 전환 불가"],
        ],
      },
    ],
    notes: ["개념도: 프롬프트 튜닝은 프롬프트 조합을 변경(모델 고정), 파인튜닝은 특정 데이터 셋 추가 학습(모델 변경) — 파인튜닝과 다르게 입력 프롬프트 조합을 변경하는 것이 핵심", "방법: Mixed-task Batch — 소프트 프롬프트(learnable input)를 추가하여 모델 출력을 향상", "출제 이력: 2025.04 ITPE 모의고사 1교시"],
  },
  {
    title: "컨텍스트 엔지니어링(Context Engineering)",
    course: "AI",
    definition:
      "대규모 언어 모델(LLM)의 입력과 작동 방식에 있어, 사용자 의도와 목적에 따라 문맥(Context)을 정형화, 조작, 구성하여 정확도·일관성·목적 적합성을 향상시키는 기법",
    defShort: "문맥을 정형화·구성해 LLM 정확도·일관성을 높이는 기법",
    keywords: ["맥락(Context)을 설계·활용·최적화"],
    tables: [
      {
        caption: "핵심전략",
        headers: ["핵심 전략", "설명"],
        rows: [
          ["컨텍스트 작성(Context Writing)", "정보를 목적에 맞게, 일정한 '저장소'에 기록/정리"],
          ["컨텍스트 선택(Context Retrieval)", "업무 진행 상황에 따라, 적합한 정보/문맥만 골라 제공"],
          ["컨텍스트 압축(Context Compression)", "토큰 사용량을 최적화하기 위해 불필요한 정보 생략/요약"],
          ["컨텍스트 분리(Context Segmentation)", "각 작업/역할/세부 프로세스 별로 컨텍스트를 분리하여 관리"],
        ],
      },
      {
        caption: "구성요소 및 구현기술",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["핵심 구성요소", "맥락 검색 및 생성(Context Retrieval and Generation)", "프롬프트 설계와 외부 지식 검색을 통해 최적의 맥락 정보를 정제하고 모델에 주입하는 과정"],
          ["핵심 구성요소", "맥락 처리(Context Processing)", "긴 텍스트, 복잡한 시퀀스, 구조적 정보 통합, 모델의 자기 개선 기법을 사용하여 LLM이 맥락을 이해하고 처리 지원"],
          ["핵심 구성요소", "맥락 관리(Context Management)", "계층적 메모리 시스템과 정보 압축 기술을 활용해 한정된 컨텍스트 윈도우 내에서 최대한의 정보를 효율적으로 관리"],
          ["구현 기술", "검색 증강 생성(RAG)", "외부 데이터베이스나 검색 엔진에서 정보를 동적으로 가져와 프롬프트에 융합, 사실성과 확장성을 강화"],
          ["구현 기술", "메모리 시스템", "지속적인 상호작용을 지원하는 메모리 구조를 통해 모델의 맥락 유지 능력을 향상"],
          ["구현 기술", "도구 통합 추론", "외부 프로그램 및 API 호출을 통해 환경 지식을 확장하고 복합 추론을 실현"],
          ["구현 기술", "다중 에이전트 시스템", "여러 AI 에이전트 간 협업과 조정을 통해 복잡한 작업을 분담하고 최적화"],
        ],
      },
      {
        caption: "컨텍스트 엔지니어링과 프롬프트 엔지니어링 비교",
        headers: ["비교 항목", "컨텍스트 엔지니어링", "프롬프트 엔지니어링"],
        rows: [
          ["핵심 대상", "문맥 및 배경 정보(Context)", "입력 명령문(prompt)"],
          ["목적", "모델의 이해력과 일관성 향상", "모델의 출력 품질 향상"],
        ],
      },
    ],
    notes: ["개념도: 프롬프트 + 메모리 시스템·RAG·도구 통합 추론 → 맥락 검색 및 생성·맥락 처리 → LLM 추론 → 출력 → 맥락관리", "출제 이력: 2026.02 ITPE FR 5일차 1교시, 2025.08 ITPE FR 2일차 1교시"],
  },
  {
    title: "프롬프트 엔지니어링(Prompt Engineering)",
    course: "AI",
    definition:
      "컴퓨터와 상호작용을 하는 사용자를 위한 AI 인터페이스 개발 분야로 높은 수준의 결과물을 얻기 위해 적절한 프롬프트를 구성하는 작업 또는 엔지니어링 기법",
    defShort: "높은 수준의 결과를 얻도록 프롬프트를 구성하는 기법",
    keywords: ["생성형AI", "Task Description", "Input Indicator", "Output Indicator", "Zero-shot Prompting"],
    tables: [
      {
        caption: "구성요소 [태인커아 제원퓨C]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["질문", "Task Description", "모델이 수행하기를 원하는 상황에 대한 상세 설명"],
          ["질문", "Input Indicator", "입력 데이터의 지시자에 대한 설명"],
          ["질문", "Current Input", "프롬프트를 통한 질문 내용"],
          ["질문", "Output Indicator", "생성된 결과물의 유형 또는 형식을 나타내는 요소"],
          ["프롬프트 방식", "Zero-Shot Prompting", "추가 학습 또는 예제 데이터 없이 답변 생성 프롬프트 기술"],
          ["프롬프트 방식", "One-Shot Prompting", "하나의 예제 또는 템플릿 기반 답변 생성 프롬프트 기술"],
          ["프롬프트 방식", "Few-Shot Prompting", "수개의 예제를 바탕으로 답변 생성 프롬프트 기술"],
          ["프롬프트 방식", "CoT(Chain-of-Thought)", "답변 도달하는 과정 학습 중심의 프롬프트 기술"],
          ["추론 방식", "Zero-Shot CoT(Chain of Thought)", "CoT 방식을 활용, 예시나 사전 학습 없이도 단계별 추론을 수행하는 방식"],
          ["추론 방식", "ToT(Tree of Thought)", "다양한 사고 경로를 나무 형태로 분기시켜 가능성을 탐색하고 최적의 경로를 선택 방식"],
          ["추론 방식", "Self Consistency", "여러 번의 추론 결과를 종합하여 일관성 있는 최종 답변을 도출하는 방식 (일관된 답변)"],
          ["추론 방식", "Meta-Reasoning over Multiple Chains", "여러 추론 체인을 비교 분석하여 최적의 결론을 도출하는 방식"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["구분", "고려사항"],
        rows: [
          ["가이드라인", "대화 스타일 조정. 미사여구 최소화. 닫힌 지시문. 구체적인 지시사항. 예제를 함께 제공"],
          ["고도화", "마켓 플레이스 활용. 프레임워크 활용"],
        ],
      },
    ],
    notes: ["구성도: Prompt(Task Description · Input Indicator · Current Input · Output Indicator) → Language Model → Generated Text(Completion)"],
  },
  {
    title: "LoRA(Low-rank adaptation)",
    course: "AI",
    definition:
      "전체 모델을 재 훈련하지 않고 특정 용도에 맞게 대규모 머신 러닝 모델을 조정하는 방법",
    defShort: "저랭크 행렬만 학습해 대규모 모델을 조정하는 경량 튜닝",
    keywords: ["매개변수 일부만 파인튜닝", "PEFT"],
    tables: [
      {
        caption: "Fully Fine-Tuning 이 힘든 이유",
        headers: ["구분", "설명"],
        rows: [
          ["① LLM의 가중치(Weight)는 1.5~3B", "모델을 GPU에 로드 하는 것도 큰 비용이 발생"],
          ["② 모델의 Forward, Backward, 가중치, gradient 모두 GPU에 저장", "가중치 수 × 2~3배의 GPU vram 필요"],
        ],
      },
      {
        caption: "원리",
        headers: ["구분", "설명"],
        rows: [
          ["Pretrained Weights (W ∈ R^d×d)", "Query, Key, Value, Output layer 차원(d×k). 학습 시 Freeze — Weight update 안됨 → vram을 save"],
          ["LoRA A Layer", "차원: d×r, A = N(0, σ²)로 초기화"],
          ["LoRA B Layer", "차원: r×k, B = 0으로 초기화"],
          ["결과", "Pretrain Model에 weight 더함 — LoRA A layer, LoRA B layer의 weight만 업데이트"],
        ],
      },
    ],
    notes: ["사전 훈련된 모델의 가중치를 고정한 상태에서 Transformer 아키텍처 각각의 레이어에 훈련 가능한 행렬을 삽입해 다운스트림 과정에서의 매개변수 수를 크게 줄일 수 있는 방법. 모델의 매개변수를 저차원 구조로 유지함으로써 미세 조정 시 효율성을 높이는 기술", "W_q(query)·W_k(key)·W_v(value)·W_o(self-attention) 중 query와 key layer에 더해줬을 때 가장 좋은 성능(예: Trainable 18M, W_q·W_v Rank 4 — WikiSQL 73.7 / MultiNLI 91.3)"],
  },
  {
    title: "대규모 언어 모델(LLM) 성능 향상 기술",
    course: "AI",
    definition:
      "대규모 언어 모델(LLM)의 추론 능력 부족, 정보의 정확성 문제, 지식의 일관성 유지 어려움 등의 한계를 극복하기 위한 기술",
    defShort: "추론·검색·병합·효율화로 LLM 한계를 극복하는 기술",
    keywords: ["추론 능력 강화", "RAG", "모델 병합 및 결합", "효율성 및 비용 절감", "멀티모달 통합"],
    tables: [
      {
        caption: "주요기법 [추R모효멀]",
        headers: ["기술 그룹", "정의", "주요 기법"],
        rows: [
          ["추론 능력 강화(Reasoning Enhancement)", "모델이 논리적인 사고 과정을 통해 보다 정확하고 신뢰성 있는 응답을 생성하도록 돕는 기술", "Chain of Thought(CoT), Tree of Thought(ToT), Least-to-Most Prompting"],
          ["외부 지식 활용 및 정밀 검색(Retrieval-Augmented Generation, RAG)", "모델이 외부 데이터베이스를 참조하여 최신 정보를 반영하거나 문맥을 보강하여 더 정확한 응답을 생성하는 기술", "RAG, Knowledge-Intensive NLP"],
          ["모델 병합 및 결합(Merging & Integration)", "여러 개의 사전 훈련된 모델을 결합하여 성능을 향상시키거나 특정 태스크에 맞게 조정하는 기술", "Model Merging via Interpolation, DARE(Drop And REscale), Evolutionary Model Merging"],
          ["효율성 및 비용 절감(Optimization & Efficiency)", "모델의 계산 비용을 줄이면서도 성능을 유지하거나 향상시키는 기술", "Mixture of Experts(MoE), Sparse Attention, Quantization(양자화), LoRA"],
          ["멀티모달 통합(Multimodal Integration)", "텍스트뿐만 아니라 이미지, 음성, 영상 등을 함께 처리할 수 있도록 확장하는 기술", "CLIP, Flamingo, BLIP-2"],
        ],
      },
      {
        caption: "Reasoning 기술 상세",
        headers: ["Reasoning 종류", "설명", "대표적인 모델/기법"],
        rows: [
          ["사고사슬(Chain of Thought: CoT)", "답변을 도출하기 전에 중간 추론 과정을 단계별로 서술하여 복잡한 문제를 해결하는 방법", "GPT-3, GPT-4, PaLM"],
          ["디컴포지션(Decomposition)", "큰 문제를 여러 개의 하위 문제로 분해하여 단계별로 해결하는 방식", "Least-to-Most Prompting, Self-Ask"],
          ["메타-리즌(Meta-Reasoning)", "모델이 자신의 추론 과정을 검토하고 수정하여 더 나은 답변을 생성하는 능력", "Self-Reflection, ReAct"],
          ["귀납적 추론(Inductive Reasoning)", "주어진 데이터에서 패턴이나 규칙을 찾아내어 일반화된 결론을 도출하는 방식", "In-Context Learning, Transformer 기반"],
          ["상호 추론(Mutual Reasoning)", "두 개의 모델이 서로의 추론 과정을 검증하여 더 정확한 답변을 도출하는 방식", "rStar(Microsoft) 모델"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.05 ITPE FR 2일차 1교시"],
  },
  {
    title: "대형개념모델(LCM, Large Concept Models)",
    course: "AI",
    definition:
      "\"개념(Concept)\"을 의미 단위로 사용하여 토큰 기반 제약을 벗어나 보다 의미론적인 추론을 수행하는 모델",
    defShort: "토큰 대신 개념 단위로 의미론적 추론을 수행하는 모델",
    keywords: ["SONAR 임베딩 공간", "메타AI"],
    tables: [
      {
        caption: "아키텍처 [소프트포]",
        headers: ["구성", "설명"],
        rows: [
          ["① SONAR 인코더 및 디코더", "문장과 개념 임베딩 간의 변환 담당"],
          ["② PreNet [입력전처리]", "입력 데이터를 정규화(Normalization)하여 모델 내부 차원으로 매핑"],
          ["③ Transformer 기반 디코더", "문장 임베딩을 처리하고 다음 문장 임베딩을 예측"],
          ["④ PostNet [출력]", "예측된 임베딩을 다시 디노멀화(denormalization)하여 출력"],
        ],
      },
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["계층 구조", "계층 구조를 통한 긴 컨텍스트의 가독성 향상"],
          ["트랜스포머 단점 해결", "컨텍스트 길이에 따라 계산량이 기하급수적으로 늘어나는 트랜스포머 모델의 단점 해결"],
          ["제로샷 일반화", "훈련에 포함되지 않은 언어와 모달리티에 관한 뛰어난 제로샷 일반화"],
          ["확장성", "개념 인코더와 디코더를 모듈화로 분리해, 멀티모달모델에서 발생하는 간섭을 피하는 확장성"],
        ],
      },
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["Base-LCM", "단순한 자회귀적 문장 예측 모델"],
          ["Diffusion-based LCM", "연속적인 임베딩 공간에서 문장 간의 의미를 생성하거나 변환하는 데 초점을 맞춘 모델. One-Tower Diffusion: 단일 Transformer 모델을 사용하여 노이즈 제거와 문맥을 처리하는 단순한 구조 — 간결성과 학습 효율이 뛰어나지만 복잡한 문맥 처리는 다소 제한적 / Two-Tower Diffusion LCM: 문맥 정보 처리와 노이즈 제거를 각각 독립된 모듈로 분리하여 수행 — 문맥구조를 더 정교하게 처리하여 더 높은 품질의 문장 생성 가능, 컨텍스트라이저와 디노이저로 구성"],
          ["Quant-LCM", "SONAR 임베딩 공간의 연속적 데이터 표현을 이산적(Discrete) 데이터로 변환하여 모델링 효율성을 높이는 접근법을 채택한 모델"],
        ],
      },
    ],
    notes: ["SONAR 임베딩 공간: 200개 언어에 대한 텍스트 입력과 출력, 76개 언어의 음성 입력을 지원 → 문장 간 유사성을 효율적으로 측정하는 데 탁월"],
  },
  {
    title: "LAM(Large Action Model)",
    course: "AI",
    definition:
      "LLM의 언어 이해 능력에 실제 행동 수행 능력을 결합한 모델로 물리적인 세계와 상호작용하는 인공지능 모델",
    defShort: "언어 이해에 실제 행동 수행 능력을 결합한 AI 모델",
    keywords: ["AI Agent", "의도분류", "계층적작업분해", "Neuro-symbolic Programming", "RLHF"],
    tables: [
      {
        caption: "LAM 단계",
        headers: ["단계", "핵심", "설명"],
        rows: [
          ["입력처리 단계", "데이터 수집", "사용자의 원시 상태(Raw states)와 데이터를 구성하고 수집하는 단계"],
          ["분석 단계", "도메인 특화 프롬프트 설계", "기록된 데이터와 사용자 피드백을 바탕으로 프롬프트를 구성. 사용자의 행동이력과 결과를 포함한 프로세스 그래프와 API를 통해 생성"],
          ["실행 단계", "행동 생성", "현재 상태를 관찰하고 생성형 AI 모델을 기반으로 인공적인 행동을 생성"],
        ],
      },
      {
        caption: "핵심기술",
        headers: ["구분", "핵심기술", "설명"],
        rows: [
          ["Input Processing", "멀티모달 인코딩", "음성, 이미지 등 입력을 통합표현 공간으로 매핑"],
          ["Input Processing", "의도 분류", "요청을 사전 정의된 의도 카테고리와 매칭"],
          ["Input Processing", "동적 컨텍스트 윈도우", "상황·프로필 기반 적합한 컨텍스트 선택"],
          ["Planning & Reasoning", "Chain of Thought(CoT) Reasoning", "단계별 문제 해결 과정 설명 방식"],
          ["Planning & Reasoning", "계층적 작업분해", "큰 작업을 여러 개의 작업으로 나누어 순차실행"],
          ["Planning & Reasoning", "Neuro-symbolic Programming", "뉴럴과 심볼릭 AI 결합해 논리적 추론 수행"],
          ["Action Execution", "API 오케스트레이션", "외부 시스템과 연계해 작업 수행 관리"],
          ["Action Execution", "동적 계획 수립", "변경된 환경에 따른 실시간 수행 계획 조정"],
          ["Action Execution", "원자적 액션 실행", "각 작업을 독립 실행 단위로 처리"],
          ["Self-Correction & Feedback Learning", "다차원 평가 메트릭", "여러 기준을 조합하여 모델의 성능을 평가"],
          ["Self-Correction & Feedback Learning", "Contextual Memory & Adaptive Learning", "과거 상호작용을 기억하고, 사용자의 스타일에 맞춰 작업을 업데이트"],
          ["Self-Correction & Feedback Learning", "RLHF", "사용자의 피드백을 기반으로 학습"],
        ],
      },
    ],
    notes: ["발전 단계: LLM(자연어 이해·처리 특화, 텍스트 기반 콘텐츠 생성) → LMM(Large Multimodal Model — 다양한 데이터 통합 처리, 직관적인 사용자 경험 제공) → LAM(실제 행동 계획 및 작업실행, 복잡한 태스크 자동화)", "출제 이력: 2025.04 KPC 모의고사 3교시, 2024.07 ITPE FR 1일차 1교시"],
  },
  {
    title: "LangGraph",
    course: "AI",
    definition:
      "여러 에이전트가 협업하여 작업을 수행하는 기능을 수행하기 위한 멀티 에이전트 시스템을 구축하는 데 사용되는 LangChain 기반의 상태 관리 및 워크플로우 라이브러리",
    defShort: "멀티 에이전트 협업을 그래프로 구축하는 워크플로우 라이브러리",
    keywords: ["Agent", "멀티 Agent", "협업 Agent", "워크플로우 라이브러리", "노드", "엣지", "디자이너"],
    tables: [
      {
        caption: "구성",
        headers: ["구분", "설명"],
        rows: [
          ["목적", "NLP 작업 설계 및 실행 간소화. 데이터 흐름과 프로세스 가시화. 모듈 간 상호작용 최적 및 AI Agent화"],
          ["상세 구성요소", "노드(Node): NLP 작업의 개별 모듈(예: 텍스트 전처리, 모델 실행, 결과 분석 등) / 엣지(Edge): 노드 간 데이터 흐름 및 종속 관계 / 데이터레이어: 데이터 입력 및 출력 정의 / 워크플로우 디자이너: 시각적 UI로 그래프 설계 및 수정 가능 / API 통합: 외부 서비스나 모델과의 연결"],
          ["주요기능", "자연어 처리 파이프라인의 전반적인 구성, 연계 및 관리. 멀티 에이전트 통합을 위한 데이터 전처리, 모델 학습/평가, 결과 시각화. 프로세스 병렬 처리 및 재사용성 극대화"],
        ],
      },
      {
        caption: "LangChain과 LangGraph 비교",
        headers: ["구분", "LangChain", "LangGraph"],
        rows: [
          ["주요 목적", "LLM(대규모 언어 모델) 응용 프로그램 구축 및 실행을 위한 체계 제공. 체인을 사용한 작업 흐름 구성", "NLP 워크플로우를 시각적으로 설계하고 관리. 그래프 구조를 사용해 모듈 간 관계와 데이터 흐름 시각화"],
          ["구조적 접근법", "체인 기반(Chain of Tasks). 작업을 순차적, 병렬적으로 연결 가능", "그래프 기반. 노드(Node)와 엣지(Edge)로 구성된 비순차적 구조"],
          ["사용사례", "LLM API와의 상호작용. 정보 검색, 요약, 질문 응답 시스템 구축", "NLP 작업 설계. 데이터 흐름 관리. 복잡한 작업을 위한 모듈화 및 최적화"],
          ["유연성", "Python 코드로 체인을 정의하고, 코드 기반 커스터마이징 가능", "시각적 인터페이스를 통한 워크플로우 설계. UI/UX를 통해 비개발자도 사용 가능"],
          ["확장성", "다양한 오픈소스 및 상용 모델 API 통합 지원(예: OpenAI, Hugging Face)", "다중 데이터 소스와 모듈을 연결 가능. 병렬 처리 및 복잡한 워크플로우 최적화"],
        ],
      },
    ],
    notes: ["개념도: Question → Thought → Action → Observation → (If Finish Action) Finish — 자연어 처리를 위한 워크플로우 시각화 및 관리 도구, 그래프 기반 접근 방식, 다양한 NLP 모델 및 알고리즘 통합을 통한 Agent AI 지원"],
  },
  {
    title: "COT(Chain of Thought)",
    course: "AI",
    definition:
      "언어 모델이 복잡한 문제를 해결할 때, 단계별로 논리적 추론을 수행하도록 유도하는 방법론",
    defShort: "복잡한 문제를 단계별 논리 추론으로 풀도록 유도하는 방법론",
    keywords: ["단계적 논리적 추론", "사고 과정 단계"],
    tables: [
      {
        caption: "특징 및 구성요소 [문사최]",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["특징", "단계적 추론", "모델이 문제를 풀기 위한 일련의 중간 과정을 생성하며 논리적 흐름을 따름"],
          ["특징", "문제 해결력 향상", "수학 문제, 논리 퍼즐, 복잡한 의사결정 문제에서 더 나은 성능을 발휘"],
          ["특징", "설명 가능한 AI", "정답만을 제공하는 것이 아니라, 중간 사고 과정을 포함하여 더 신뢰할 수 있는 결과를 제공"],
          ["특징", "Prompt Engineering 활용", "적절한 프롬프트를 설계하여 모델이 COT 방식으로 추론하도록 유도"],
          ["구성요소", "문제 입력(Input Problem)", "COT 방식이 적용될 문제(예, 수학문제, 논리 문제 등)"],
          ["구성요소", "사고 과정 단계(Step-by-Step Thought Process)", "논리적으로 추론하는 과정. 각 단계에서 이전 정보를 기반으로 다음 단계로 진행"],
          ["구성요소", "최종 출력(Final Output)", "단계별 사고 과정을 거쳐 최종적으로 도출된 정답"],
        ],
      },
    ],
    notes: ["개념도: IO(Input-Output) Prompting은 Input→Output 직행 / CoT는 Input→thought→thought→thought→Output", "COT 프롬프트[프롬프트 엔지니어링]: '문제-풀이-답'과 같이 중간 과정을 단계별로 풀이했을 때, 성능 향상이 가능한 기법", "출제 이력: 2025.04 ITPE 모의고사 1교시"],
  },
  {
    title: "MOE(Mixture of Experts)",
    course: "AI",
    definition:
      "여러 개의 전문가 모델(Expert Model) 중에서 특정 입력에 대해 최적의 전문가를 선택하여 예측을 수행하는 모델 아키텍처",
    defShort: "입력별 최적 전문가 모델을 선택해 예측하는 아키텍처",
    keywords: ["Expert", "Routing", "딥시크"],
    tables: [
      {
        caption: "개념도 [익라]",
        headers: ["구성", "설명"],
        rows: [
          ["Experts", "각각의 전문가 네트워크가 독립적으로 특정 Feature Space에 특화되어 학습됨"],
          ["Router", "입력 값에 따라 어떤 전문가를 사용할지 결정 (Softmax, Top-k)"],
        ],
      },
      {
        caption: "특징 및 구성요소",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["특징", "Sparse Computation", "전체 전문가를 모두 사용하는 것이 아니라 일부 전문가만 활성화하여 계산 효율성을 높임"],
          ["특징", "전문가 모델 활용", "여러 개의 전문가가 각기 다른 하위 문제를 담당하여 모델 성능을 향상시킴"],
          ["특징", "게이팅 네트워크 활용", "입력을 기반으로 적절한 전문가를 선택하는 역할을 수행"],
          ["특징", "대규모 모델 확장 기능", "계산량을 효과적으로 분배하여 매우 큰 모델에서도 효율적으로 동작할 수 있음"],
          ["구성요소", "게이팅 네트워크", "입력 데이터를 분석하여 특정 전문가를 활성화하는 역할을 수행. 소프트맥스(Softmax) 함수를 사용하여 전문가의 가중치를 결정"],
          ["구성요소", "전문가 네트워크", "여러 개의 서브 모델로 구성되며, 각각 특정한 유형의 문제를 해결하도록 학습. 서로 다른 데이터 패턴을 학습 가능"],
          ["구성요소", "출력 조합 모듈", "선택된 전문가의 예측값을 가중합하여 최종 출력을 생성"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.04 ITPE 모의고사 1교시, 2025.04 KPC 모의고사 4교시"],
  },
  {
    title: "PEFT(Parameter-Efficient Fine-Tuning)",
    course: "AI",
    definition:
      "사전학습 된 모델의 전체 파라미터를 업데이트하지 않고 일부만 조정하여, 적은 자원으로 효과적인 파인튜닝을 실현하는 방법",
    defShort: "파라미터 일부만 조정해 적은 자원으로 파인튜닝하는 방법",
    keywords: ["일부만 파인튜닝"],
    tables: [
      {
        caption: "상세설명",
        headers: ["구분 항목", "PEFT"],
        rows: [
          ["범위", "파인튜닝 기법 통칭"],
          ["적용 방식", "일부 모듈 또는 파라미터만 학습, 나머지는 고정 (프리픽스 튜닝)"],
          ["확장성", "다양한 모델 및 태스크에 맞게 선택적 적용 가능"],
          ["파라미터 효율성", "전체 파라미터 대비 수~몇 % 수준만 업데이트"],
          ["학습 영향", "구조 및 목적에 따라 달라짐"],
          ["기술 목적", "비용·자원·시간 최소화하면서 커스터마이징"],
        ],
      },
      {
        caption: "PEFT 기법",
        headers: ["구분", "방법론", "설명"],
        rows: [
          ["Adapter", "Bottleneck 구조", "PLM 중간에 작은 신경망 삽입, 입력을 변환 후 원래 흐름에 합침"],
          ["Prefix Tuning", "Softmax/게이팅", "입력 앞단에 학습 가능한 벡터 추가, Softmax로 영향 조절"],
          ["LoRA", "저랭크 행렬 추가", "PLM 가중치 대신 저랭크 행렬 추가 학습, Scaling 통해 영향 조정"],
          ["Parallel Adapter", "병렬 어댑터", "PLM 경로와 병렬로 ReLU 기반 어댑터 연결, 두 결과를 합침"],
          ["Scaled PA", "스케일 조정 병렬", "Parallel Adapter 구조에 Scaling 추가, 영향력 미세 조정"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.10 ITPE 모의고사 1교시"],
  },
  {
    title: "MLPerf",
    course: "AI",
    definition:
      "AI 하드웨어와 소프트웨어의 학습(Training) 및 추론(Inference) 성능을 다양한 조건에서 평가할 수 있는 벤치마크",
    defShort: "AI HW·SW의 학습·추론 성능을 평가하는 벤치마크",
    keywords: ["Training", "Inference", "CLOSED 방식", "OPEN 방식"],
    tables: [
      {
        caption: "평가항목 [학추]",
        headers: ["평가항목", "설명"],
        rows: [
          ["학습부문(Training)", "특정 AI 시스템이 얼마나 빠른 시간 안에 AI 모델을 학습시킬 수 있는가를 평가"],
          ["추론부문(Inference)", "다양한 환경에서 사전 학습된 AI 모델에 데이터를 입력하여 얼마나 빠르고 정확하게 결과를 도출하는지 평가"],
        ],
      },
      {
        caption: "평가지표 [훈처 추정처]",
        headers: ["구분", "지표"],
        rows: [
          ["학습부문(Training)", "훈련시간, 처리량"],
          ["추론부문(Inference)", "추론속도, 정확도, 처리량"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["벤치마크 측면", "이미지 분류", "가장 높은 예측 값을 갖는 분류"],
          ["벤치마크 측면", "객체탐지", "주어진 탐지 박스와 예측 박스의 겹치는 영역을 변경하면서 그 평균을 측정"],
          ["벤치마크 측면", "음성인식", "음성에 해당하는 텍스트와 예측값을 단어 단위로 비교"],
          ["벤치마크 측면", "자연어처리", "주어진 단어 다음에 올 단어를 제대로 예측한 비율"],
          ["벤치마크 측면", "추천시스템", "이전 분류에서 주로 활용되는 평가지표"],
          ["벤치마크 측면", "강화학습", "특정 모델이 다른 모델 대비 승률이 50%일 경우 학습 종료"],
          ["학습방식 측면", "CLOSED 방식", "과업, AI 모델, 데이터를 고정한 AI 모델의 성능 도달시간과 소요 시간으로 경쟁"],
          ["학습방식 측면", "OPEN 방식", "CLOSED 방식에서 제시된 AI 모델의 성능 이외 모든 항목 자유롭게 설정"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.06 KPC 모의고사 1교시"],
  },
  {
    title: "테스트 타임 스케일링(Test-Time Scaling, TTS)",
    course: "AI",
    definition:
      "모델을 추론(inference) 단계에서 더 나은 성능을 발휘하도록, 입력 크기·샘플 수·리소스 사용량 등을 시간 축에 따라 조정하는 기법",
    defShort: "추론 단계에서 연산을 조정해 성능을 높이는 기법",
    keywords: ["추론 성능 향상", "성능 향상", "연산량 조절"],
    tables: [
      {
        caption: "특징",
        headers: ["항목", "설명"],
        rows: [
          ["목적", "추론 성능을 개선하면서도 모델 구조나 파라미터는 유지"],
          ["적용 시점", "모델 실행 시점 (inference-time)"],
          ["핵심 전략", "다중 샘플링, 탐색 기반 디코딩, 응답 재정렬 및 수정"],
          ["장점", "학습 없이 성능 향상 가능, 저비용·고정밀 응용에 적합, 연산량 조절"],
        ],
      },
      {
        caption: "대표 기법 [베빔체몬]",
        headers: ["분류", "대표 기법", "핵심 아이디어 & 설명"],
        rows: [
          ["Sampling 기반", "Best-of-N Sampling, Confidence-based Sampling", "N개의 응답을 생성한 뒤 가장 높은 신뢰도를 가진 응답을 선택하는 방식"],
          ["Decoding 기반", "Beam Search", "N개의 응답을 생성하면서 중간단계를 평가하여 확장"],
          ["Decoding 기반", "Self-Consistency Decoding", "여러 CoT 응답을 생성 후 다수결 또는 평균으로 최종 응답 결정"],
          ["Reasoning 기반", "Chain-of-Thought(CoT)", "사고 과정을 단계별로 명시적으로 유도"],
          ["Reasoning 기반", "Tree-of-Thought(ToT)", "추론을 트리로 만들어 다양한 분기 탐색"],
          ["Reasoning 기반", "Graph-of-Thought(GoT)", "그래프 구조로 추론을 유연하게 연결"],
          ["Search & Verification 기반", "Search Against Verifiers", "다수 응답을 생성한 후 보상모델로 평가"],
          ["Search & Verification 기반", "Monte Carlo Tree Search(MCTS)", "MCTS는 rollout을 통해 탐색 경로를 확장 및 평가"],
          ["Self-Improvement 기반", "Sequential Revision, Self-Refinement, Chain-of-Action-Thought", "모델이 응답 → 비판 → 수정의 반복적 과정을 수행. CoT 기반 추론을 자체 feedback loop로 개선"],
          ["Compute 최적화 기반", "Compute-Optimal Scaling(COS)", "문제 난이도를 자동으로 판단해 쉬운 문제는 순차적(sequential), 어려운 문제는 병렬(parallel) 탐색으로 처리하는 방식"],
        ],
      },
      {
        caption: "사전학습과 TTS 비교",
        headers: ["구분", "사전학습(Pretraining)", "TTS(Test-Time Scaling)"],
        rows: [
          ["목적", "모델 자체의 능력 확장", "추론 시점의 성능 향상"],
          ["비용 구조", "초기 비용 높음", "유연한 추론 비용 할당"],
          ["변경 여부", "모델 파라미터 수정", "파라미터 유지"],
          ["강점", "새로운 능력 획득", "응답의 품질 및 정확도 향상"],
          ["단점", "재훈련 필요, 비용 큼", "느릴 수 있음, 실시간 최적화 필요"],
          ["대표 사례", "GPT-4, LLaMA 학습", "CoT, Beam Search, MCTS 등"],
        ],
      },
    ],
    notes: ["사전학습 모델을 활용하여 \"지금 이 순간\"에 더 잘 추론하게 만드는 기술", "기법 개념도: Best-of-N / Beam Search / Lookahead Search"],
  },
  {
    title: "MLOps",
    course: "AI",
    definition:
      "머신 러닝 프로세스인 데이터 수집, 분석, 배포를 자동화하기 위하여 DevOps와 결합한 머신 러닝을 위한 IT 운영 프레임워크",
    defShort: "ML 수집·분석·배포를 DevOps와 결합해 자동화하는 프레임워크",
    keywords: ["DevOps", "자동화", "CI/CD"],
    tables: [
      {
        caption: "파이프라인 [도파 데학평배]",
        headers: ["단계", "설명"],
        rows: [
          ["ML옵스 도구/솔루션 선택", "머신러닝 모델 자동화 프로세스의 시작"],
          ["파이프라인 구축", "자동화 파이프라인 구성"],
          ["데이터 수집", "ML 옵스로 자동화되는 구간의 시작"],
          ["모델 학습", "수집·정제된 데이터로 모델 학습"],
          ["모델 평가", "학습된 모델의 성능 검증"],
          ["모델 배포", "검증된 모델을 운영 환경에 배포"],
        ],
      },
      {
        caption: "단계",
        headers: ["단계", "설명"],
        rows: [
          ["0단계(빌드, 배포 수동)", "모델 개발, 학습, 배포가 수동. 수작업과 형상관리 부재로 비효율성 증가"],
          ["1단계(ML 파이프라인 자동화)", "ML 파이프라인 구성하여 각 단계가 자동화 및 재현성 보장. Feature Store등을 활용해 데이터와 특징추출과정관리. 단계: 1) ML옵스 도구선택 2) 파이프라인 구축 3) 데이터 수집/정제/라벨링 4) 모델학습 5) 모델평가"],
          ["2단계(CI/CD 파이프라인 자동화)", "CI/CD를 통해 배포 및 모니터링 까지 자동화. 실시간 성능 추적, 데이터 드리프트 감지. 단계: 1) ML옵스 도구선택 2) 파이프라인 구축 3) 데이터 수집/정제/라벨링 4) 모델학습 5) 모델평가 6) 모델 배포"],
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
    defShort: "LLM의 설계·관리·배포·유지를 통합·효율화하는 패러다임",
    keywords: ["LLM", "DevOps", "자동화", "CI/CD"],
    tables: [
      {
        caption: "LLMOps 단계별 구성요소",
        headers: ["구분", "구성 요소"],
        rows: [
          ["Data 수집, 처리", "정형, 비정형 Data 수집, 전처리"],
          ["기반모델", "기반모델 선정"],
          ["임베딩 처리", "벡터라이징 및 인덱싱, 벡터 데이터 베이스 저장"],
          ["프롬프트 관리", "프롬프트 엔지니어링, 프롬프트 체이닝"],
          ["테스트", "벌크 / 배치 테스트, 프롬프트 체이닝"],
          ["버전 관리", "CI / CD"],
          ["모니터링", "프롬프트 모니터링, 지연/ 안전성 모니터링"],
          ["최적화", "기반 모델 파인튜닝, 프롬프트 iteration"],
        ],
      },
      {
        caption: "데이터 수집 및 모델 개발 단계 구현 기술",
        headers: ["구분", "구현 기술", "설명"],
        rows: [
          ["Data 수집, 처리", "Spark / Kafka", "인메모리 기반 대용량 텍스트 처리 또는 실시간 스트리밍"],
          ["Data 수집, 처리", "S3 / Blob Storage", "클라우드 기반 object Storage"],
          ["기반모델", "open AI GPT 모델 / LLAMA 2·LLAMA3 / Gemini / Hugging Face", "open AI 개발 LLM, Meta 개발 LLAMA, Google 개발 Gemini, 텍스트처리·LLM 개발자 위한 오픈소스 커뮤니티"],
          ["임베딩 처리", "Qdrant / Faiss index, Milvus / Weaviate", "임베딩 처리 된 결과를 저장하기 위한 벡터 Store, SaaS형 벡터 DBMS 서비스"],
          ["프롬프트 관리", "Gradient J / HoneyHive, Azure AI Studio", "코드와 분리하여 다양한 버전 프롬프트 관리/개발, UI/UX 기반 프롬프트 플로우를 통한 개발 지원"],
        ],
      },
      {
        caption: "모델 운영 및 평가 단계 구현 기술",
        headers: ["구분", "구현 기술", "설명"],
        rows: [
          ["테스트", "Fiddler AI, Humanloop", "RAI(Responsible AI, 신뢰성 있는 AI)를 위한 기반기술"],
          ["버전 관리", "AWS code commit, Jenkins X", "클라우드 CI/CD를 위한 지속적인 통합과 배포를 위한 기술"],
          ["모니터링", "AnyScale, Arize", "모델의 안전성, 지연성, 환각 등에 대한 모니터링"],
          ["최적화", "Autoblock, TruEra", "앱 인터랙션을 수집하여 테스트 베드에 전송하여 개선"],
        ],
      },
    ],
    notes: ["벤다이어그램: LLMOps = Machine Learning ∩ DevOps ∩ Data Engineering 교집합(MLOps의 LLM 특화판)", "구성도: Proprietary/Public Data → Data Processing Pipelines → Embeddings(Vector Stores) / Pre-Trained LLM → Fine-Tuning·Few-Shot Learning → Context-Specific LLM·SLM → LLM API → End User Apps + RLHF, Model Versioning·Caching·Monitoring"],
  },
  {
    title: "인공지능 생성물 워터마크 적용 기술",
    course: "AI",
    definition:
      "인공지능을 포함한 알고리즘에 의해 크게 변경되거나 생성된 이미지, 동영상, 오디오, 텍스트 등의 정보(AI 생성물)에 인지 불가능한 워터마크를 삽입·추출하는 기술",
    defShort: "AI 생성물에 인지 불가 워터마크를 삽입·추출하는 기술",
    keywords: ["공간 기반", "변환 기반", "학습 기반", "이미지", "동영상", "텍스트 적용 기술"],
    tables: [
      {
        caption: "인지 불가능 워터마크 분류별 기술",
        headers: ["구분", "활용 범위", "설명"],
        rows: [
          ["공간 기반", "이미지, 동영상", "인공지능 생성물의 최하위 비트에 인지 불가능한 워터마크를 삽입하고 추출하는 방법"],
          ["변환 기반", "이미지, 동영상, 오디오", "이미지나 비디오 등의 데이터를 주파수 도메인으로 변환하여 워터마크를 삽입하는 방법"],
          ["학습 기반", "이미지, 동영상", "생성된 모든 이미지가 보이지 않는 서명을 숨기도록 생성 모델을 학습하는 워터마킹 기술"],
          ["학습 기반", "텍스트", "문장 생성 과정에 인지 불가능한 워터마크를 삽입하고, 생성 후 인간이 자연스럽게 글을 쓸 때와 비교해 분류"],
        ],
      },
      {
        caption: "이미지 및 동영상 워터마크 적용 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["공간 기반", "LSB(Least Significant Bit)", "이미지 픽셀에서 시각적으로 영향이 가장 적은 하위 비트(LSB)에 워터마크 삽입"],
          ["변환 기반", "DCT(Discrete Cosine Transform)", "이미지를 블록 단위의 주파수 정보로 변환하여, 주파수 영역의 계수를 추출해 워터마크 삽입"],
          ["변환 기반", "DWT(Discrete Wavelet transform)", "이미지를 다중 해상도 대역으로 변환하여, 주요 정보를 포함하는 저주파 영역의 서브밴드(LL)를 제외한 중/고주파 서브밴드(LH, HL, HH)에 주로 워터마크 삽입"],
          ["변환 기반", "Edge Masking", "이미지에서 엣지 정보 추출해, 엣지 영역에 워터마크 삽입"],
          ["학습 기반", "Stable Signature", "워터마크 인코더·디코더를 활용하여 사전 훈련을 거친 후, 디코더를 미세 조정하여 생성 과정에 워터마크 삽입"],
        ],
      },
      {
        caption: "오디오 및 텍스트 워터마크 적용 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["변환 기반", "Audio Seal", "샘플 단위(1/16k 초 해상도)에 워터마크 삽입"],
          ["변환 기반", "Time Aligned", "특정 시간이나 시간 패턴에 따라 워터마크 삽입"],
          ["변환 기반", "Echo Based", "오디오에 에코를 추가하여 워터마크 삽입"],
          ["변환 기반", "WavMark", "1초 분량의 샘플에 워터마크 식별을 위한 고정패턴을 포함하여 최대 32비트의 워터마크 삽입"],
          ["변환 기반", "Spread Spectrum", "오디오 신호 전체에 워터마크를 분산하여 삽입"],
          ["변환 기반", "QIM", "오디오 과도 검출 통해 주파수로 변환해 워터마크 삽입"],
          ["변환 기반", "Patch Work", "오디오 진폭, 위상 조정, 노이즈 삽입, 주파수 구성 조작과 같이 오디오에 미세한 차이를 만들어 워터마크 삽입"],
          ["변환 기반", "PerTH", "사람이 인식할 수 없는 영역에 주파수로 데이터를 인코딩하여 워터마크 삽입"],
          ["학습 기반", "학습 기반 워터마크", "언어 모델을 훈련하는 단계에서 워터마크 삽입"],
          ["학습 기반", "로짓 생성 워터마크", "모델이 생성할 다음 단어의 확률 분포를 조정해 워터마크 삽입"],
          ["학습 기반", "토큰 샘플링 워터마크", "조정된 확률 분포를 기반으로 선택된 토큰에 워터마크가 포함된 텍스트를 생성"],
        ],
      },
    ],
    notes: ["인공지능 생성물 차원: Content(Purpose·Intent·Contextual Believability), Format(Media Type·Realism)", "출제 이력: 2025.05 ITPE FR 1일차 2교시"],
  },
  {
    title: "생성형 인공지능 서비스 이용자 보호 가이드라인",
    course: "AI",
    definition:
      "생성형 인공지능 서비스 이용 과정에서 잠재적 위험들 사전 방지 및 이용자 권익 보호 위한 기본 원칙과 실천 방식 제시",
    defShort: "생성형 AI 위험 방지와 이용자 권익 보호 원칙·실천 방식",
    keywords: ["인간 존엄성 보호", "설명 가능성", "이용자 인격권 보호", "다양한 존중 노력"],
    tables: [
      {
        caption: "기본원칙 [인설안공비]",
        headers: ["원칙", "핵심내용", "설명"],
        rows: [
          ["인간 존엄성 보호", "인공지능의 인간 중심 운영", "AI가 인간을 보조하는 수단으로 작동하며, 인간의 결정권과 존엄을 해치지 않도록 설계되어야 함"],
          ["설명 가능성과 투명성 확보", "이용자 이해 중심 정보 제공", "AI가 왜 그런 결과를 도출했는지, 사용자에게 알기 쉽게 설명 가능한 구조여야 함"],
          ["안전한 작동 보장", "피해를 최소화하고 악의적 이용을 방지해야 함", "오작동, 잘못된 정보 생성, 프롬프트 남용 등의 위험을 사전 예방할 수 있는 안전 장치 필요"],
          ["공정성과 비차별", "불공정하거나 차별적인 결과가 발생하지 않도록 해야 함", "데이터 및 알고리즘의 편향을 줄이고, 모든 사용자에게 공정한 서비스를 제공하도록 설계"],
        ],
      },
      {
        caption: "실행 방안 — 이용자 권익 보호 [이결다입]",
        headers: ["실행방안", "핵심내용", "설명"],
        rows: [
          ["이용자 인격권 보호", "개인정보, 명예, 프라이버시 보호", "AI 산출물이 이용자의 인격을 침해하지 않도록 필터링·신고·차단 시스템 마련"],
          ["결정 과정의 설명 노력", "AI 작동 원리 및 결정 과정을 이용자에게 설명", "'AI가 생성한 것'임을 고지하고, 데이터 출처 등 이해 가능한 정보 제공"],
          ["다양성 존중 노력", "알고리즘·데이터 편향 방지 및 사회적 포용", "차별 방지, 다양한 관점을 반영한 산출물 제공, 편향 신고 시스템 구축"],
          ["입력데이터 수집·활용 관리", "데이터 활용에 대한 사전 고지와 동의", "입력값을 학습에 사용하는 경우 이용자 선택권 및 프라이버시 보호 보장"],
        ],
      },
      {
        caption: "실행 방안 — 콘텐츠 관리 및 책임 중심 [책건]",
        headers: ["실행방안", "핵심내용", "설명"],
        rows: [
          ["문제 해결을 위한 책임과 참여", "생성물 오류, 피해 발생 시 책임 범위 정의 및 대응 체계 구축", "이용자 책임 고지, 문제 발생 시 신고·조치 절차 및 모니터링 체계 마련"],
          ["건전한 유통·배포 노력", "유해·불법 콘텐츠의 생성 및 확산 방지", "허위정보·음란물 등 부적절 콘텐츠의 사전 차단, 청소년 보호 조치 포함"],
        ],
      },
      {
        caption: "생성형 AI 생태계 조성 방안",
        headers: ["구분", "내용"],
        rows: [
          ["핵심 요소", "투명성 및 설명가능성, 안전성 및 견고성, 공정성 및 형평성, 책임성 및 거버넌스, 개인정보 보호 및 데이터 관리 — EU AI Act·AI 기본법·ISO/IEC 42001과 연계"],
          ["조성을 위한 방안", "지속적인 연구 개발 투자, 표준 및 평가 체계 구축, 규제 및 정책, 교육 및 인식 개선, 산학연 협력/이용자 참여"],
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
    defShort: "생성형 AI 위험 방지와 이용자 보호 원칙(방통위 2025.2)",
    keywords: ["인간 존엄성 보호", "설명 가능성", "이용자 인격권 보호", "다양한 존중 노력"],
    tables: [
      {
        caption: "기본원칙 [인설안공비]",
        headers: ["원칙", "핵심내용"],
        rows: [
          ["인간 존엄성 보호", "인공지능의 인간 중심 운영 — AI가 인간을 보조하는 수단으로 작동, 인간의 결정권과 존엄을 해치지 않도록 설계"],
          ["설명 가능성과 투명성 확보", "이용자 이해 중심 정보 제공 — AI가 왜 그런 결과를 도출했는지 알기 쉽게 설명 가능한 구조"],
          ["안전한 작동 보장", "오작동·잘못된 정보 생성·프롬프트 남용 등의 위험을 사전 예방할 수 있는 안전 장치"],
          ["공정성과 비차별", "데이터·알고리즘의 편향을 줄이고 모든 사용자에게 공정한 서비스 제공"],
        ],
      },
      {
        caption: "실행 방안 요약",
        headers: ["구분", "내용"],
        rows: [
          ["이용자 권익 보호 [이결다입]", "이용자 인격권 보호(필터링·신고·차단) · 결정 과정의 설명 노력('AI 생성' 고지·출처 제공) · 다양성 존중 노력(편향 방지·신고 시스템) · 입력데이터 수집·활용 관리(사전 고지·동의)"],
          ["콘텐츠 관리·책임 [책건]", "문제 해결을 위한 책임과 참여(책임 범위·신고 절차·모니터링) · 건전한 유통·배포 노력(유해·불법 콘텐츠 사전 차단·청소년 보호)"],
        ],
      },
    ],
    notes: ["'생성형 인공지능 서비스 이용자 보호 가이드라인'과 동일 문서(발표일 표기판) — 상세 표는 해당 서브노트 참조", "출제 이력: 138회 정보관리 3교시, 2025.05 ITPE FR 1일차 2교시, 2025.04 KPC 모의고사 3교시"],
  },
  {
    title: "ISO/IEC TS 42119-2",
    course: "AI",
    definition:
      "ISO/IEC/IEEE 29119 소프트웨어 테스트 표준을 AI 시스템에 적용하는 개요 및 가이드라인을 제시하는 기술 명세서",
    defShort: "SW 테스트 표준 29119를 AI 시스템에 적용하는 기술 명세서",
    keywords: ["범위", "용어", "AI시스템", "테스트 소개", "AI 시스템 리스크 식별", "AI 테스트 접근법"],
    tables: [
      {
        caption: "품질관리 활동",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["서문", "범위(Scope)", "29119 적용 범위 한정(AI 시스템 테스트 개요)"],
          ["서문", "Normative references", "29119 시리즈 + AI 표준(23894·25059·22989)"],
          ["서문", "Terms (40개)", "\"AI risk\", \"drift testing\", \"adversarial testing\" 등 AI 특화 용어"],
          ["서문", "Abbrev. Terms", "LLM, RTE 등 약어"],
          ["기술 본론", "AI 시스템·테스트 소개", "AI 시스템의 생애주기(설계-개발-배포-운영-재평가)를 정의하고, 기능 및 구조 관점의 시스템 뷰를 제시. 위험 기반(Risk-based) 테스트 접근을 중심으로 테스트 프로세스, 문서화 산출물, 이해관계자 역할을 규정하여 AI 아키텍처 전반에 대한 테스트 체계를 정립"],
          ["기술 본론", "AI 시스템 리스크 식별", "안전성, 공정성, 프라이버시, 보안 등 AI 고유 리스크를 식별·분류·분석하는 방법을 제시. ISO/IEC 23894(AI 위험관리)와 연계하여 리스크 수준에 따라 테스트 우선순위를 설정"],
          ["기술 본론", "AI 테스트 접근법", "시스템·통합·운영 등 테스트 레벨별 접근과 함께 공통 테스트, 데이터 품질 테스트, 모델 테스트, 지식기반 시스템 테스트 등 AI 특화 테스트 유형을 제시"],
          ["기술 본론", "Annex A~C", "기존 소프트웨어 테스트 개요를 정리하고, AI 시스템의 확률성·학습성·비결정성 등 특성을 설명"],
        ],
      },
    ],
    notes: ["표준 구성: 서문(범위 → Normative references → Terms 40개 → Abbrev. terms) / 기술 본론(AI 시스템·테스트 소개 → AI 시스템 리스크 식별 → AI 테스트 접근법 → Annex A~C)", "출제 이력: 2026.02 ITPE FR 1일차 1교시"],
  },
  {
    title: "BrainBody LLM",
    course: "AI",
    definition:
      "두 개의 대형 언어 모델(LLM)을 계층적으로 사용하여 모델간 상호작용을 통해 오류를 지속적으로 개선하도록 설계된 에이전트 시스템",
    defShort: "두 LLM을 계층화해 오류를 지속 개선하는 에이전트 시스템",
    keywords: ["계층", "계획", "실행", "피드백 루프"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Brain LLM", "고수준 작업 계획 및 의미론적 추론을 담당. 오류 피드백을 수신하여 원인을 분석하고 계획을 조정"],
          ["Body LLM", "하위 수준 제어 및 실행을 담당"],
          ["Closed-Loop Feedback", "실제 환경이나 시뮬레이터에서 오류가 발생하면, 이 오류 신호와 현재 환경 상태가 즉시 Brain-LLM으로 다시 전송. Brain-LLM은 오류를 추론하여 계획을 수정"],
        ],
      },
    ],
    notes: ["개념도: \"Eat chips on the sofa\" → Brain-LLM(Real World Knowledge) → High-level Plan(주방으로 걷기~칩 먹기) → Body-LLM → Low-level Plan(<char0>[walk]<kitchen>…) → Simulator/Controller → Feedback & Error Messages → Brain-LLM(반복)", "TPU 데이터 처리 흐름 예: WASH THE PLATE — Initial Plan 오류 → STATE FEEDBACK → Updated Plan(With Feedback) → SUCCESS"],
  },
  {
    title: "혼동행렬(Confusion Matrix)",
    course: "AI",
    definition:
      "데이터 분석에서 잘못된 예측의 영향을 파악하기 위해 예측된 값과 실제 값이 일치하는지 여부를 행렬로 분류하는 모델 평가 기법",
    defShort: "예측값과 실제값의 일치 여부를 행렬로 분류하는 평가 기법",
    keywords: ["TP/FP/FN/TN", "Precision", "Accuracy", "Recall", "Specificity", "FP Rate", "F1 점수", "Kappa"],
    tables: [
      {
        caption: "개념도 — 실제 정답 × 예측 결과",
        headers: ["구분", "예측 TRUE", "예측 FALSE"],
        rows: [
          ["실제 TRUE", "TP(True Positive)", "FN(False Negative)"],
          ["실제 FALSE", "FP(False Positive)", "TN(True Negative)"],
        ],
      },
      {
        caption: "평가 지표",
        headers: ["평가 항목", "산출식", "설명"],
        rows: [
          ["Precision", "TP / (TP + FP)", "정도 — Positive로 예측된 것 중 실제로도 Positive인 경우의 비율"],
          ["Accuracy", "(TP + TN) / (TP + FP + FN + TN)", "정해율 — 전체 예측에서 옳은 예측의 비율"],
          ["Recall", "TP / (TP + FN)", "진양성률, Sensitivity, True Positive Rate — 실제로 Positive인 것 중 예측이 Positive로 된 경우의 비율"],
          ["Specificity", "TN / (FP + TN)", "진음성률 — 실제로 Negative인 것 중 예측이 Negative로 된 경우 비율"],
          ["FP Rate", "FP / (FP + TN)", "False Alarm Rate — Positive가 아닌데 Positive로 예측된 비율. 1 − specificity와 같은 값"],
          ["F1 Score", "2 × (Precision × Recall) / (Precision + Recall)", "Precision과 Recall 사이의 균형을 맞추는 지표. 1에 가까울수록 좋은 모델, 0에 가까울수록 최악의 모델"],
          ["Cohen's Kappa Coefficient", "K = (Accuracy − P(e)) / (1 − P(e))", "정확도는 클래스 불균형이 심하면 높은 정확도가 나올 수 있지만 결과로선 의미가 없음. 관측된 일치도와 우연의 일치도 사용, 우연히 맞춘 경우까지 고려하여 보정"],
        ],
      },
    ],
    notes: ["ROC 커브: 이진 분류기의 성능을 표현하는 커브 — 가능한 모든 threshold에 대해 FPR과 TPR의 비율을 표현 / AUC: ROC 아래 면적 / PR Plot: 정밀도(Precision)와 재현율(Recall)의 관계를 나타내는 곡선"],
  },
  {
    title: "클래스 불균형(Class Imbalance)",
    course: "AI",
    definition:
      "탐색하는 타깃 데이터의 수가 매우 극소수인 상태",
    defShort: "타깃 데이터가 극소수인 상태 — 과대·과소표집으로 해결",
    keywords: ["정확도", "재현율", "Over sampling", "under sampling"],
    tables: [
      {
        caption: "해결방법 — 과대 표집(Over-Sampling) [렌아스블디]",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "소수 클래스의 데이터를 복제 또는 생성하여 데이터의 비율을 맞추는 방법"],
          ["유형", "Random Over Sampling, ADASYN, SMOTE, BLSMOTE, DBSMOTE"],
          ["특징", "정보가 손실되지 않는다는 장점이 있으나 과적합 초래 가능. 알고리즘의 성능은 높으나 검증의 성능은 나빠질 수 있음"],
        ],
      },
      {
        caption: "해결방법 — 과소 표집(Under-Sampling) [랜토이발]",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "다수 클래스의 데이터를 일부만 선택하여 데이터의 비율을 맞추는 방법"],
          ["유형", "Random Under Sampling, Tomek Links, EasyEnsemble, BalanceCascade"],
          ["특징", "데이터의 소실이 매우 크고, 정상 데이터를 잃을 수 있음. 과소 표집은 일반적으로 과대 표집보다 계산 시간이 감소"],
        ],
      },
      {
        caption: "해결방법 — 임곗값 이동(Cut-Off Value Moving)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "임곗값을 데이터가 많은 쪽으로 이동시키는 방법"],
          ["특징", "학습 단계에서는 변화 없이 학습하고 테스트 단계에서 임곗값을 이동"],
          ["예시", "수학 점수가 80점 이상이면 우수, 80점 미만이면 미흡. 임계값 = 80점. 임계값을 높이거나 낮춰서 불균형 해결"],
        ],
      },
      {
        caption: "모델 성능 지표 선택",
        headers: ["예측 대상", "조건", "지표"],
        rows: [
          ["범주(Class Labels)", "두 범주가 동등하게 중요 — 다수 범주가 80~90% 이상", "Geometric-Mean"],
          ["범주(Class Labels)", "두 범주가 동등하게 중요 — 다수 범주가 80~90% 미만", "정확도(Accuracy)"],
          ["범주(Class Labels)", "FN·FP가 동등하게 중요", "F1 Score"],
          ["범주(Class Labels)", "양성(Positive) 범주가 더 중요 — FP가 더 비용이 큰가", "F0.5 Score"],
          ["범주(Class Labels)", "양성(Positive) 범주가 더 중요 — FN이 더 비용이 큰가", "F2 Score"],
          ["확률(Probabilities)", "확률이 필요한가", "Brier Score"],
          ["확률(Probabilities)", "범주가 필요 — Positive 범주가 더 중요", "Precision-Recall AUC"],
          ["확률(Probabilities)", "범주가 필요 — 두 범주가 동등하게 중요", "ROC AUC"],
        ],
      },
    ],
    notes: ["클래스 불균형 문제: 불균형 데이터에서는 정확도(Accuracy)가 높아도 재현율(Recall)이 급격히 작아지는 현상 발생"],
  },
  {
    title: "Diffusion 모델",
    course: "AI",
    definition:
      "텍스트 및 이미지 프롬프트에서 고유한 실사 이미지를 생성하는 생성형 인공지능(생성형 AI) 모델 (텍스트 정보를 바탕으로 인공지능이 그림을 생성하는 모델)",
    defShort: "노이즈 추가·제거 학습으로 텍스트에서 이미지를 생성하는 모델",
    keywords: ["텍스트 to 이미지", "latent diffusion model", "CLIP", "U-Net", "VAE", "생성형 AI", "Diffusion", "가우시안 노이즈"],
    tables: [
      {
        caption: "기술요소",
        headers: ["기술", "기능"],
        rows: [
          ["Text Conditioning", "CLIP(Contrastive Language-Image Pretraining): Latent Diffusion 모델의 Text Encoder. Text Encoder는 Tokenizer를 이용해서 문장에서 단어를 추출하여 숫자로 변환하고(tokenize), 이 숫자를 latent vector의 형태인 text embedding 생성"],
          ["U-net(+ Scheduler)", "U-Net(Neural Network): 이미지 노이즈 제거의 핵심. Scheduler: Random latent vector를 방식(노이즈의 세기, 종류, 확률 편미분 방정식 이용 등)을 결정해 n번 반복하여 denoise 처리"],
          ["VAE(Variational Auto-Encoder)", "Encoder: 어떤 값을 수학적 원리를 통해 그 값의 특징을 추출하여 학습. Decoder: 임의의 값 z(특징에 대한 latent vector)가 주어지면 그 값을 바탕으로 원래 데이터로 복원"],
          ["순방향 디퓨전", "이미지에 노이즈 첨가"],
          ["역방향 디퓨전", "순방향 디퓨전의 반복적 취소(denoise)"],
        ],
      },
    ],
    notes: ["개념도: Prompt \"A dog wearing a hat\" → CLIP Model(Tokenizer → Token To Embedding) → Text Embeddings(1x77x768) → U-Net + Scheduler(노이즈 추가·제거 반복) → Conditioned Latents(1x4x64x64) → VAE → Output Image(3x512x512)", "Stable Diffusion·DALL-E·Midjourney가 이 구조 기반"],
  },
  {
    title: "AutoML",
    course: "AI",
    definition:
      "기계학습 파이프라인에서 데이터의 특징 추출, 하이퍼 파라미터(Hyperparameter) 설정 등 소모적이고 반복적인 작업을 자동화하는 머신러닝 프로세스",
    defShort: "피처 추출·하이퍼파라미터 설정을 자동화하는 ML 프로세스",
    keywords: ["피처 엔지니어링 및 하이퍼 파라미터 최적화를 자동화"],
    tables: [
      {
        caption: "프로세스 [피하신]",
        headers: ["프로세스", "주요 기법", "설명"],
        rows: [
          ["① 피처 엔지니어링(Feature Engineering)", "PCA, k-means clustering, Min-max 스케일링, BoW(Bag of Words)", "EDA(Exploratory Data Analysis)를 통하여 원시데이터를 통계적 기법과 시각화 기술을 활용하여 해석"],
          ["② 하이퍼 파라미터 최적화", "그리드 탐색, 랜덤 탐색, 베이지안 최적화(Bayesian Optimization)", "머신러닝 및 딥러닝 모델의 입력값으로 해당 모델이 목표 데이터 특성으로부터 일반화된 추론 성능을 훈련할 수 있도록 제어하는 기능을 수행"],
          ["③ 신경망 구조 탐색", "검색 공간, 검색 전략, 성능 추정 전략", "데이터구조에 적절하게 수정, 변경하는 신경망 아키텍처 탐색 기술"],
        ],
      },
      {
        caption: "현황",
        headers: ["현황", "기업", "설명"],
        rows: [
          ["Cloud AutoML", "Google", "자동 심층 전이 학습과 신경 아키텍처 검색을 구현"],
          ["Azure Machine Learning", "Azure", "피처와 알고리즘 탐색, 하이퍼파라미터 튜닝을 포함"],
          ["Amazon SageMaker", "Amazon", "하이퍼파라미터 튜닝을 수행하지만 자동으로 여러 모델을 시도하거나 특성 엔지니어링 수행을 지양"],
        ],
      },
    ],
    notes: ["구성도: 학습데이터 →수집→ ①피처 엔지니어링 →정규화→ ②하이퍼파라미터 최적화 →미세튜닝→ ③신경망 구조 탐색 → 최적화 알고리즘 → 모델 → 예측"],
  },
  {
    title: "편향",
    course: "AI",
    definition:
      "개인이나 집단의 사전적인 견해, 선입견, 편견, 문화적 영향 등으로 인해 객관성이나 공정성에서 벗어난 경향을 의미",
    defShort: "선입견·편견 등으로 객관성·공정성에서 벗어난 경향",
    keywords: ["인간의 편향", "숨겨진 편향", "데이터 표본 편향", "롱테일 편향", "고의적 편향", "XAI"],
    tables: [
      {
        caption: "유형 [인숨데롱고]",
        headers: ["구분", "편향성 유형", "설명"],
        rows: [
          ["Data 관점", "인간의 편향(Human Bias)", "인공지능이 학습하는 데이터는 인간으로부터 기인. 원시 데이터 자체에 편향이 개입"],
          ["Data 관점", "숨겨진 편향(Hidden Bias)", "가장 발견하기 어려운 편향으로 절대 보거나 발견될 수 없는 의도하지 않은 편향"],
          ["Data 관점", "데이터 표본 편향(Data Sampling Bias)", "AI 시스템에 공급되는 데이터 샘플링 편향에 기인한 편향"],
          ["Process 관점", "롱테일 편향(Long-tail Bias)", "AI 시스템의 훈련 데이터에 특정 범주가 누락될 때 발생하는 편향"],
          ["Process 관점", "고의적 편향(Intentional Bias)", "해킹 공격을 통해 AI가 의도적으로 편향되며, 발견이 어렵게 숨겨지므로 더 위험함"],
        ],
      },
      {
        caption: "해결방안 — XAI",
        headers: ["구분", "설명"],
        rows: [
          ["기존 인공지능", "\"이 그림은 95%의 확률로 고양이입니다\" — 결과만 제시"],
          ["설명 가능한 인공지능(XAI)", "\"털, 수염이 존재하고 ~모양을 가짐. 따라서 이 그림은 95%의 확률로 고양이입니다\" — 결과물이 생성되는 과정을 설명 가능하도록 해주는 기술"],
        ],
      },
    ],
  },
  {
    title: "AI TRiSM(AI Trust, Risk and Security Management)",
    course: "AI",
    definition:
      "AI의 부적절한 사용 방지 위해 가트너에서 제시한 AI 신뢰성, 위험, 보안 관리에 관한 프레임워크",
    defShort: "가트너의 AI 신뢰성·위험·보안 관리 프레임워크",
    keywords: ["AI 악용", "Explainability/Model Monitoring", "ModelOps", "AI Application Security", "Privacy"],
    tables: [
      {
        caption: "구성요소 — 4개 Pillar [익모모응프]",
        headers: ["구분", "설명", "기술요소/도구"],
        rows: [
          ["Explainability/Model Monitoring", "오픈소스나 솔루션을 통한 AI 설명가능성 확보", "SHAP, MS Fairlearn 툴킷"],
          ["ModelOps", "전사 단일소스 제공, AI 거버넌스와 라이프사이클 관리", "지식그래프, 규칙, 최적화"],
          ["AI Application Security", "적대적 AI에 대응하기 위한 모델 강화. 노이즈 데이터에 대한 면역력 확보", "견고성 테스트, 모델 검증 및 개선"],
          ["Privacy", "개인정보 비식별화가 아닌 합성 데이터 또는 허위 데이터 사용", "AI Reverie(레버리)"],
        ],
      },
    ],
    notes: ["개념도 [신위보]: Unmanaged Risks → AI TRiSM(신뢰성·위험·보안 관리) → Managed Risks — 4 Pillar: Explainability/Model Monitoring · Privacy · ModelOps · AI Application Security"],
  },
  {
    title: "딥페이크(Deepfake)",
    course: "AI",
    definition:
      "딥러닝과 Fake의 합성어로 딥러닝을 이용해 기존 영상에 다른 영상이나 이미지 정보를 합성하여 콘텐츠를 생성하는 기법",
    defShort: "딥러닝으로 영상에 다른 이미지를 합성해 콘텐츠를 만드는 기법",
    keywords: ["GAN", "이미지 합성", "역기능"],
    tables: [
      {
        caption: "요소기술",
        headers: ["구분", "과정", "기술 또는 데이터", "설명"],
        rows: [
          ["수집", "이미지, 영상 수집", "이미지 영상, 참고 데이터", "Source와 Target 이미지 및 영상정보 수집"],
          ["생성(GAN활용)", "생성 모델 훈련, 생성 모델 가짜표본 생성", "Autoencoder, GAN, LSTM", "수집 데이터 기반 훈련. 잠재변수 이용하여 가짜 표본(이미지/영상) 생성"],
          ["식별 및 학습 반복", "Real/Fake 구분", "Autoencoder, GAN, LSTM", "식별모델이 Real/Fake 구분하여 생성 모델에 피드백 (반복)"],
          ["딥페이크 생성", "딥페이크 결과 생성", "Fake 데이터, Real 데이터", "딥페이크 결과 완성"],
        ],
      },
      {
        caption: "탐지기술",
        headers: ["구분", "주요 기술"],
        rows: [
          ["인공지능 기반 탐지", "얼굴 특징 분석. 영상 품질 분석. 생체 신호 기반 탐지"],
          ["포렌식 분석", "픽셀 레벨 분석. 메타데이터 분석"],
        ],
      },
      {
        caption: "대응방안",
        headers: ["구분", "대응 방안"],
        rows: [
          ["기술적", "딥페이크 영상 탐지 시스템 구축. 딥페이크 라벨링. 수정불가 워터마크 삽입"],
          ["법적", "딥페이크 관련 법제화. 플랫폼 책임 강화. 국제 협력"],
          ["사회적", "교육과 인식제고. 딥페이크 탐지 도구 공개"],
        ],
      },
    ],
    notes: ["개념도: 실제 이미지→표본 / 잠재 확률 변수→생성 AI→가짜 표본 → 식별 AI(진짜/가짜 판별) → 딥페이크 생성 《GAN》"],
  },
  {
    title: "프롬프트 인젝션(Prompt Injection)",
    course: "AI",
    definition:
      "LLM 모델의 응답을 조작하기 위해, 공격자가 프롬프트에 정교하게 조작된 입력 값을 주입하여 민감 데이터를 유출하는 공격기법",
    defShort: "조작된 입력을 주입해 LLM 응답을 조작·유출시키는 공격",
    keywords: ["LLM 프롬프트", "자연어 명령어", "시스템 명령어", "입력값 조작", "보안 우회", "탈옥", "직접 인젝션", "간접 인젝션", "민감 데이터 유출", "외부소스", "입력값 검증"],
    tables: [
      {
        caption: "공격절차",
        headers: ["구분", "주요동작", "설명"],
        rows: [
          ["LLM 프롬프트", "① 시스템 프롬프트: 정상 명령 / ② 사용자 입력: 악성 데이터 주입", "명령어/데이터 구분 어려움. 정교하게 조작된 입력 값 주입"],
          ["LLM 모델처리", "③ LLM 모델: 새로운 악성 명령 처리", "LLM 모델 보안 경계 우회(탈옥). 직접/간접 인젝션: 공격 범위 큼"],
          ["수행결과", "④ LLM 모델: 의도치 않은 결과 출력", "프롬프트, 데이터, 컨텍스트 탈취. 원격코드 실행, 멀웨어 전송. 잘못된 정보 캠페인"],
        ],
      },
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["직접(Direct) 인젝션", "LLM의 프롬프트에 직접 접근. 정상 프롬프트에 악성 입력값 주입 ⇒ (공격목표) 데이터 오남용, 개인정보 침해"],
          ["간접(Indirect) 인젝션", "LLM의 프롬프트에 외부소스 입력. 외부소스 내 악성 입력값 주입 ⇒ (공격목표) 가용성, 무결성 저해, 개인정보침해, 데이터 오남용"],
        ],
      },
      {
        caption: "공격 대응방안",
        headers: ["대응방안", "설명"],
        rows: [
          ["입력 검증 및 필터링", "정규표현식(Regex) — 입력값 필터링. 화이트/블랙리스트 — 명령어 관리. 프롬프트 캡슐화 — 시스템 명령어 구분. 의미 분석 — 퓨샷러닝, CoT"],
          ["권한 및 접근 제어", "\"최소권한\" 원칙. API 토큰, 권한관리. RBAC, 플러그인 역할지정. 신뢰경계 설정"],
          ["사용자 확인 / 모니터링", "사용자 승인 프로세스. 실시간 모니터링. 감사로그. RLHF 강화학습"],
        ],
      },
    ],
    notes: ["출제 이력 관련: OWASP LLM Top 10 1위 항목"],
  },
  {
    title: "인공지능 적대적 공격",
    course: "AI",
    definition:
      "딥러닝의 심층신경망을 이용한 모델에 적대적 교란(Adversarial Perturbation)을 적용하여 오분류 발생시키는 공격기술",
    defShort: "적대적 교란으로 신경망 모델의 오분류를 일으키는 공격",
    keywords: ["Poisoning", "Evasion", "Inversion", "Model extraction"],
    tables: [
      {
        caption: "공격 기법 [오회전추]",
        headers: ["공격 기법", "설명", "사례"],
        rows: [
          ["Poisoning attack(중독공격, 오염공격)", "의도적으로 악의적인 학습 데이터 주입해 머신러닝 모델 손상시키는 공격. 모델 자체를 공격", "MS사 인공지능 채팅봇 '테이', 스캐터랩 '이루다', 의료 기계 대상 연구 결과에서 대상 장비 오작동 발생"],
          ["Evasion attack(회피공격)", "입력 데이터에 최소한의 변조 가해 머신러닝 속이는 기법", "도로 교통 표지판에 이미지 스티커 부착해 자율주행차가 '정지' 표시를 '속도제한' 표시로 오인식"],
          ["Inversion attack(학습 데이터 전도 공격)", "머신러닝 모델에 다량 쿼리 던진 후, 산출된 결과값 분석해 모델 학습에 사용된 데이터 추출하는 공격", "얼굴인식 머신러닝 모델 학습 위해 사용한 얼굴 이미지 데이터 복원 가능"],
          ["Model extraction attack(모델 추출 공격)", "머신러닝 모델 추출 공격. 머신러닝 모델에 쿼리 계속 던지면서 결과값 분석하는 방식의 공격", "70초 동안 650번 쿼리만으로도 아마존 머신러닝 모델과 유사 모델 생성 가능하다는 연구 결과 발표"],
        ],
      },
      {
        caption: "방어 기법 [적갠쿼결탐]",
        headers: ["방어 기법", "설명"],
        rows: [
          ["적대적 훈련(Adversarial training)", "머신러닝 훈련 단계에서 예상 가능한 해킹된 데이터 충분히 입력해 머신러닝의 저항성 기르는 방식"],
          ["Defense-GAN", "적대적 생성 신경망(GAN) 알고리즘 이용하여 적대적 공격 방어"],
          ["쿼리 횟수 제한", "모델에 반복적 쿼리 시도하는 Inversion attack이나 Model extraction attack 방어"],
          ["결과값 분석 차단", "학습모델 결과값 분석 통해 모델 추론하는 공격 차단 위해, 학습모델 결과값이 노출되지 않도록 하거나, 결과값 분석할 수 없게 변환하는 방식으로 공격 차단"],
          ["적대적 공격 여부 탐지", "원래 모델과 별도로 적대적 공격 여부 판단 위한 모델 추가한 후, 두 모델의 추론 결과 비교해 두 결과 간에 큰 차이 발생하는 경우 적대적 공격으로 탐지"],
        ],
      },
    ],
    notes: ["공격 지점: Get Data(Poisoning — 기밀성 Model Invasion) → Train Model(Poisoning·Evasion) → Model Testing → Deploy Model(Model Extraction — 무결성)"],
  },
  {
    title: "모델 드리프트(Model Drift) — 컨셉 드리프트 & 데이터 드리프트",
    course: "AI",
    definition:
      "고객, 환경, 상품, 산업 등등 변화는 끊임없이 변화하는 환경에 따라 모델의 성능이 저하되는 현상",
    defShort: "환경 변화로 배포된 모델의 성능이 저하되는 현상",
    keywords: ["데이터와 라벨의 관계성 변화", "입력데이터의 분포 변화"],
    tables: [
      {
        caption: "컨셉 드리프트와 데이터 드리프트 비교",
        headers: ["비교 항목", "컨셉 드리프트", "데이터 드리프트"],
        rows: [
          ["원인(현상)", "입력 데이터로부터 예측하려고 하는 정답 라벨의 관계성이 모델 훈련때와 비교하여 변경되어 모델의 예측 성능이 저하되는 현상", "모델의 훈련 시 입력 데이터의 통계적 분포와 배포 환경에서 입력 데이터의 통계적 분포 차이로 인한 편향으로 모델의 예측 성능이 저하되는 현상"],
          ["원인(본질)", "정답라벨의 개념 변화 (데이터와 라벨의 관계성 변화)", "훈련과 배포환경의 입력데이터 분포 변화 (입력데이터의 분포 변화)"],
          ["사례", "금융사기 예측모델에서 금융사기의 정의가 바뀐 경우", "계절성에 따라 여름에 효과 있는 모델이 겨울에는 성능이 저하되는 경우"],
          ["해결방안", "Online Learning, Feature dropping", "드리프트 모니터링, 모델의 재학습·재배포"],
        ],
      },
    ],
    notes: ["개념도: 컨셉 드리프트 — 클래스 경계(Margin)가 이동해 Class 0/1 관계가 변함 / 데이터 드리프트 — 훈련환경 분포 대비 배포환경(반년후) 입력데이터 분포가 이동해 성능감소"],
  },
  {
    title: "AI 레드팀(Red team) 테스트",
    course: "AI",
    definition:
      "AI 모델 또는 시스템의 잠재적인 취약점, 편향, 사회적 해악, 보안 문제 등을 식별하기 위해 의도적으로 다양한 공격을 시도하고 한계를 시험하는 적대적인 탐색적 테스팅 방법",
    defShort: "의도적 공격으로 AI의 취약점·편향을 찾는 적대적 테스트",
    keywords: ["의도", "비결정성", "탐색적 테스트", "잠재 위협"],
    tables: [
      {
        caption: "상세설명 — 팀",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["팀 구성", "10명 ~ 100명 이상", "테스트 규모와 목표에 따라 결정, 대부분 수십 명 구성"],
          ["팀 구성", "기술, 윤리, 법, 도메인 전문가, 유저 등 포함", "사회 문화적 해악 테스트 위해 다양한 구성원 구성. 거버넌스 프레임워크 구성 도구"],
          ["팀 유형", "내부/외부 레드팀, 클라우드 소싱 레드팀, 전문가/유저 중심 레드팀, 전문가/유저 혼합 레드팀", "기업/기관 내부 또는 외부의 팀 구성 / 클라우드 통한 대규모 모집 / 전문가 집단 또는 유저 중심으로 구성 / 전문가와 유저를 혼합하여 대규모 수행"],
          ["팀 역할", "잠재 위협 노출, 편향·유해성 검출, 공격 시나리오 도출, 보안 취약점 발견", "잠재된 위협을 탐색적 테스팅으로 노출 시킴 / 데이터의 편향, 결과 편향, 모델의 유해 결과 출력 유도 / 모델 공격 위한 시나리오 설계, 전략 도출 / 데이터 유출, 시스템 접근 취약점 발견"],
        ],
      },
      {
        caption: "테스트 기법과 절차",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["모델 테스트 기법", "프롬프트 인젝션", "프롬프트에 악의적 내용 주입"],
          ["모델 테스트 기법", "탈옥 공격, 적대적 입력", "모델 안전장치 우회, 차단된 응답 도출, 모델 교란 공격"],
          ["모델 테스트 기법", "편향, 유해성 유도 공격", "인종 등 민감 주제 반복 및 욕설 등 필터링 해제"],
          ["모델 테스트 기법", "Agent 오동작 유도", "프롬프트 교란 통한 Agent 교란, 금지된 작업 수행 지시"],
          ["모델 테스트 기법", "데이터 포이즈닝", "악의적 조작된 데이터 주입 모델 오동작 유도"],
          ["시스템 테스트 기법", "데이터 유출, 권한 탈취", "개인정보 유출, 민감 데이터 유출"],
          ["시스템 테스트 기법", "가드레일 무력화", "안전 필터, 정책 엔진, 외부 차단 시스템 우회 경로 파악"],
          ["시스템 테스트 기법", "보안 경계 테스트", "허용된 입력-출력, 접근 통제가 정상 작동하는지 확인"],
          ["시스템 테스트 기법", "공격 대응 능력 테스트", "보안 장비, 솔루션의 탐지, 차단, 복구 대응 능력 테스트"],
          ["테스트 절차", "1) 범위·환경 정의 2) 레드팀 구성 3) 레드팀 공격 테스트 4) 블루팀 방어/분석 5) 리포트/대책 마련", "테스트 범위·접근 권한·목표 설정 → 전문가·유저 모집 → 공격 시나리오 설계·실행 → 실시간 방어/차단 설계 및 결과 분석 → 리포트 발행 및 취약점 대응 방안, 테스트 강화 방안 마련"],
          ["산출물", "취약점 리포트·위협 카탈로그 / 신규 가드레일·필터링 규칙·보안 대응 방안 / 신규 평가지표·테스트 케이스", "모델·시스템의 취약점 리포트, 발견된 위협과 공격기법 분류/정리 카탈로그화 / 발견된 취약점에 따른 신규 가드레일 적용, 기술적/관리적 개선책 / 안전성·윤리 평가 지표 생성, 반복 노출 위험에 대한 테스트 케이스 개발"],
        ],
      },
    ],
    notes: ["개념도: 레드팀(프롬프트 인젝션·탈옥·데이터 유출·편향 유도·적대적 입력 공격) → AI 시스템 ← 블루팀(분석) → 취약점 리포트/리스크 카탈로그, 신규 가드레일/필터링 규칙, 신규 평가지표/테스트 기법", "출제 이력: 2025.10 ITPE 모의고사 1교시"],
  },
  {
    title: "AI 시스템 테스트",
    course: "AI",
    definition:
      "휴리스틱으로 이루어진 AI 모델 특성상 테스트 오라클 부재를 해결하기 위한 테스트",
    defShort: "테스트 오라클 부재를 해결하기 위한 AI 모델 테스트",
    keywords: ["블랙박스 테스팅", "신경망 화이트박스 테스팅"],
    tables: [
      {
        caption: "블랙박스 테스팅 [변액(A)백조]",
        headers: ["테스트 기법", "설명"],
        rows: [
          ["조합 테스팅", "대부분의 결함이 2개 이상 요소의 상호 작용에 기인한다는 것에 착안, 입력 값을 조합한 하위 세트를 도출하여 테스트"],
          ["백투백(Back-to-Back) 테스팅", "변형된 둘 이상의 대상(컴포넌트, 모델)에 대해 동일한 테스트 케이스를 실행하고 결과를 비교하여 테스트가 수행된 모델을 비교하는 테스트"],
          ["A/B 테스팅", "변형된 둘 이상의 대상을 테스터에게 노출시켜 어떤 변형이 더 선호(더 좋은 성능)하는지 결정하는 테스트"],
          ["변성 테스팅(Metamorphic Testing)", "입력/출력 값 사이에 존재하는 메타모픽 관계를 이용해, 원 입/출력 값이 주어졌을 때 이후 새로운 입력 값 및 그에 대한 출력 값을 예측하는 테스팅 기법"],
        ],
      },
      {
        caption: "신경망 화이트박스 테스팅 [뉴임부값뿌레안]",
        headers: ["커버리지 종류", "설명"],
        rows: [
          ["뉴런 커버리지(Neuron Coverage)", "활성화된 뉴런을 신경망의 총 뉴런 수로 나눈 비율. 활성값이 0을 초과하면 뉴런이 활성화된 것으로 간주"],
          ["임계점 커버리지(Threshold Coverage)", "임계 활성값을 초과하는 뉴런을 신경망의 총 뉴런 수로 나눈 비율(0~1 사이 임계 활성화 값을 선택하고 이를 초과)"],
          ["부호 변경 커버리지(Sign Change Coverage)", "양 또는 음의 활성값을 가진 활성 뉴런을 신경망의 총 뉴런 수로 나눈 비율(0은 음의 활성 값으로 간주)"],
          ["값 변경 커버리지(Value Change Coverage)", "정해진 범위보다 활성값이 더 많이 바뀐 활성 뉴런 수를 신경망의 총 뉴런수로 나눈 비율"],
          ["부호-부호 커버리지(Sign-Sign Coverage)", "뉴런들이 주로 다음 레이어에서 같은 상태를 유지하는 동안 각 뉴런이 부호를 변경하는 경우의 비율"],
          ["레이어 커버리지(Layer Coverage)", "신경망의 전체 층에서 뉴런 세트에 대한 활성값이 어떻게 변경되는지에 기반한 커버리지"],
          ["안전 변경 최대화 테스트", "입력 공간에서 모델이 안정적으로 작동하는 영역을 확인하는 테스트 기법"],
        ],
      },
    ],
  },
  {
    title: "파운데이션 모델(Foundation Model)",
    course: "AI",
    definition:
      "대규모 데이터셋을 사용해 사전에 학습을 하여 다른 서비스나 분야로 사용되기 위한 다목적 모델",
    defShort: "대규모 사전 학습 후 다분야에 적응시켜 쓰는 다목적 모델",
    keywords: ["자기지도학습", "adaptation", "기반모델", "창발성", "균일화", "FMOps"],
    tables: [
      {
        caption: "특징 [창균전]",
        headers: ["특징", "설명"],
        rows: [
          ["창발성(emergence)", "모델이 스스로 어떠한 문제를 해결하기 위한 지식을 도출하는 능력"],
          ["균일화(homogenization)", "모델이 적용 될 수 있는 범위가 점차 확대되며 범용적으로 활용되는 현상"],
          ["전이학습(Transfer Learning)", "미리 학습된 가중치를 가지고 있어 전이학습으로 데이터 부족 문제 완화"],
        ],
      },
      {
        caption: "기반기술",
        headers: ["구분", "기반 기술"],
        rows: [
          ["구현기술", "대용량 학습데이터 구축. 자기지도학습. 트랜스포머 아키텍처. 컴퓨팅 성능"],
          ["최적화", "지식 증류. Pruning 모델구조 변경. 양자화. Sparsity"],
        ],
      },
      {
        caption: "FMOps(Foundation Model Operations)",
        headers: ["구분", "내용"],
        rows: [
          ["흐름", "기반모델 → Iteration → 테스트 → 최적화 → 모니터링 → 배포"],
          ["방법론", "프롬프트 엔지니어링, 프롬프트 체이닝, 프롬프트 모니터링, 기반모델 파인 튜닝 등 단계별 기법으로 개발 및 운용하는 방법론"],
        ],
      },
    ],
    notes: ["개념도: Data(Text·Images·Speech·Structured Data·3D Signals) →Training→ Foundation Model →Adaptation→ Tasks(질의응답·감성분석·정보추출·이미지 캡셔닝·객체 인식·지시 수행)"],
  },
  {
    title: "멀티모달(Multimodal) AI",
    course: "AI",
    definition:
      "이미지, 텍스트, 음성, 비디오 등 다양한 모달리티(Modality)를 동시에 받아들이고 사고하는 AI 모델",
    defShort: "이미지·텍스트·음성 등 여러 모달리티를 동시 처리하는 AI",
    keywords: ["모달리티", "다양한 감각 기관", "지식/언어지능", "음성/청각", "이미지/시각", "추론/기계학습"],
    tables: [
      {
        caption: "요소기술",
        headers: ["처리기술", "요소기술", "설명"],
        rows: [
          ["지식/언어지능", "NLP, NLU, NLG, Word Embedding, Seq2Seq", "단어 분리, 단어의 유형 라벨링, 키워드 검색, 유의어, 반의어, 정보의 분석 및 추출, 관계 추출, 일반언어 이해"],
          ["음성/청각", "STT(Speech-To-Text), Signal Processing", "언어 모델, 음성 머신러닝 모델을 구축, hot word 자동 인식, 노이즈 필터링"],
          ["이미지/시각", "Image Scaling, Filtering, Morphology", "세분화, 이미지 이해, 얼굴 인식, 연령 및 성별 인식, 글자 인식, 이미지 기반 검색, 이미지 기반 예측 분석"],
          ["추론/기계학습", "회귀분석, 시계열분석, 클러스터링, 연관분석", "빅데이터 수집 및 처리, KPI 예측, 빅데이터 기반 예측 분석, 머신러닝을 위한 자동 데이터 생성"],
        ],
      },
    ],
    notes: ["모델 구조: Unimodal AI(단일 입력 → 제한된 출력) vs Multimodal AI(이미지+영상+문서 동시 입력 → 더 넓은 범위의 결과)"],
  },
  {
    title: "범용 인공지능 위험관리 프레임워크",
    course: "AI",
    definition:
      "범용 인공지능(AGI)의 개발과 활용 과정에서 발생할 수 있는 다양한 위험 요소를 사전에 식별하고, 이를 체계적으로 관리하기 위한 종합적이고 선제적인 지침 체계",
    defShort: "AGI 위험을 식별·분석·평가·대응하는 선제적 지침 체계",
    keywords: ["위험 식별", "분석", "평가 대응", "위험 프로필", "3D 위험 매트릭스"],
    tables: [
      {
        caption: "'3Ps' [인목가]",
        headers: ["원칙", "설명"],
        rows: [
          ["인류 우선성(Primacy of Humanity)", "인간의 권리·자율성을 우선하며 최종 결정은 인간이 내리도록 해야 함"],
          ["목표 지속성(Persistence of Goal)", "예상치 못한 기능이 생겨도 본래 목적과 부합해야 함"],
          ["가치 보존성(Preservation of Value)", "글로벌 사회·윤리·법적·문화적 가치를 지켜야 함"],
        ],
      },
      {
        caption: "위험관리 절차",
        headers: ["구성요소", "세부 내용", "설명"],
        rows: [
          ["위험 식별(Risk Identification)", "Known risks 인식, Unknown risks 발굴, 위험 프로필 작성", "알려진 위험과 알려지지 않은 위험을 모두 체계적으로 찾아내어 위험 목록을 작성함"],
          ["위험 분석(Risk Analysis)", "위험 원천 분석, 위험 지속성·의도성·영향 범위 평가, 위험 분석 체계 적용", "위험이 발생하는 근본 원인을 파악하고 위험의 속성을 다각도로 분석하여 심층 이해를 도출함"],
          ["위험 평가(Risk Evaluation)", "위험 점수 부여(Risk Scoring), 3D 위험 매트릭스 적용, 위험 등급화 및 우선순위 설정", "위험 요소의 심각성과 발생 가능성을 정량화하여 4단계(Catastrophic, Major, Moderate, Minor)로 구분하고 대응 우선순위를 정함"],
          ["위험 대응(Risk Treatment)", "제거(Elimination), 완화(Mitigation), 모니터링(Monitoring), 수용(Acceptance)", "위험 수준에 따라 제거, 감소, 감시, 수용 등의 전략을 수립 및 실행함. 위험 대응은 지속적인 피드백 루프를 통해 갱신됨"],
        ],
      },
    ],
    notes: ["개념도: GPAI Risk Management Framework — Identify(Discover·Profile·Recognise) → Analyse(Understand·Classify·Interpret) → Evaluate(Score·Grade·Prioritise) → Treat(Accept·Mitigate) + Monitoring·Review·Reporting 순환", "출제 이력: 2025.06 KPC 모의고사 2교시, 136회 정보관리 1교시, 2025.05 ITPE FR 1일차 1교시"],
  },
  {
    title: "AI Agent",
    course: "AI",
    definition:
      "환경과 상호 작용하여 데이터 수집하고, 데이터를 사용하여 사전 결정된 목표를 달성하기 위해 필요한 작업을 스스로 결정해서 수행할 수 있는 자율 시스템",
    defShort: "목표 달성 작업을 스스로 결정하고 수행하는 자율 시스템",
    keywords: ["인식(Perception)", "추론(Reasoning)", "행동(Action)", "학습(Learning)"],
    tables: [
      {
        caption: "기술요소 및 유형",
        headers: ["구분", "세부항목", "설명"],
        rows: [
          ["기술요소", "Sensor", "환경으로부터 데이터를 수집하는 인터페이스. 카메라, 마이크, 웹 검색 기능 등이 포함됨"],
          ["기술요소", "Process", "수집된 데이터를 처리하고 의사결정을 수행"],
          ["기술요소", "Knowledge Base", "AI Agent가 보유한 정보와 경험을 저장"],
          ["기술요소", "Actuator", "Process와 Knowledge Base 바탕으로 결정한 행동을 실행하는 구성요소"],
          ["기술요소", "학습 알고리즘", "과거 경험 기반 학습 알고리즘"],
          ["기술요소", "엣지 컴퓨팅", "엣지 컴퓨팅 이용하여 Tiny ML 수행"],
          ["유형", "단순 반사 에이전트", "과거 경험 고려하지 않고 사전 정의된 규칙 기반으로 동작"],
          ["유형", "모델 기반 에이전트", "과거 경험 활용하여 의사결정"],
          ["유형", "목표 기반 에이전트", "구체적 목표 달성하기 위해 최적의 행동 선택"],
          ["유형", "유틸리티 기반 에이전트", "행동의 효용성을 계산하여 의사결정"],
        ],
      },
    ],
    notes: ["개념도: Environment →Perception→ Sensor → Process ↔ Knowledge Base → Actuator →Action→ Environment", "발전: AI Agent(Automate simple task) + 강화/지도/비지도 학습 → Agentic AI(Make autonomous decision)"],
  },
  {
    title: "A2A(Agent2Agent) 프로토콜",
    course: "AI",
    definition:
      "에이전트에 유용한 도구와 컨텍스트를 제공하는 MCP를 보완하여 AI 에이전트가 다양한 엔터프라이즈 플랫폼이나 애플리케이션에서 서로 통신하고 안전하게 정보는 교환할 수 있는 개방형 프로토콜",
    defShort: "AI 에이전트 간 통신·정보 교환을 위한 개방형 프로토콜",
    keywords: ["자율", "분산", "통신", "경쟁/협력", "전문화", "적응성", "Crew AI", "Expert Agent", "강화학습"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["설계 원칙", "에이전트 능력수용", "메모리, 도구, 컨텍스트를 공유 없이 협업 지원"],
          ["설계 원칙", "기존 표준 기반", "HTTP, SSE, JSON-RPC 등 기존 표준 이용"],
          ["설계 원칙", "보안 보장", "OpenAPI 인증체계와 동등한 수준의 엔터프라이즈 인증"],
          ["설계 원칙", "장기 실행 작업 지원", "사용자 실시간 피드백, 알림 및 상태 업데이트 제공"],
          ["주요 기능", "모달리티 지원", "오디오 및 비디오 스트리밍 등 모달리티 지원"],
          ["주요 기능", "기능 검색", "JSON 형식의 에이전트 카드 사용, 자신의 기능 공유"],
          ["주요 기능", "작업 관리", "에이전트 간 통신에서 작업 완료 지향"],
          ["주요 기능", "협업", "에이전트 간 컨텍스트, 답변, 아티팩트, 사용자 지시사항 전달"],
          ["주요 기능", "사용자 경험 협상", "'파트'로 지정된 컨텐츠 유형 관리 및 UI 기능 명시"],
        ],
      },
    ],
    notes: ["MCP/A2A 상호 보완적 관계: 에이전트 내부는 MCP로 도구·API 연결, 에이전트끼리는 A2A protocol로 통신(조직·기술 경계를 넘어)", "개념도: User → Host Agent → Remote Agent(A2A Client) ⇄ A2A ⇄ A2A Server(LangGraph·Google ADK·Crew AI Agent)", "출제 이력: 2025.07 KPC 모의고사 1교시"],
  },
  {
    title: "바이브코딩(Vibe Coding)",
    course: "AI",
    definition:
      "대규모 언어 모델(LLM)을 활용하여 사용자의 자연어 지시를 기반으로 코드를 생성하고, 개발자는 이를 검토 및 조정하여 소프트웨어를 개발하는 코딩 기법",
    defShort: "LLM에 자연어로 지시해 코드를 생성·검토하는 코딩 기법",
    keywords: ["LLM", "자연어 처리", "소스코드 생성"],
    tables: [
      {
        caption: "바이브코딩 도구",
        headers: ["구분", "도구", "설명"],
        rows: [
          ["기반 기술", "LLM(GPT, Claude 등)", "사용자의 자연어 명령을 이해하고 프로그래밍 언어로 변환하는 핵심 엔진"],
          ["기반 기술", "명령어 의도 파악", "사용자의 요구사항을 분석하여 코딩 목적을 추론"],
          ["기반 기술", "자연어 ↔ 코드 전환 UI", "사용자 입력을 실시간 코드로 시각화"],
          ["SW측면 도구", "Cursor", "자연어로 원하는 기능을 설명하면 AI가 자동으로 코드를 제안하며 코드 설명, 리팩토링, 디버깅까지 지원"],
          ["SW측면 도구", "Replit Ghostwriter", "웹 기반 코딩 플랫폼으로 브라우저에서 바로 vibe코딩 가능"],
          ["SW측면 도구", "GitHub Copilot", "JS, Python, React 등 거의 모든 언어에서 코드 자동 완성"],
          ["SW측면 도구", "Framer AI", "노코드 웹 빌더"],
          ["SW측면 도구", "FlutterFlow", "복잡한 UI/UX를 드래그앤드롭으로 설계"],
        ],
      },
      {
        caption: "장단점",
        headers: ["구분", "내용"],
        rows: [
          ["장점", "자연어 기반 개발, 대화형 코드 생성, 프로토타이핑, 사용자 주도"],
          ["단점", "AI 의존성, 생성된 코드 최적화 문제"],
        ],
      },
    ],
    notes: ["개념도: 아이디어 →자연어→ AI(Cursor·Replit Ghostwriter) →생성→ 코드 → 검토 및 조정(반복)", "Agentic Workflow 검증, Human in the loop: 사람이 시스템의 의사결정 과정에 개입하고 통제하는 방식 — AI 판단의 신뢰성·품질 확보, 윤리적·법적 책임 보장, 위험/오류 감소", "출제 이력: 2025.06 KPC 모의고사 4교시, 2025.06 ITPE 모의고사 1교시, 2025.04 KPC 모의고사 1교시"],
  },
  {
    title: "MCP(Model Context Protocol)",
    course: "AI",
    definition:
      "LLM 애플리케이션과 외부 데이터 소스 및 도구들 간의 원활한 통합을 가능하게 하는 개방형 프로토콜",
    defShort: "LLM 앱과 외부 데이터·도구를 통합하는 개방형 프로토콜",
    keywords: ["맥락", "프로토콜", "통합", "JSON-RPC 요청"],
    tables: [
      {
        caption: "목적",
        headers: ["목적", "설명"],
        rows: [
          ["컨텍스트 공유 표준화", "LLM 애플리케이션과 데이터 소스 간의 상호작용을 위한 표준 프로토콜 제공하여 일관된 데이터 접근 보장"],
          ["도구와 기능 노출", "AI 시스템에 로컬 또는 원격 도구들을 안전하게 노출. 표준화된 방식으로 기능을 정의하고 호출"],
          ["통합 워크플로우", "여러 데이터 소스와 도구를 조합한 워크플로우 생성. 재사용 가능한 프롬프트 템플릿 제공, 모듈화, 확장성"],
        ],
      },
      {
        caption: "동작절차 [초기모도응전]",
        headers: ["절차", "설명"],
        rows: [
          ["초기화", "MCP Client가 서버에 연결을 시작해 초기화 메시지 전송"],
          ["기능 협상 및 발견", "세션 연결 시, 서버가 어떤 맥락 기능들(리소스/도구/프롬프트 등)을 제공하는지 조회 (JSON-PRC 요청)"],
          ["모델의 요청 처리", "사용자가 AI 호스트 어플리케이션에 질문을 하면 AI 모델에게 질문을 전달, 이때 사용할 도구를 판단(내부 / 외부)"],
          ["도구호출요청", "Host의 MCP Client가 개입해 해당 도구 호출을 실제 수행. MCP 응답 결과로 모델 응답을 생성"],
          ["모델응답생성", "MCP 서버로부터 필요한 외부 데이터나 실행 결과를 받은 AI 모델은 이제 사용자에게 줄 최종 답변을 생성. MCP로부터 얻은 맥락 정보가 답변 내용에 반영"],
          ["응답전달", "호스트 애플리케이션은 모델이 생성한 답변을 출력"],
        ],
      },
      {
        caption: "개념도 구성요소 [호클서]",
        headers: ["구성요소", "설명"],
        rows: [
          ["MCP Host", "LLM 기반 애플리케이션으로 여러 MCP 서버와 동시 연결 하고 전체 흐름을 조율. UI 제공 및 보안, 권한 관리"],
          ["MCP Client", "MCP 서버와 1:1 연결을 담당하는 컴포넌트. 메시지 직렬화/역직렬화 처리, 상태관리"],
          ["MCP 서버", "외부 데이터나 기능을 제공. 모델이 이해할 수 있는 형태로 맥락을 제공"],
        ],
      },
      {
        caption: "맥락 [리툴프]",
        headers: ["요소", "설명"],
        rows: [
          ["Resources", "모델이 참고할 읽기 전용 데이터"],
          ["Tools", "모델이 호출할 수 있는 기능 또는 함수"],
          ["Prompts", "모델에게 특정 지시나 템플릿을 제공하는 문구"],
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
    defShort: "MCP 연동 구조의 보안위협과 인증·실행·서버 측 대응방안",
    keywords: ["Tool Poisoning", "Rug Pulls", "Cross-Server Attacks", "프롬프트 인젝션", "토큰 바인딩", "최소권한"],
    tables: [
      {
        caption: "보안취약점",
        headers: ["구분", "보안위협", "설명"],
        rows: [
          ["MCP Tool 측면", "Tool Poisoning(툴 중독공격)", "공격자가 MCP 도구 설명에 악성 코드를 숨겨 넣고, AI가 이를 실행하도록 유도함"],
          ["MCP Tool 측면", "Hidden Risks(숨겨진 명령어)", "사용자에게는 무해한 도구처럼 보이지만, 실제로는 숨겨진 명령어를 AI가 실행함"],
          ["MCP Tool 측면", "Rug Pulls(가짜 업데이트)", "설치 이후, 도구가 악의적으로 수정되어 정보 유출 등의 악성 행위를 수행함"],
          ["MCP 연동 구조 측면", "Cross-Server Attacks(신뢰된 도구 하이재킹)", "악성 서버가 정상적인 MCP 서버의 도구를 덮어쓰거나 가로채는 공격 수행"],
          ["MCP 연동 구조 측면", "취약한 보호체계", "사용자가 보안 인식이 부족하거나, 도구변경에 대한 검증 부족"],
          ["MCP 연동 구조 측면", "엔드포인트 보안", "사용자의 기기 보안 취약"],
          ["MCP Server 측면", "프롬프트 인젝션", "악성 명령이 포함된 입력으로 오작동 유도"],
          ["MCP Server 측면", "민감 데이터 유출", "다양한 앱과 도구가 연동되면서 데이터 노출 가능성 증가"],
          ["MCP Client 측면", "인증 미흡", "토큰 유출 시, 인증 우회 및 세션 탈취"],
          ["MCP Client 측면", "무분별한 설치", "신뢰되지 않은 SW 무작위 설치로 인한 위협 증가"],
        ],
      },
      {
        caption: "대응방안 — 인증 및 실행",
        headers: ["취약점", "대응방안", "설명"],
        rows: [
          ["인증/인가", "토큰 바인딩", "전 구간 HTTPS, OAuth 2.1 + PKCE(S256) 강제, RFC 8707(resource)로 토큰을 리소스 바인딩"],
          ["인증/인가", "세션 바인딩·로컬 소켓 활용", "세션을 인증수단으로 사용 금지, 고엔트로피·주기 회전, 사용자ID와 세션 바인딩, TLS/mTLS·로컬소켓 활용"],
          ["실행", "사용자 확인", "프롬프트는 불신 입력으로 취급(정적검사·금지어 룰), 민감행위 HITL(사용자 확인), 레이트리밋·출처 고정"],
          ["실행", "최소권한 승인", "최소권한 스코프, 중요 툴 화이트리스트·시간제(JIT) 권한, 변경 시 보안 승인"],
          ["실행", "시스템 로컬 실행", "컨테이너/샌드박스 격리, 인자 화이트리스트 검증, 파일/네트워크 egress 최소화, 비특권 실행, 이미지 서명/스캔"],
        ],
      },
      {
        caption: "대응방안 — 서버 & 클라이언트",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["MCP Server 측면", "서버 간 격리", "한 서버에서 도구가 손상되어도, 다른 서버나 도구에 영향을 주지 않도록 격리 설정 유지"],
          ["MCP Server 측면", "실행 전 투명성 보장", "사용자가 요청한 도구 실행 직전에, 실제로 수행될 명령어와 동작을 구체적 수준까지 검토"],
          ["MCP Server 측면", "권한 최소화", "도구 실행에 필요한 데이터, 파일, 시스템 접근 권한은 최소한의 범위로 설정"],
          ["MCP Client 측면", "도구 업데이트 모니터링", "도구의 변경 여부를 주기적으로 검사하여 비인가된 수정이나 악성 코드 삽입을 탐지"],
          ["MCP Client 측면", "로그 기록 및 감사", "도구 사용 기록을 남기고, 이상 징후나 비정상적 행동을 감지할 수 있도록 감사 체계 유지"],
          ["MCP Client 측면", "사용자 교육", "내부 사용자 및 운영자를 대상으로 MCP 위험성과 안전한 사용법에 대한 교육 실시"],
        ],
      },
    ],
    notes: ["출제 이력: 137회 정보관리 2교시, 2025.07 ITPE 모의고사 4교시"],
  },
  {
    title: "합성 데이터(Synthetic Data)",
    course: "AI",
    definition:
      "통계적 방법 등을 이용하여 추정된 모형에서 새롭게 생성되어 실제 데이터와 통계 속성이 동일한 모의 데이터",
    defShort: "실제와 통계 속성이 동일하게 모형에서 생성한 모의 데이터",
    keywords: ["통계적 속성", "모의 데이터", "완전합성", "부분합성", "복합합성", "전통적 통계 또는 베이지안", "기계학습 모형", "차등정보보호"],
    tables: [
      {
        caption: "종류 [완부복]",
        headers: ["종류", "특징", "설명"],
        rows: [
          ["완전 합성 데이터", "가상 생성 데이터", "실제 데이터가 하나도 없이 모두 가상 생성. 정보보호측면에서 가장 강력한 보안성 가짐"],
          ["부분 합성 데이터", "일부 변수만 대체", "일부 속성·변수를 선택하여 합성 데이터로 대체. 민감한 정보에 관한 변수를 합성 데이터로 대치"],
          ["복합 합성 데이터", "변수 대체 후 추가 대체 변수도출", "일부 변수들의 값을 합성 데이터로 생성하고, 실제 데이터와 같이 이용하여 값을 다시 도출"],
        ],
      },
      {
        caption: "생성방법 [가신베 변간확]",
        headers: ["구분", "기법"],
        rows: [
          ["통계기반", "가우스 혼합 모델, synthpop-CART, 베이지안 네트워크"],
          ["AI기반", "변분 오토인코드(VAE), GANs, 확산 모델(Diffusion Model)"],
        ],
      },
      {
        caption: "유용성 안전성 검증방안 [모V이 일2구모 생구지주 구연추]",
        headers: ["구분", "데이터 유형", "검증지표"],
        rows: [
          ["유용성", "비정형 합성데이터", "모델 성능, Visual Turing Test, 이미지 품질"],
          ["유용성", "정형 합성데이터", "일차원 분포 유사성, 2차원 관계 유사성. 구별 불가능성, 모형성능 유사성"],
          ["안전성", "비정형 합성데이터", "생성절차평가, 구조적 유사성, 지각적 유사성, 주관적 평가"],
          ["안전성", "정형 합성데이터", "구별 위험도, 연결 위험도, 추론 위험도"],
        ],
      },
      {
        caption: "생성 과정 [사생안유심활]",
        headers: ["단계", "세부 활동"],
        rows: [
          ["사전준비", "①합성데이터 활용목적 및 활용범위 설정 ②합성데이터 생성·활용 주체 설정 ③원본데이터 이해 및 생성계획 마련 ④원본데이터 확보"],
          ["합성데이터 생성", "①원본데이터 탐색적 분석 ②원본데이터 전처리 ③합성데이터 생성 ④합성데이터 후처리"],
          ["안전성 및 유용성 검증", "①측정지표 결정 ②지표별 임계값 산출 ③안전성 및 유용성 측정 ④검토 및 후처리"],
          ["심의위원회 평가", "내외부 전문가 평가"],
          ["활용 및 안전한 관리", "①활용 ②안전한 관리"],
        ],
      },
      {
        caption: "합성 데이터 참조모델",
        headers: ["분야", "합성데이터셋", "유형", "규모", "활용 목적"],
        rows: [
          ["보건의료", "구강 이미지", "비정형", "1,000장", "충치진단·예방 AI 솔루션 개발"],
          ["공공안전", "안전모 착용 이미지", "비정형", "5,500장", "안전모 착용 감지 AI 솔루션 개발"],
          ["보건의료", "혈당 측정정보", "정형", "723건", "IoT 헬스케어기기 캘리브레이션(보정)"],
          ["유통", "통신사 멤버십 사용내역", "정형", "102,503건", "통신사 멤버십앱 제휴사 선호도 분석"],
          ["금융", "기업주주·대표자 정보", "정형", "1,860건", "대인신용평가 모델 개발"],
        ],
      },
    ],
  },
  {
    title: "소버린 AI(Artificial Intelligence)",
    course: "AI",
    definition:
      "자체 인프라, 데이터, 인력 및 비즈니스 네트워크를 사용하여 AI를 구축하는 국가의 역량과 데이터 주권과 규제 준수를 보장하기 위해 개발된 AI 기술",
    defShort: "자체 인프라·데이터로 구축하는 데이터 주권 보장 AI",
    keywords: ["데이터주권", "자체 인프라", "독립적 운영", "대규모 AI 인프라"],
    tables: [
      {
        caption: "기술요소",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["데이터", "데이터 저장 및 관리 기술, 데이터 보안 기술, 데이터 주권 보호 기술", "자국 내의 데이터를 자체 클라우드, 데이터 센터에 저장하며 암호화, 접근 제어를 통한 보안 강화. 데이터 국경 관리, 로컬 데이터 처리를 위한 기술 및 법적 조치"],
          ["학습 및 배포", "분산 학습·연합 학습, 설명가능한 AI, 모델 해석 도구", "분산된 형태의 학습과 다양한 데이터 소스를 활용, 로컬 내에서 학습 및 높은 신뢰성 투명성 확보"],
          ["인프라", "고성능 컴퓨팅 자원, 클라우드 서비스", "고성능 GPU 및 AI 아키텍처 활용 대규모 AI 인프라 구축 및 슈퍼컴퓨터 센터 고도화"],
        ],
      },
      {
        caption: "사례",
        headers: ["사례", "설명"],
        rows: [
          ["한국", "자체 개발한 클라우드 서비스를 바탕으로 소버린 AI를 구현하기 위해 엔비디아 협력"],
          ["프랑스", "프랑스 소재 기업은 엔비디아와 협력, 클라우드 네이티브 AI 슈퍼컴퓨터 구축"],
          ["싱가포르", "엔비디아와 협력하여 국가 슈퍼컴퓨터센터의 GPU를 업그레이드"],
        ],
      },
    ],
    notes: ["개념도: 소버린 AI — 자체 인프라 · 인력 및 네트워크 · 독립 운영 · 문화 및 언어 반영 AI · 자국 정책 준수 및 맞춤화"],
  },
  {
    title: "인공지능 경영시스템(ISO 42001:2023)",
    course: "AI",
    definition:
      "조직의 인공지능 경영시스템 수립, 구현, 유지, 개선을 위한 요구사항에 대한 AI 국제 경영시스템 표준",
    defShort: "AI 경영시스템 수립·구현·유지·개선 요구사항 국제표준",
    keywords: ["PDCA", "조직상황", "리더십", "기획", "지원", "운용", "성과평가", "개선", "AI 리스크 평가", "AI 영향 평가"],
    tables: [
      {
        caption: "표준 구성 [조리기지운성개] — PDCA 매핑",
        headers: ["PDCA", "구성요소", "설명"],
        rows: [
          ["Plan", "조직의 상황(4장)", "조직 상황의 이해, 근로자 및 이해관계자, AI 경영시스템 적용범위, 경영시스템"],
          ["Plan", "리더십(5장)", "리더십과 의지 표명, AI 방침, 조직의 역할 및 책임"],
          ["Plan", "기획(6장)", "리스크 관리, AI 목표와 달성 기획, 변경기획"],
          ["Do", "지원(7장)", "자원, 역량, 인식, 의사소통, 문서화"],
          ["Do", "운용(8장)", "운용기획, AI 위험평가, AI 위험 처리, AI 시스템 영향평가"],
          ["Check", "성과평가(9장)", "모니터링 및 성과평가, 내부심사, 경영검토"],
          ["Act", "개선(10장)", "일반사항, 시정조치, 지속적 개선"],
        ],
      },
      {
        caption: "요구사항 [목리윤투책]",
        headers: ["요구사항", "설명"],
        rows: [
          ["목적과 범위 설정", "AI 시스템의 목적과 범위 명확화"],
          ["리스크 관리", "AI 시스템의 개발, 구현, 운영, 유지 관리 과정에서 발생할 수 있는 잠재적 리스크 식별 및 관리"],
          ["윤리 준수", "AI 시스템의 개발, 구현, 운영, 유지 관리 과정의 윤리 준수"],
          ["투명성", "AI 시스템의 개발, 구현, 운영, 유지 관리 과정 투명하게 공개"],
          ["책임성", "AI 시스템의 결과에 대한 책임"],
        ],
      },
    ],
    notes: ["표준 장 구성: 4.조직의 상황 → 5.리더십 → 6.기획 → 7.지원 → 8.운용 → 9.성과평가 → 10.개선 (8.2 AI 위험평가 · 8.3 AI 위험 처리 · 8.4 AI 시스템 영향평가가 핵심 차별점)"],
  },
  {
    title: "AX(AI Transformation)",
    course: "AI",
    definition:
      "기업이 기존 사업 모델과 작업 프로세스를 버리고 AI 기술을 전사적으로 적용해 사업 모델, 작업 프로세스, 제품, 서비스 등을 변화를 추구하는 전환 과정",
    defShort: "AI를 전사 적용해 사업 모델·프로세스를 전환하는 과정",
    keywords: ["DX(Digital Transformation)", "AI 서비스", "AI 인프라", "AI 거버넌스"],
    tables: [
      {
        caption: "절차 [전파혁교커업]",
        headers: ["단계", "설명"],
        rows: [
          ["1) AI 전략 수립", "회사내 가장 가치 있는 고유 데이터 소스 식별. 자동화의 효율이 좋은 프로세스 식별. AI 혁신을 추진하기 위한 내부 리소스 식별"],
          ["2) 파일럿 프로젝트 실행", "프로젝트를 통해 조직 전반에 걸쳐 신뢰를 얻는 혁신에 중요하며 더 큰 성공을 거두는 AI 프로젝트로 이어질 모멘텀을 생성"],
          ["3) 사내 AI 혁신팀 구축", "AI 작업을 아웃소싱하면 하여 쉽게 시작하는 것 보단, 장기적으로는 내부 AI 혁신팀 구성해 육성"],
          ["4) AI 교육 제공", "직원을 자신의 역할에 맞게 교육해 역량 강화"],
          ["5) 내외부 커뮤니케이션", "내부 및 외부 커뮤니케이션을 개선하여 비즈니스 전반에 걸쳐 조정을 보장"],
          ["6) AI 전략 업데이트", "회사의 AI 전략을 업데이트, AI 혁신 지속 유지"],
        ],
      },
      {
        caption: "기술요소 [서인거]",
        headers: ["구성요소", "특징 기술", "설명"],
        rows: [
          ["AI 서비스", "자연어 처리(NLP), 영상 분석, 기계학습(ML), 자율 주행", "언어를 이해하고 처리하는 능력 / 얼굴 인식·물체 감지·패턴 인식 / 데이터 기반으로 자신만의 모델을 학습 및 구축가능한 서비스 / 자율 주행 차량 및 드론 등의 기술"],
          ["AI 인프라", "GPU·TPU, 분산 컴퓨팅·클라우드 서비스, AI 개발 및 배포 플랫폼", "대규모 데이터의 병렬 처리 학습 / 대규모의 데이터를 처리하고 분석하기 위해 분산 시스템과 클라우드 기술을 통합 / 모델 개발, 훈련, 배포를 위한 종합적인 플랫폼은 효율적인 AI 생태계를 형성하는 데 필수"],
          ["AI 거버넌스", "데이터 거버넌스, 모델 거버넌스, 규정 준수", "데이터 수집, 저장, 처리 및 공유에 대한 표준 정의하고 준수 / 모델의 품질과 윤리적 측면을 모니터링하고, 모델의 생명주기 관리에 대한 프로세스를 정의 / AI 기술의 사용이 국가 및 산업 규정에 부합하도록 보장하고 법적 책임을 준수"],
        ],
      },
    ],
    notes: ["개념도: 대상(전략·목표·시스템, 조직·문화·프로세스, 커뮤니케이션) + 적용 기술(Digital Transformation, AI 서비스, AI 인프라, AI 거버넌스) → 기대 효과(가치 창출/이익 증가, 효율성/생산성 향상, 신규 사업 진출)"],
  },
  {
    title: "에이전틱 AI(Agentic AI)",
    course: "AI",
    definition:
      "다양한 AI 기술을 메모리, 계획, 환경 감지, 도구 활용, 안전 지침 준수와 같은 기능과 결합하여 목표를 달성하기 위한 작업을 스스로 수행하는 AI",
    defShort: "메모리·계획·도구를 결합해 목표 작업을 스스로 수행하는 AI",
    keywords: ["자율", "인식", "추론", "행동", "학습", "LLM", "RAG", "데이터 플라이 휠"],
    tables: [
      {
        caption: "프로세스 [인추행학]",
        headers: ["구분", "기술요소"],
        rows: [
          ["인식(Perceive)", "데이터 수집, 특징 추출"],
          ["추론(Reason)", "LLM 기반 추론, RAG(검색 증강 생성)"],
          ["행동(Act)", "목표 설정, 자율 계획, API 통합"],
          ["학습(Learn)", "피드백 루프, 데이터 플라이휠"],
          ["성숙도 및 관리", "SaaS 통합, IoT 디바이스 통합, 자율적 의사 결정, 보안 및 거버넌스"],
        ],
      },
      {
        caption: "사례",
        headers: ["구분", "주요사례"],
        rows: [
          ["산업 최적화", "공급망 최적화. 제조 공정 자동화"],
          ["보안 강화", "사이버보안 취약성 분석. 금융 거래 감시"],
          ["의료 지원", "의료진 업무 보조. 원격 환자 모니터링"],
          ["소매 및 서비스", "개인화된 고객 서비스. 재고 관리 및 주문 예측"],
        ],
      },
    ],
    notes: ["개념도: USER ↔ AI Agent(Database·Vector DB → LLM → Action) + Data Flywheel → Model Customization", "프로세스 흐름: 인식(데이터 수집) → 추론(LLM 추론·RAG 활용) → 행동(API 기반 외부 서비스 통합) → 학습(피드백 루프로 모델을 개선 — 데이터 플라이 휠)"],
  },
  {
    title: "인공지능 학습용 데이터 품질관리 가이드라인 v3.1",
    course: "AI",
    definition:
      "인공지능 학습용 데이터 품질을 확보하는 데 필요한 조직, 절차, 품질기준, 품질관리 방법이나 활동 정의하여 점검하고 조치하는 일련의 활동",
    defShort: "AI 학습데이터 품질 확보 조직·절차·기준을 정의한 지침",
    keywords: ["100.준비·계획", "200.구축", "300.운영·활용 3단계 사업 단계", "단계", "프로세스", "산출물", "품질관리 활동"],
    tables: [
      {
        caption: "품질관리 지표 [준완유기기통구의알유]",
        headers: ["구분", "품질지표"],
        rows: [
          ["구축공정", "준비성, 완전성, 유용성"],
          ["데이터 적합성", "기준 적합성, 기술 적합성, 통계적 다양성"],
          ["데이터 정확성", "구문 정확성, 의미 정확성"],
          ["학습모델", "알고리즘 적정성, 유효성"],
        ],
      },
      {
        caption: "품질관리 프로세스 [구획정가학운]",
        headers: ["단계", "프로세스", "설명"],
        rows: [
          ["100. 준비·계획", "110. 구축계획 수립", "구축목적의 일치성과 일관성 확보 위한 구체적 계획 수립. 사업수행기관의 컨소시엄 간 업무 역할 정의. 품질지표 및 목표, 품질점검 기준 수립 단계"],
          ["200. 구축", "210. 데이터 획득/수집", "기계학습 필요한 데이터 획득/수집 단계, 원시데이터 생성. 데이터 획득/수집 프로세스 및 원시데이터 품질 관리"],
          ["200. 구축", "220. 데이터 정제", "원시데이터 중복제거, 비식별화 등 정제 작업 수행. 데이터 정제에 대한 프로세스 및 원천데이터 품질 관리"],
          ["200. 구축", "230. 데이터 가공", "원천데이터에 라벨링데이터 부여 인공지능 학습 형태 가공. 데이터 가공 프로세스 및 라벨링데이터 품질관리"],
          ["200. 구축", "240. 데이터 학습", "원천데이터와 라벨링데이터 묶음으로 학습데이터셋 생성. 학습된 인공지능 모델 성능 보정 수행"],
          ["300. 운영·활용", "310. 데이터 운영·활용", "AI Hub 개방되는 학습용 데이터 품질관리. 개방용 데이터 운영, 활용 지원 위한 하자 및 유지 보수 단계"],
        ],
      },
    ],
    notes: ["개념도: 사업수행기관 — 단계(100.준비·계획/200.구축/300.운영·활용) · 프로세스(단계별 구축 공정 프로세스) · 산출물(프로세스별 구축 및 품질 관련 산출물) · 품질관리 활동(공정별 품질관리, 품질 자가점검 및 품질검증) + NIA 품질 관련 활동"],
  },
  {
    title: "공공부문 초거대AI 도입, 활용 가이드라인 2.0(2025.04)",
    course: "AI",
    definition:
      "초거대AI 등장에 따라 기업 및 공공부문의 일하는 방식이 변화되고 있는 과정에서 초거대AI를 도입하기 위한 절차 및 내용에 대한 가이드라인",
    defShort: "공공부문 초거대AI 도입 절차와 성과관리 가이드라인",
    keywords: ["데이터 보안 등급", "서비스 도입 방식", "서비스 레벨 목표", "유지보수 및 운영", "성과관리"],
    tables: [
      {
        caption: "도입절차 [보클데서유성]",
        headers: ["절차", "설명"],
        rows: [
          ["3.2.1 데이터 보안 등급", "업무 중요도에 따라 기밀(Classified), 민감(Sensitive), 공개(Open) 등 3개 등급으로 분류하여 보안정책 적용"],
          ["3.2.2 클라우드 구성 방안", "클라우드 영역 및 규모 선정, 클라우드 도입유형 결정 등 클라우드 서비스 구성"],
          ["3.2.3 데이터 학습 방식", "파운데이션 모델, 파인튜닝된 모델, 사후 학습된 모델, RAG(검색증강생성) 기반 모델로 구분"],
          ["3.2.4 서비스 도입 방식", "디지털 서비스 구매(클라우드 컴퓨팅서비스/융합서비스) 및 조달 용역발주 방식으로 추진"],
          ["3.2.5 유지보수 및 운영(Ops)", "데이터 준비, 모델 구축, 초기 설정, 사전학습, 추가학습, 교육, 배포, 모니터링, 최적화 등의 운영 관리 및 거버넌스 체계 마련 등"],
          ["4 성과 관리", "AI 과제의 체계적인 성과 관리를 위해 성과지표 설정 및 관리"],
        ],
      },
      {
        caption: "성과 지표 [투과산결]",
        headers: ["구분", "정의"],
        rows: [
          ["투입지표", "AI 시스템 개발·운영을 위해 투입되는 데이터, 컴퓨팅 자원, 인력 등 자원량 지표"],
          ["과정지표", "AI 시스템 개발·운영 과정에서의 중간 산출물이나 진행 상황을 나타내는 지표"],
          ["산출지표", "AI 시스템 구축 완료 후 나타나는 1차적 산출물을 나타내는 지표"],
          ["결과지표", "AI 시스템 도입을 통해 나타나는 궁극적인 효과나 공공부문에 대한 영향 지표"],
        ],
      },
      {
        caption: "AI 기능분류별 성과지표 Pool [지자대모]",
        headers: ["AI기능분류", "성과지표 Pool"],
        rows: [
          ["지능형 정보처리", "정보매칭·추출, 정보분석·전환, 예측·계획, 식별·분류, 언어·문서처리, 통합플랫폼"],
          ["자동화 업무 지원", "판정·의사결정, 서비스 연계·처리, 기획·창작, 통합플랫폼"],
          ["대화형 서비스", "상담, 번역, 추천·제안, 언어·문서처리, 통합플랫폼"],
          ["모니터링·알람", "모니터링·알람, 통합플랫폼"],
        ],
      },
    ],
    notes: ["공공AI 3대 전략 목표: 대국민 서비스 혁신(초개인화·포용적 서비스·사용자 경험 혁신), 사회문제 해결(사회적 난제 해법 도출·24시간 국민안전 확보), 일하는 방식 효율화(AI와 협업 일상화·업무 자동화 및 효율화·최적의 의사결정 지원)"],
  },
  {
    title: "AI 신뢰성 인증",
    course: "AI",
    definition:
      "데이터 및 모델의 편향, 인공지능 기술에 내재한 위험과 한계를 해결하고, 인공지능을 활용하고 확산하는 과정에서 부작용을 방지하기 위해 준수해야 하는 가치 기준",
    defShort: "AI 위험·편향 방지 위해 준수해야 하는 가치 기준",
    keywords: ["ISO/IEC TR 24028", "안전성", "설명가능성", "투명성", "견고성", "공평성", "다양성"],
    tables: [
      {
        caption: "핵심 속성 [안설투견공]",
        headers: ["핵심속성", "설명"],
        rows: [
          ["안전성(safety)", "AI가 판단·예측한 결과로 동작 또는 기능이 실행될 때 위험을 줄 가능성이 완화 또는 제거된 상태"],
          ["설명가능성(explainability)", "AI가 판단·예측의 근거와 결과에 이르는 과정을 이해할 수 있게 제시되거나, 원인 추적가능한 상태"],
          ["투명성(transparency)", "AI의 결정에 대한 이유가 설명 가능하거나 근거가 추적 가능하고, AI의 목적과 한계에 대한 정보가 적합한 방식으로 사용자에게 전달되는 상태"],
          ["견고성(robustness)", "AI가 외부의 간섭이나 극한적인 운영 환경 등에서도 사용자가 의도한 수준의 성능 및 기능을 유지"],
          ["공평성(fairness)", "AI가 데이터를 처리하는 과정에서 특정 그룹에 대한 차별 및 편향성을 나타내거나, 차별 및 편향 포함한 결론에 이르지 않는 상태"],
        ],
      },
      {
        caption: "신뢰성 요건 [존책안투]",
        headers: ["요건", "설명"],
        rows: [
          ["다양성 존중", "공평성·공정성(fairness), 정당성(justice)"],
          ["책임성", "책무성(responsibility), 감사가능성(auditability), 답변가능성(answerability)"],
          ["안전성", "통제가능성·제어가능성(controllability), 보안성(security), 강건성·견고성(robustness), 성능보장성(reliability)"],
          ["투명성", "설명가능성(explainability), 추적가능성(traceability), 이해가능성(understandability), 해석가능(Interpretability)"],
        ],
      },
      {
        caption: "AI 신뢰성에 관련된 표준",
        headers: ["표준", "핵심"],
        rows: [
          ["ISO/IEC TR 24028:2020", "인공 지능의 신뢰성에 대한 개요"],
          ["ISO/IEC 22989", "AI 개념과 용어"],
          ["ISO/IEC 23053", "인공 지능(AI) 및 기계 학습(ML) 프레임워크"],
          ["ISO/IEC 23894:2023", "인공지능 위험 관리에 대한 지침"],
          ["ISO/IEC 42001", "인공지능 경영 시스템에 대한 지침"],
        ],
      },
    ],
    notes: ["신뢰성 요소: 생명주기별 요구사항 분류(계획 및 설계 → 데이터 수집 및 처리 → 인공지능 모델 개발 → 시스템 구현 → 운영 및 모니터링) × 인공지능 구성요소(학습용 데이터·모델 및 알고리즘·시스템·사람-인공지능 인터페이스) — 인공지능 윤리 기준 준용(3대 기본원칙 10대 핵심요건 중 기술적으로 적용 가능한 4개 요건 준용)"],
  },
  {
    title: "AI Ready Data",
    course: "AI",
    definition:
      "인공지능(AI) 및 머신러닝(ML) 모델의 훈련, 검증 및 테스트에 바로 사용할 수 있도록 준비, 구조화, 정리된 데이터",
    defShort: "AI 모델 훈련·검증에 바로 쓸 수 있게 정리된 데이터",
    keywords: ["원시데이터", "포맷", "가공 및 데이터 라벨링", "클래스 라벨(단일, 다중)"],
    tables: [
      {
        caption: "텍스트/음성/이미지 데이터 획득 및 정제 방법",
        headers: ["절차", "세부 절차"],
        rows: [
          ["데이터 정의", "원시데이터 정의 및 포맷, 획득 규모"],
          ["획득 데이터 특성 분석", "원시데이터 획득 관련 이슈사항 도출. 원시데이터 적합성 검토 및 선정"],
          ["획득 절차 및 항목", "데이터 획득·정제·획득방법 절차 수립. 데이터 획득항목 정의, 획득 데이터 저장 및 관리"],
          ["획득 데이터 정제 방식", "정제 프로세스 및 정제 기준 수립"],
          ["획득 도구 및 정제 도구", "획득 및 정제도구"],
          ["획득 시 고려사항", "법·제도 준수. 데이터 다양성 확보, 데이터 편향 방지 및 윤리 준수. 사업계획서 및 데이터 구축 요건 일치. 기타 텍스트 데이터 획득 시 품질 고려사항"],
        ],
      },
      {
        caption: "데이터 관련 용어",
        headers: ["용어", "설명"],
        rows: [
          ["데이터 획득(Data Acquisition)", "인공지능의 기계학습에 필요한 데이터를 현실 세계에서 직접 수집 또는 생성하거나, 이미 보유하고 있는 조직이나 시스템 등으로부터 법률적 제약이 없도록 '원시데이터'를 확보하는 활동"],
          ["데이터 정제(Data Refinement)", "획득한 원시데이터를 기계학습에 필요한 형식으로 맞추거나 불필요한 중복을 제거하며, 개인정보를 비식별화하여 처리하는 등 일련의 전처리 과정을 통해 '원천데이터'를 확보하는 활동"],
          ["데이터 라벨링(Data Labeling)", "인공지능이 기계학습에 활용할 수 있도록 기능이나 목적에 부합하는 정보를 원천데이터에 부착하는 활동"],
          ["라벨링데이터(Labeled Data)", "원천데이터에 부여한 '참값', 파일형식이나 해상도 등의 속성, 그리고 설명이나 주석 등이 포함된 '어노테이션'의 집합"],
          ["원시데이터(Raw Data)", "기계학습을 목적으로 획득 단계에서 수집 또는 생성한 음성, 이미지, 영상, 텍스트 등의 데이터"],
          ["원천데이터(Source Data, Unlabeled Data)", "원시데이터를 라벨링 공정에 투입하기 위해 필요한 전처리 등 정제 작업을 수행한 데이터로 라벨링데이터가 부여되지 않은 상태의 데이터"],
          ["인공지능 학습용 데이터 구축", "임무정의, 데이터 획득, 데이터 정제, 데이터 라벨링 등 인공지능 학습용 데이터를 구축하는 일련의 활동"],
          ["참값(Ground Truth)", "인공지능의 기계학습 목적에 따라 원천데이터에 라벨링된 정확한 값이나 사실의 의미적 표현"],
          ["어노테이션(Annotation)", "데이터 라벨링 시 원천데이터에 주석을 표시하는 작업을 의미하며 추가 부착되는 설명정보 데이터는 기능 목적에 따라 다양한 형태로 표현될 수 있으며 이러한 설명정보 표현방식을 지칭"],
        ],
      },
    ],
    notes: ["영상(동적/정적) 이미지 획득·정제: 데이터 정의(동적 영상·정적 이미지) → 특성 분석 → 획득 절차 및 항목 → 정제 방식 → 도구 → 고려사항(획득 가능성, 데이터 정확성, 보안사항·개인정보 및 저작권, 데이터 균형, 신뢰성)", "출제 이력: 2026.02 ITPE FR 5일차 2교시"],
  },
  {
    title: "AI 기본법",
    course: "AI",
    definition:
      "인공지능의 건전한 발전과 신뢰기반 조성에 필요한 기본적인 사항을 규정하는 것을 목적으로 제정된 법",
    defShort: "AI의 건전한 발전과 신뢰기반 조성 사항을 규정한 법",
    keywords: ["국가인공지능위원회", "고영향 인공지능", "생성형 인공지능", "인공지능산업", "인공지능사업자"],
    tables: [
      {
        caption: "요약",
        headers: ["구분", "설명"],
        rows: [
          ["추진체계", "인공지능 기본 계획 3년 마다 수립 및 시행(제6조). 국가인공지능위원회 운영 법적 근거 마련(제7조). 인공지능 관련 발생할 수 있는 위험 대비를 위한 인공지능안전연구소의 운영근거(제12조)"],
          ["인공지능 산업 육성", "인공지능 연구개발 지원(제13조), 표준화(제14조), 학습용데이터 시책 수립(제15조), 인공지능 도입/활용 지원 근거(제16조). 인공지능 집적단지 지정(제23조), 인공지능 데이터센터 시책 추진(제25조), 인공지능 융합촉진(제19조) 등을 통해 대한민국 인공지능 생태계의 혁신적 발전 지원. 인공지능 시대 선도할 인재 양성과 중소기업 성장촉진 내역 규정"],
          ["인공지능 안전·신뢰 기반 조성", "인공지능 발생 가능문제를 사전예방하기 위하여 규제 대상으로 고영향 인공지능과 생성형 인공지능 정의. 민간이 자율적으로 추진하는 인공지능 안전성·신뢰성 검/인증, 인공지능 영향평가에 대한 정부의 지원 근거 마련"],
        ],
      },
      {
        caption: "법령 — 정의(제2조)",
        headers: ["조항", "설명"],
        rows: [
          ["고영향 인공지능(2조 4호)", "사람의 생명, 신체의 안전 및 기본권에 중대한 영향을 미치거나 위험을 초래할 우려가 있는 AI시스템"],
          ["생성형 인공지능(2조 5호)", "입력한 데이터의 구조와 특성을 모방하여 글, 소리, 그림, 영상, 다양한 결과물을 생성하는 AI시스템"],
          ["인공지능산업(2조 6호)", "인공지능 또는 인공지능기술을 활용한 제품을 개발·제조·생산, 유통, 서비스를 제공하는 산업"],
          ["인공지능사업자(2조 7호)", "인공지능산업과 관련된 사업을 하는 자 (법인/단체/개인 및 국가기관 등)"],
        ],
      },
      {
        caption: "법령 — 주요 조항",
        headers: ["조항", "설명"],
        rows: [
          ["인공지능 기본계획의 수립(제6조)", "과학기술정보통신부 장관이 3년마다 정책 방향, 전문인력 양성, 활용 촉진 기반 조성 방안 등 수립"],
          ["국가인공지능위원회(제7조, 제8조)", "AI 기본계획의 수립 및 AI 활용 촉진, AI 관련 데이터센터 등 인프라 확충 방안, 고영향 AI 규율 등 심의·의결"],
          ["인공지능안전연구소(제11조, 제12조)", "인공지능 정책 개발과 국제 규범 확산을 위해 인공지능정책센터를 지정하고, 인공지능 안전 확보를 위해 인공지능안전연구소를 운영"],
          ["인공지능기술개발 지원 및 표준화(제13조, 제14조)", "인공지능 기술 활성화와 안전한 이용을 위해 동향 조사, 실용화, 연구개발 등을 지원하며, 과학기술정보통신부장관은 인공지능 기술 표준화를 위한 사업을 추진"],
          ["전문인력 확보(제21조)", "인공지능기술의 개발 및 인공지능산업의 진흥을 위하여 관련 전문인력을 양성"],
          ["인공지능집적단지 지정(제23조)", "인공지능산업 진흥과 경쟁력 강화를 위해 기업, 기관, 단체의 인공지능 연구개발 집적화를 추진"],
          ["인공지능윤리원칙(제27조)", "안전성·신뢰성, 접근성, 사람의 삶과 번영에의 공헌 등의 사항을 포함하는 인공지능 윤리원칙을 제정·공표할 수 있음"],
          ["인공지능 투명성 확보 의무(제31조)", "고 영향/생성형 AI 이용 제품·서비스 대해 이용자에게 사전 고지 이행 및 생성되었다는 사실을 표시. 인공지능시스템을 이용하여 실제와 구분하기 어려운 가상의 결과물을 제공할 경우 이용자가 명확하게 알 수 있도록 고지 또는 표시"],
          ["인공지능 안정성 확보 의무(제32조)", "대통령령 기준 이상의 연산량을 사용한 인공지능시스템은 안정성 확보를 위해 위험 식별·평가·완화를 이행"],
          ["고영향 인공지능과 관련한 사업자의 책무(제34조)", "고영향 인공지능 또는 이를 이용한 제품·서비스를 제공하는 경우 안전성·신뢰성을 확보하기 위한 조치를 이행하여야 함"],
          ["인공지능 영향평가(제35조)", "인공지능사업자는 고영향 인공지능 활용 시 기본권 영향 평가를 위해 사전 노력해야 함"],
          ["국내대리인 지정(제36조)", "국내 주소나 영업소가 없는 인공지능사업자는 대통령령 기준 충족 시 국내대리인을 지정해 안전성 확보조치 결과 제출, 고영향 인공지능 확인 신청, 지원 사항 등을 신고해야 함"],
          ["사실조사 등(제40조)", "위반 사항 발견 시 인공지능사업자에 자료 제출을 요구하거나 조사할 수 있으며, 위반이 확인되면 중지·시정 조치를 명할 수 있음"],
          ["과태료(제43조)", "고영향·생성형 인공지능 고지 의무 위반, 국내대리인 미지정, 중지·시정명령 불이행 시 3천만원 이하 과태료 부과"],
        ],
      },
    ],
  },
  {
    title: "인공지능(AI) 도입 사업비 산정 절차",
    course: "AI",
    definition:
      "인공지능(AI) 서비스 도입 사업비는 서비스 가격표 또는 견적서에 제시된 서비스 총이용료와 투입공수 방식의 커스터마이징 작업비용, 구축·개발비용에 따라 대가를 산정하는 방식",
    defShort: "서비스 이용료+커스터마이징+구축·개발비로 산정하는 방식",
    keywords: ["사전준비", "서비스 이용료 계산", "커스터마이징 작업비용 계산", "구축·개발 비용 계산", "AI 서비스 도입 사업비 산정"],
    tables: [
      {
        caption: "AI 서비스도입 사업유형 [단기데모시]",
        headers: ["구분", "항목별 활용 내용"],
        rows: [
          ["단순 AI 서비스 도입형", "AI 서비스 개발 없이 구독료를 지불하고 도입"],
          ["커스터마이징 — 기본 커스터마이징", "최소한의 커스터마이징 작업이 요구되는 유형. 요구사항 분석, 설계, 샘플 데이터셋 활용, 사전 학습된 모델 적용, 검증 및 안정화 등의 작업 수행"],
          ["커스터마이징 — AI 데이터 구축 커스터마이징", "데이터 신규 구축 또는 재구축 등 데이터 구축 커스터마이징 작업이 요구되는 유형. 요구사항 분석, 설계, 데이터 구축 또는 재구축, 데이터 품질 검증 및 안정화 등의 작업 수행"],
          ["커스터마이징 — AI 모델 커스터마이징", "기존 AI 모델 최적화, 새로운 AI 모델이나 알고리즘 개발 등의 커스터마이징 작업이 요구되는 유형. 요구사항 분석 및 설계, 데이터 구축 또는 재구축, 모델 최적화 또는 파인튜닝, 모델 또는 알고리즘 개발, 검증 및 안정화 등의 작업 수행"],
          ["시스템통합형", "커스터마이징 작업과 SW 개발 및 시스템통합 작업이 병행되는 사업유형"],
        ],
      },
      {
        caption: "상세절차 [사서커구사] [도입비 = 이커구]",
        headers: ["절차", "추가활동", "산출물"],
        rows: [
          ["1. 사전 준비", "도입 대상 서비스 식별. 세부 도입 서비스 항목과 서비스 도입 유형 결정", "대상 서비스 및 추가 활동 항목"],
          ["2. 서비스 이용료 계산", "서비스 특성을 고려하여 사용기간 결정. 해당 서비스 가격표 또는 견적서로 이용료 계산. 이용료 산정: 도입기간, 사용 규모, 단위 이용료, 총 이용료", "서비스 이용료"],
          ["3. 커스터마이징 작업비용 계산", "서비스 도입 시 필요한 커스터마이징 작업비용 항목 식별. 해당 서비스, 유사 서비스 가격표 또는 견적서로 커스터마이징 작업비용 계산. 비용항목: 요구사항 분석 및 설계, 데이터 구축(수집·정제·가공·검수), 모델 구현 및 학습, 검증 및 안정화", "커스터마이징 작업비용"],
          ["4. 구축·개발 비용 계산", "서비스 도입 시 필요한 소프트웨어 개발 및 시스템통합 작업비용항목 식별. SW 개발비 산정 방식에 따라 기능점수 또는 투입공수 방식으로 구축·개발 비용 계산", "구축·개발 비용"],
          ["5. AI 서비스 도입 사업비 산정", "서비스 도입 사업비 산정 — 서비스 이용료 + 커스터마이징 작업비용 + 구축·개발 비용", "서비스 도입 사업비"],
        ],
      },
    ],
    notes: ["사업유형과 비용 요소 관계: 단순 도입형=서비스 이용료만 / 기본·데이터·모델 커스터마이징형=이용료+해당 커스터마이징 작업비용 / 시스템통합형=구축·개발비용 포함"],
  },
  {
    title: "생성형AI 데이터 품질관리 가이드 v2.0",
    course: "AI",
    definition:
      "생성형AI 데이터 관점의 품질관리 역량 확보를 위한 품질관리 방법 및 절차의 체계적으로 제시하는 품질관리 가이드라인",
    defShort: "생성형AI 데이터 품질관리 방법·절차를 제시한 가이드",
    keywords: ["구축계획 수립", "데이터 획득/수집", "데이터 정제", "데이터 가공", "데이터 학습", "데이터 운영·활용"],
    tables: [
      {
        caption: "품질지표",
        headers: ["구분", "품질지표"],
        rows: [
          ["1. 구축 공정 적정성", "준비성, 완전성, 유용성"],
          ["2. 데이터 적합성", "기준 적합성, 다양성, 유사성, 편향성, 유용성, 안전성"],
          ["3. 가공 데이터 정확성", "구문 정확성, 의미 정확성(정답성)"],
          ["4. 학습모델 적정성", "알고리즘 적정성, 유효성"],
        ],
      },
      {
        caption: "품질관리 활동",
        headers: ["단계", "프로세스", "품질 관리 활동"],
        rows: [
          ["100. 준비·계획", "100. 구축계획 수립", "1101. 사업수행 및 구축계획 수립 / 1102. 데이터 구축 절차, 조직 구성 / 1103. 임무 정의에 대한 적절성 검토 / 1104. 품질목표 및 점검기준 수립"],
          ["200. 구축", "210. 데이터 획득/수집", "2101. 획득/수집 방법 및 기준 현행화 / 2102. 데이터 법적 근거 검토 / 2103. 획득/수집 도구 및 저장환경 검토 / 2104. 원시데이터 품질검사"],
          ["200. 구축", "220. 데이터 정제", "2201. 정제 방법 및 기준 현행화 / 2202. 개인정보·민감정보 비식별화 등 법적 준거 확보 / 2203. 정제 도구 및 저장환경 검토 / 2204. 원천데이터 품질검사"],
          ["200. 구축", "230. 데이터 가공", "2301. 가공 방법 및 기준 현행화 / 2302. 가공 도구 및 저장환경 검토 / 2303. 가공데이터 품질검사"],
          ["200. 구축", "240. 데이터 학습", "2401. 구축목적-AI모델 합치성 확인 / 2402. 학습결과 확인 및 최적화 / 2403. 품질검증결과 보완조치"],
          ["300. 운영·활용", "310. 데이터 운영·활용", "3101. 데이터 개방을 위해 개방 전 점검 활동 / 3102. 개방용 데이터 하자 및 유지보수 / 3103. 사용자 품질개선의견 반영"],
        ],
      },
    ],
    notes: ["데이터 구축 과정: 구축계획 수립(구축계획서) → 데이터 획득/수집(원시데이터) → 데이터 정제(원천데이터) → 데이터 가공(가공데이터: Caption·Summary·Q&A·Dialogue·Translation·Radiology Report 등 Instruction Data) → 데이터 학습(학습 데이터셋) → 반복(Iteration)", "출제 이력: 2025.10 KPC 모의고사 4교시, 2025.08 ITPE FR 3일차 2교시, 2025.10 ITPE 모의고사 4교시"],
  },
  {
    title: "MAS(Multi Agent System)",
    course: "AI",
    definition:
      "여러 개의 자율적 소프트웨어 에이전트가 상호작용하며 협력 또는 경쟁을 통해 복잡한 문제를 분산적으로 해결하는 분산 인공지능 시스템",
    defShort: "자율 에이전트들이 협력·경쟁으로 문제를 푸는 분산 AI",
    keywords: ["자율", "분산", "통신", "경쟁/협력", "전문화", "적응성", "Crew AI", "Expert Agent", "강화학습"],
    tables: [
      {
        caption: "활용분야(특성별 핵심 기술)",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["자율", "GPT 기반 에이전트, 강화학습(RL) 기반 로봇", "각 에이전트는 독립적으로 판단하고 동작하며, 중앙 통제가 필요 없음"],
          ["분산", "Event-driven Architecture, Fault-Tolerant Agent Design", "제어 권한이 분산되어 있어, 특정 장애에도 전체 시스템이 유지"],
          ["통신", "RPC / REST / Pub-Sub", "에이전트 간 정보를 교환하여 협업하거나 협상을 수행"],
          ["경쟁/협력", "Multi-Agent Task Scheduler", "복잡한 작업을 효율적으로 수행하기 위해 역할을 나누고 공동 또는 경쟁 작업 실행"],
          ["전문화", "전문가 에이전트 구조(Expert Agent)", "각 에이전트는 서로 다른 역할/기능/지식 가지며 상호보완적으로 작동(도메인전문 지식 Agent)"],
          ["적응성", "RL(Reinforcement Learning)", "환경 변화나 새로운 상황에 능동적으로 대응하고 학습"],
        ],
      },
      {
        caption: "유형",
        headers: ["대분류", "세부 유형", "설명"],
        rows: [
          ["Independent", "Discrete", "에이전트들이 독립적으로 각자의 목표를 추구"],
          ["Independent", "Emergent Cooperation", "명시적 협력 없이 상호작용 결과로 협력적 행동이 창발"],
          ["Cooperative", "Communicating — Deliberative", "통신하며 숙의를 통해 공동의 계획을 수립"],
          ["Cooperative", "Communicating — Negotiating", "통신하며 협상을 통해 자원·역할을 배분"],
          ["Cooperative", "Non-communicating", "직접 통신 없이 환경 관찰만으로 협력"],
        ],
      },
    ],
    notes: ["개념도: Environment 안에 여러 Agent 집단(Organizational Relationship)이 존재하고, Agent 간 Interaction과 Area of Influence(영향 범위)가 겹치며 상호작용", "A2A 프로토콜과의 관계: MAS는 다중 에이전트 시스템 자체, A2A는 그 에이전트들이 조직·기술 경계를 넘어 통신하기 위한 개방형 프로토콜", "출제 이력: 2025.05 ITPE FR 5일차 1교시"],
  },
  {
    title: "확률분포",
    course: "ST",
    definition: "확률변수가 특정한 값을 가질 확률을 나타내는 분포",
    defShort: "확률변수가 특정 값을 가질 확률을 나타내는 분포",
    keywords: ["이산확률분포", "연속확률분포", "기대치", "분산"],
    tables: [
      {
        caption: "확률분포 유형 [이연 베이포 정표T카F]",
        headers: ["구분", "설명"],
        rows: [
          ["이산확률변수", "확률변수 X가 취할 수 있는 값이 유한개 있거나 자연수와 같이 셀 수 있을 때 X는 이산확률변수"],
          ["연속확률변수", "확률변수 X가 어떤 구간에 속하는 모든 실수값을 취할 때, X는 연속확률변수"],
        ],
      },
      {
        caption: "상세절차 — 이산확률분포",
        headers: ["유형", "설명"],
        rows: [
          ["베르누이 분포", "특정 실험의 결과가 성공 또는 실패와 같이 두 결과 중 하나를 얻는 분포. 성공확률과 실패확률의 합은 1, 각 시행은 서로 독립적. 베르누이 시행을 n번 독립적으로 반복 실행하면 이항분포를 따름"],
          ["이항 분포", "n번 시행 중에 각 시행의 확률이 p일 때, k번 성공할 확률분포. 이항분포의 시행횟수가 많아지면 이항분포는 정규분포와 유사"],
          ["포아송 분포", "주어진 단위 시간 또는 단위 영역에서 어떤 사건의 발생 횟수를 나타내는 확률분포. 기댓값과 분산이 λ로 동일하고 독립성, 비례성, 비집락성 특징이 있음"],
        ],
      },
      {
        caption: "상세절차 — 연속확률분포",
        headers: ["유형", "설명"],
        rows: [
          ["정규 분포", "평균을 중심으로 대칭이며 종모양인 확률밀도함수의 그래프를 띠는 연속확률분포"],
          ["표준정규분포(Z-분포)", "평균은 0, 분산은 1로 표준화시킨 표본분포. 표준정규분포를 따르는 확률변수는 Z로 표현"],
          ["T-분포", "모집단이 정규분포이고, 모집단의 표준편차는 모를 때 모집단의 평균을 추측에 사용되는 분포. 표본의 크기인 n의 크기가 클 경우에 중심 극한 정리에 의하여 T-분포는 정규분포를 따름"],
          ["카이제곱 분포(χ²-분포)", "표본 통계량이 표본분산일 때의 표본분포. n개의 서로 독립적인 표준 정규 확률변수를 각각 제곱한 다음 합해서 얻어지는 분포. 모집단 1개일 때 분산 추측·적합도 검정"],
          ["F-분포", "2개의 χ²-분포하는 확률변수의 확률변수 값을 각각 자유도로 나눈 평균 카이제곱값의 비율을 변수값으로 하는 확률변수분포. 모집단 2개일 때 분산 추측·적합도 검정"],
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
    defShort: "연속확률변수의 확률분포를 수학적 함수로 표현한 것",
    keywords: ["이산확률분포", "연속확률분포", "정규분포", "지수분포", "확률질량함수"],
    tables: [
      {
        caption: "확률분포 개념도",
        headers: ["구분", "설명"],
        rows: [
          ["이산확률분포", "셀 수 있는 값을 가질 때, 확률질량함수(PMF) 활용 확률분포. 베르누이 분포, 이항 분포, 포아송 분포"],
          ["연속확률분포", "연속적인 값을 가질 때, 확률밀도함수(PDF) 활용 확률분포. 정규분포, T-분포, 카이제곱 분포, F-분포, 지수분포"],
        ],
      },
      {
        caption: "확률밀도함수 개념도",
        headers: ["구분", "설명"],
        rows: [
          ["정규분포", "평균 주변 대칭, 일반적 데이터 모델링"],
          ["지수분포", "사건이 발생하는 시간 간격 모델링"],
        ],
      },
      {
        caption: "확률분포와 확률밀도함수 관계",
        headers: ["단계", "설명"],
        rows: [
          ["확률변수 → 확률분포", "확률변수의 특정 값 확률 함수"],
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
    defShort: "평균 중심 좌우대칭 종모양으로 평균·분산이 결정하는 확률분포",
    keywords: ["확률변수", "종모양", "표준편차", "평균", "분산", "표준정규 분포", "Z값"],
    tables: [
      {
        caption: "모양 특징",
        headers: ["특징 구분", "상세 특징 설명"],
        rows: [
          ["분포 모양", "평균을 중심으로 좌우 대칭인 종모양 형태. 모양과 위치는 평균과 표준편차에 의해 결정. 평균(μ)에서 확률 밀도 곡선의 높이가 가장 큼"],
          ["분포 폭", "표준편차(σ)에 의해 결정, 곡선의 모양의 변화. 표준편차가 클수록 곡선은 평평해지고 작을수록 높아짐"],
          ["분포 위치", "평균(μ)에 의해 결정, 곡선의 대칭축 이동"],
          ["곡선", "평균에서 멀어질수록 x축에 무한히 접근하지만, x축에 닿지 않음"],
        ],
      },
      {
        caption: "확률적 특징",
        headers: ["구분", "설명"],
        rows: [
          ["표기", "X ~ N(μ, σ²), X: 확률변수, μ: 평균, σ: 표준편차, σ²: 분산"],
          ["넓이", "정규곡선과 X축 사이의 전체 면적은 1"],
          ["평균", "평균 값이 최대값. 평균=중앙값=최빈값 모두 동일"],
          ["확률밀도함수", "f(x) = 1/(σ√2π) · e^(−(x−μ)²/2σ²) (단, −∞<x<∞, e=2.71828…)"],
          ["확률변수", "확률변수(x)가 취할 수 있는 값은 구간은 −∞ < x < ∞"],
          ["확률값", "68-95-99.7 규칙 — 평균에서 ±3σ 범위 내 전체의 99.7%, ±2σ 내 95.5%, ±1σ 내 68.3%가 존재. 경험규칙(The Empirical Rule): 정규분포를 따르는 관측 데이터의 대부분인 99.7%가 평균으로부터 ±3σ내에 존재"],
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
    defShort: "표본크기가 크면 표본평균 분포가 정규분포를 따른다는 원리",
    keywords: ["평균", "정규분포"],
    tables: [
      {
        caption: "특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["통계적 추론 관점", "정규 분포 근사화", "표본 평균의 분포를 정규 분포에 근사화하여 통계적 추론을 간편하게 만들어줌"],
          ["통계적 추론 관점", "추론의 강화", "적은 표본에서도 통계적 추론을 통해 모집단 정보 추론에 활용"],
          ["표본과 모집단 관점", "표본 크기의 영향", "표본 크기가 증가할수록 중심극한의 정리 적용 용이"],
          ["표본과 모집단 관점", "모집단 분포 독립적", "모집단의 데이터의 분포가 무엇이든 상관없이 표본 평균의 분포에 대한 근사값 제공"],
          ["표본 추출 및 설계 관점", "표본 추출 유연성", "확률적 또는 비확률적 표본 추출 등 추출 방법에 독립적"],
          ["표본 추출 및 설계 관점", "실험의 재현성", "실험을 여러 번 반복할수록 표본 평균 분포의 일반적 경향 표현"],
        ],
      },
      {
        caption: "수식",
        headers: ["구분", "설명"],
        rows: [
          ["표본 평균", "X̄ = f(X₁, X₂, …, Xₙ) = (X₁+X₂+…+Xₙ)/n"],
          ["표준오차", "모집단의 표준편차가 σ일 때, 표본평균 분포의 표준편차는 σ/√n"],
        ],
      },
    ],
    notes: ["개념도: 균등분포·비균등분포·정규분포 어떤 모집단이든, 각각의 군을 n번 측정하여 G개 군의 평균의 평균을 구하면 정규분포로 수렴", "\"모집단 분포에 상관없이\" 큰 표본들의 \"표본평균의 분포\"가 정규분포로 수렴한다는 점을 이용하여, Z값을 구해 확률값을 구할 수 있게 된다. 즉, 수학적 확률 판단(추정)을 할 수 있다", "n이 커질수록 수렴: Bin(10,0.9)·Pois(2)·Expo(1)·Beta(0.8,0.8) 모두 n=1→5→30→100으로 갈수록 정규분포 모양"],
  },
  {
    title: "데이터 유형",
    course: "ST",
    definition: "자료의 형태와 측정 척도에 따라 데이터를 분류하는 체계",
    defShort: "명목·순서·등간·비율 척도로 자료를 분류하는 체계",
    keywords: ["범주", "수치", "명목", "순서", "등간", "비율"],
    tables: [
      {
        caption: "자료 형태에 따른 분류 [명순등비]",
        headers: ["유형", "세분류", "설명"],
        rows: [
          ["범주형 자료(Categorical Data) = 질적 자료", "명목 자료(Nominal) — 명목 척도", "측정 대상의 특성을 분류하거나 확인(숫자로 바꾸어도 그 값이 크고 작음을 나타내는 것이 아니라 단순히 범주를 표시). 예) 성별, 혈액형, 직업구분, 학력"],
          ["범주형 자료(Categorical Data) = 질적 자료", "순서 자료(Ordinal) — 서열 척도", "측정 대상의 특성을 몇 개의 범주로 구분할 뿐만 아니라 그 범주들 사이에 순서 관계가 성립하는 변수. 예) 우선순위, 등수, 학점, 선호도"],
          ["수치형 자료(Numeric Data) = 양적 자료", "등간 자료(Interval) — 이산형 자료", "측정 대상의 양적인 차이를 나타내주는 변수, 균일한 간격을 두고 분할하여 측정. 셀 수 있는 형태의 자료. 예) 설문지의 설문문항, 온도, IQ 지수"],
          ["수치형 자료(Numeric Data) = 양적 자료", "비율 자료(Ratio) — 연속형 자료", "측정 대상의 양적인 차이를 나타내주는 변수, 절대영점이 존재하며 비율계산이 가능. 연속적 속성을 가지는 자료. 예) 시험점수, 스트레스 점수, 키, 몸무게"],
        ],
      },
      {
        caption: "시간에 따른 자료 유형",
        headers: ["유형", "설명"],
        rows: [
          ["횡단형(Cross-sectional Data)", "한번의 시간에 얻어진 데이터"],
          ["종단형(Longitudinal Data)", "동일한 대상으로부터 여러 시간에 걸쳐 얻어진 데이터 (시계열 자료, Time series data)"],
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
    defShort: "모집단에서 표본을 뽑는 확률·비확률 추출 방법",
    keywords: ["확률 추출", "비확률 추출"],
    tables: [
      {
        caption: "확률 추출 [단층계집]",
        headers: ["방법", "설명"],
        rows: [
          ["단순확률 추출(Simple Random Sampling)", "모집단을 구성하는 요소 하나 하나가 뽑힐 확률이 동일한 상황에서 뽑는 방법(기본이 되는 추출법). 예) S대학 1000명중 100명을 난수를 이용해 추출"],
          ["층화확률 추출(Stratified Random Sampling)", "모집단을 먼저 서로 겹치지 않는 여러 개의 층으로 분할한 후, 각 층별로 단순 임의 추출법을 적용시켜 표본을 얻는 방법. 예) A레스토랑 만족도 조사위해 손님 연령대별 추출"],
          ["계통 추출(Systematic Sampling)", "모집단의 추출 틀에서 k번째 간격마다 하나씩 표본으로 추출. 예) A레스토랑 만족도 조사하기 위해 손님 표본 추출(k=3)"],
          ["집락(군집) 추출(Cluster Sampling)", "서로 인접한 기본 단위들로 구성된 군집을 만들고, 추출된 군 집내의 일부 또는 전체를 조사. 예) A레스토랑 만족도 조사 위해 손님 거주 지역별 추출"],
        ],
      },
      {
        caption: "비확률 추출 [눈편할유판]",
        headers: ["방법", "설명"],
        rows: [
          ["눈덩이 추출법(Snowball Sampling)", "소수의 응답자를 찾은 다음 이들과 비슷한 사람들을 소개받아 가는 식으로 표본을 추출하는 방법"],
          ["편의 표출(Convenience Sampling)", "모집단에 대한 정보가 전혀 없는 경우, 표본 선정의 편리성에 기준을 두고 조사원이 마음대로 선정하는 방법. 연구자가 이용 가능한 대상을 임의로 선택"],
          ["할당 추출(Quota Sampling)", "모집단이 여러 특성으로 구성되어 있는 경우, 각 특성에 따라 층을 구성한 다음, 조사원이 그 층 내에서 직접 선정하여 조사하는 방법. 확률적 근거없이 임의로 연구자가 표본을 분류하여 추출. 예) 성별/나이에 따라 결과가 다를것이라 연구자가 추측"],
          ["유의추출법(포커스 그룹, Purposive Sampling / Focus Groups)", "모집단 특성에 대해 조사원이 정확히 알고 있는 경우에 제한적으로 사용되는 방법. 조사자의 풍부한 경험을 활용하여 주관적 판단에 따라 표본을 추출. 깊이 있는 연구를 위해 대표하는 사람을 추출. 예) S전자는 새로운 휴대폰을 개발하기위해 소비자 10명을 추출하여 새로운 상품에 대한 아이디어 회의를 진행"],
          ["판단추출법(Judgement Sampling)", "조사원이 자신의 지식과 경험에 의해 모집단을 가장 잘 대표한다고 여겨지는 표본을 주관적으로 판단하여 표본을 추출하는 방법. 일반적으로 표본의 크기가 아주 작은 경우에 사용"],
        ],
      },
    ],
  },
  {
    title: "왜도(Skewness) & 첨도(Kurtosis)",
    course: "ST",
    definition:
      "왜도: 분포의 비대칭성 정도, 분포가 기울어진 정도와 방향 / 첨도: 정규 분포와 비교해 얼마나 더 뾰족한 지 측정한 값",
    defShort: "분포의 비대칭 정도(왜도)와 뾰족한 정도(첨도)의 측정값",
    keywords: ["분포의 비대칭성 정도", "얼마나 더 뾰족한 지 측정", "정규성 검정"],
    tables: [
      {
        caption: "왜도(비대칭성)",
        headers: ["값", "설명"],
        rows: [
          ["왜도 < 0", "오른쪽으로 치우진 분포 (Negative Skewness, right-modal)"],
          ["왜도 = 0", "비대칭성 정도가 정규 분포와 유사한 분포"],
          ["왜도 > 0", "왼쪽으로 치우진 분포 (Positive Skewness, left-modal)"],
        ],
      },
      {
        caption: "첨도(뾰족함)",
        headers: ["값", "설명"],
        rows: [
          ["첨도 < 0", "상대적으로 평평한 분포 (Platykurtic)"],
          ["첨도 = 0", "뾰족한 정도가 정규 분포와 유사한 분포 (Mesokurtic)"],
          ["첨도 > 0", "상대적으로 뾰족한 분포 (Leptokurtic)"],
        ],
      },
      {
        caption: "수식",
        headers: ["구분", "수식"],
        rows: [
          ["왜도", "γ₁ = 1/(n−1) · Σ((xᵢ − x̄)/s)³ — n: 데이터의 수, s: 표준 편차, xᵢ: i번째 x 값, x̄: x의 평균"],
          ["첨도", "γ₂ = 1/(n−1) · Σ((xᵢ − x̄)/s)⁴ − 3 — n: 데이터의 수, s: 표준 편차, xᵢ: i번째 x 값, x̄: x의 평균"],
        ],
      },
    ],
  },
  {
    title: "이상치(Outlier)",
    course: "ST",
    definition: "보통 관측된 데이터의 범위에서 많이 벗어난 아주 작은 값이나 큰 값",
    defShort: "관측 데이터 범위에서 크게 벗어난 아주 작거나 큰 값",
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
          ["Variance", "정규분포에서 97.5% 이상 또는 2.5% 이하에 포함되는 값을 이상치로 판별"],
          ["Likelihood", "베이즈 정리에 의해 데이터 셋이 가지는 두 가지 샘플(정상/이상)에 대한 발생 확률(Likelihood)로 이상치 판별"],
          ["Nearest-Neighbor", "모든 데이터 쌍의 거리를 계산하여 이상치 검출"],
          ["Density", "샘플의 LoF(Local Outlier Factor)를 계산해 값이 가장 큰 데이터를 이상치로 추정"],
          ["Clustering", "데이터를 클러스터로 구분한 후 작은 크기의 클러스터나 클러스터 사이의 거리를 계산하여 먼 경우 해당 클러스터를 이상치로 추정"],
        ],
      },
      {
        caption: "Outlier Replacement(이상치 대체)",
        headers: ["방법", "설명"],
        rows: [
          ["(1) 하한값/상한값 대체", "하한값과 상한값을 결정한 후 하한값보다 적으면 하한값으로 대체, 상한값보다 크면 상한값으로 대체"],
          ["(2) 평균의 표준편차", "하한값 = 평균 − n × 표준편차 / 상한값 = 평균 + n × 표준편차. 일반적으로 3시그마(99.7% 이상 혹은 이하 값으로 이상치를 제거하거나 대체)"],
          ["(3) 평균 절대 편차", "중위수로부터 n 편차 큰 값을 대체"],
          ["(4) 극 백분위수", "상위 P번째 백분위수보다 큰 값을 대체"],
          ["(5) Winsorization(윈저화)", "지정된 수의 극한값을 더 작은 데이터값으로 대체하는 과정"],
        ],
      },
    ],
    notes: ["백분위수: 크기가 있는 값들로 이뤄진 자료를 순서대로 나열했을 때 백분율로 나타낸 특정 위치의 값. 성적이 85퍼센타일(85%ile)이라 하면, 이 성적보다 낮은 사람이 85% 있으며, 높은 사람이 15% 있다는 것을 뜻", "IQR = Q3 − Q1, 내부 울타리(1.5×IQR) 밖이면 outlier, 외부 울타리(3.0×IQR) 밖이면 극단 이상값"],
  },
  {
    title: "결측치(Missing Value)",
    course: "ST",
    definition: "관측되어야 할 값을 얻지 못한 데이터(누락)",
    defShort: "관측되어야 할 값을 얻지 못해 누락된 데이터",
    keywords: ["편향", "삭제", "대체"],
    tables: [
      {
        caption: "결측치 유형",
        headers: ["구분", "유형"],
        rows: [
          ["매커니즘", "완전 무작위 결측, 무작위 결측, 비무작위 결측"],
          ["패턴", "일변량 결측 패턴, 단조 결측 패턴, 일반 결측 패턴, 규칙 결측 패턴"],
          ["처리", "삭제, 대체"],
        ],
      },
      {
        caption: "결측치 제거 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["삭제(Removal)", "행 삭제(Listwise Deletion)", "결측치가 포함된 행을 제거"],
          ["삭제(Removal)", "열 삭제(Column Deletion)", "결측치 비율이 높은 변수 삭제. 적용 조건: 결측치가 소수(예: 5% 이하)일 경우 사용 가능"],
          ["대체(Imputation)", "평균/중앙값/최빈값 대체", "연속형 변수는 평균/중앙값, 범주형 변수는 최빈값 사용"],
          ["대체(Imputation)", "회귀 대체(Regression Imputation)", "결측된 값을 예측 모델(선형 회귀 등)로 보완"],
          ["대체(Imputation)", "KNN 대체(K-Nearest Neighbors Imputation)", "유사한 데이터를 찾아 결측값 대체"],
          ["대체(Imputation)", "다중 대체(Multiple Imputation)", "여러 번 샘플링하여 예측된 값으로 대체"],
          ["예측 모델 활용", "머신러닝 모델", "Decision Tree, Random Forest 등을 활용하여 결측값을 예측"],
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
    defShort: "시간 흐름 자료를 AR·MA·ARIMA로 분석해 미래를 예측하는 기법",
    keywords: ["추세", "순환", "계절", "불규칙", "AR", "MA", "ARMA", "ARIMA"],
    tables: [
      {
        caption: "정상성 (시간에 따라 통계적 특성이 변하지 않는 상태)",
        headers: ["조건", "설명"],
        rows: [
          ["평균 일정", "시계열 자료의 시간, 시점에 의존하지 않고 평균이 일정"],
          ["분산 일정", "시계열 자료의 시간, 시점에 의존하지 않고 분산이 일정"],
          ["공분산 시차 의존", "공분산은 시차에만 의존하고 특정 시점에는 의존하지 않음"],
        ],
      },
      {
        caption: "특징 [추순계불]",
        headers: ["특징", "설명"],
        rows: [
          ["추세(Trend)", "시계열 데이터의 장기 변동 요인 (GDP, 인구증가율, 기술변화 등)"],
          ["순환(Cycle)", "시계열 데이터의 중기 변동 요인. 2~10년 기간을 주기로 순환적"],
          ["계절(Seasonal)", "1년 주기로 발생 단기 변동 요인. 순환에 비해 주기가 짧음"],
          ["불규칙(Irregular)", "규칙성 없이 예측 불가한 요인. 우연적으로 발생하는 변동"],
        ],
      },
      {
        caption: "시계열 모델 종류",
        headers: ["유형", "설명"],
        rows: [
          ["자기회귀 모델(AR, Autoregressive)", "현재 시계열 값이 이전 시점(p) 시계열 값들의 선형 결합과 백색 잡음의 합으로 이루어진 모델 (변수의 과거 값의 선형 조합을 이용하여 관심 있는 변수를 예측). Xt = c + Φ₁Xt−1 + Φ₂Xt−2 + … + ΦpXt−p + εt"],
          ["이동평균 모델(MA, Moving Average)", "과거의 '예측 오차'가 현재의 데이터에 영향을 미친다는 가정하에 수립된 모형 (관측된 몇 개의 값의 평균을 구하여 예측). Xt = c + εt + θ₁εt−1 + θ₂εt−2 + … + θqεt−q"],
          ["ARMA 모델(Autoregressive Moving Average)", "자기회귀과 이동평균 모델을 결합하여 p 시점의 시계열 값들과 q개의 백색 잡음의 선형 결합의 합으로 이루어진 모델"],
          ["ARIMA 모델(Autoregressive Integrated Moving Average)", "ARMA 모델의 정상성 확보를 위해 차분한 데이터 이용하여 p 시점의 시계열 값들과 q개의 백색 잡음의 선형 결합으로 이루어진 모델. 차분: 비정상성 데이터를 정상성 데이터로 변환하는 과정, 데이터 평균을 0으로 유지시켜 \"정상성\" 만족"],
        ],
      },
    ],
    notes: ["출제 이력: 138회 정보관리 1교시"],
  },
  {
    title: "베이즈 정리(Bayes's theorem)",
    course: "ST",
    definition: "두 확률 변수의 사전 확률과 사후 확률 사이의 관계를 나타내는 정리",
    defShort: "사전확률과 우도로 사후확률을 구해 확률을 갱신하는 정리",
    keywords: ["사전확률", "우도(Likelihood)", "사후확률", "조건부확률", "확률의 곱셈정리", "전 확률의 정리"],
    tables: [
      {
        caption: "기본수식 및 용어 [전우후]",
        headers: ["구분", "설명"],
        rows: [
          ["기본수식", "P(A|B) = P(B|A)P(A) / P(B) — 좌변은 사후확률, P(B|A)는 우도, P(A)는 사전확률"],
          ["사전확률(Prior Probability)", "관측자가 이미 알고 있는 사건의 확률. 현재 가지고 있는 정보를 기초로 하여 정한 초기확률. [표현] P(A1), P(A2), P(A3)…"],
          ["우도(Likelihood)", "이미 알고 있는 사건이 발생했다는 조건하에 다른 사건이 발생할 확률. 사건 발생 후에 어떤 원인으로부터 일어날 것이라고 생각되어지는 확률. [표현] P(B|A1), P(B|A2), P(B|A3)"],
          ["사후확률(Posterior Probability)", "사전확률과 우도를 통해 알게 되는 조건부 확률 P(A|B). [표현] P(Ai|B)"],
        ],
      },
      {
        caption: "베이즈 정리 수식 이론 [조곱전베]",
        headers: ["이론", "표현", "설명"],
        rows: [
          ["조건부 확률", "P(A|B) = P(A∩B) / P(B)", "주어진 사건이 일어났다는 가정 하에 다른 한 사건이 일어날 확률"],
          ["곱셈의 정리", "P(A∩B) = P(B|A)P(A) = P(A|B)P(B)", "교집합의 확률법칙"],
          ["전확률의 법칙", "P(B) = P(B∩A₁) + P(B∩A₂) + P(B∩A₃)", "개별확률의 합은 전체조건 확률과 동일. 단, An과 Am은 서로 소(m≠n), A1 ∪ A2 ∪ … ∪ An = 전체집합"],
          ["베이즈 정리", "P(A₁|B) = P(B∩A₁)/P(B) = P(B|A₁)P(A₁)/P(B) = P(B|A₁)P(A₁) / [P(B|A₁)P(A₁)+P(B|A₂)P(A₂)+P(B|A₃)P(A₃)]", "n개의 서로 배반인 사건 A1, A2, …, An 중 하나는 반드시 일어난다고 할 때, 임의의 사건 B에 의해 사건 A가 일어날 조건부 확률"],
        ],
      },
    ],
    notes: ["출제 이력: 138회 정보관리 1교시"],
  },
  {
    title: "기술 통계(Descriptive statistics)",
    course: "ST",
    definition: "주어진 표본 자체의 속성을 정량적으로 기술하고 요약하는데 초점을 두는 데이터 분석 통계",
    defShort: "표본 자체의 속성을 정량적으로 기술·요약하는 통계",
    keywords: ["데이터 요약(중심경향값, 변산도, 분포)", "데이터 시각화(히스토그램, 상자수염그림, 산점도)"],
    tables: [
      {
        caption: "데이터 요약 기법",
        headers: ["기법", "설명"],
        rows: [
          ["중심경향값", "중심적인 경향을 나타내는 주요한 기술 통계량. 평균(mean, average): 모든 관측치를 더하고 총 개수로 나누어서 구하는 데이터의 중심을 나타내는 척도 / 중위수(median): 관측치들을 순서대로 나열했을 때 순서 상 중앙에 위치하는 값 / 최빈값(mode): 가장 많이 관찰되는 값"],
          ["변산도", "자료의 분포가 집중 경향치를 중심으로 하여 어느 정도 밀집 또는 분산되어 있는지를 나타내는 기술통계량. 최대값, 최소값, 범위 / 분산: 관측값들이 평균으로부터 얼마나 떨어진 곳에 분포하는지를 나타내는 척도 / 표준편차: 관측값들이 평균으로부터 얼마나 떨어진 곳에 분포하는지를 나타내는 척도로 분산의 제곱근"],
          ["분포", "데이터 분포의 형태와 대칭성을 나타내는 척도. 왜도(skewness): 분포의 비대칭성(치우친 정도)을 나타내는 척도 / 첨도(kurtosis): 분포의 뾰족한 정도를 나타내는 척도"],
        ],
      },
      {
        caption: "데이터 시각화 기법",
        headers: ["종류", "설명"],
        rows: [
          ["히스토그램", "도수 분포를 직사각형 형태의 기둥으로 나타낸 그래프"],
          ["상자수염그림", "표본으로부터 계산한 사분위수를 이용해 수치적 자료의 분포 표현한 그래프. 이상치 탐지하기 위해 사용 (Minimum = Q1−1.5×IQR, Q1(25th Percentile), Median, Q3(75th Percentile), Maximum = Q3+1.5×IQR)"],
          ["산점도(scatter plot)", "두 수치형 변수 간의 관계를 시각화하기 위한 그래프"],
        ],
      },
    ],
  },
  {
    title: "추론 통계(Inferential Statistics)",
    course: "ST",
    definition: "표본 데이터를 기반으로 모집단의 특성을 추정하거나 가설을 검정하는 통계 기법",
    defShort: "표본으로 모집단 특성을 추정하고 가설을 검정하는 통계",
    keywords: ["모집단 특성 추정", "가설 검정"],
    tables: [
      {
        caption: "기술통계와 추론통계 비교",
        headers: ["비교", "기술통계", "추론통계"],
        rows: [
          ["목적", "수집한 데이터의 표본의 주요 특성을 분석하는 목적", "분석된 표본의 특성을 기반으로 모집단의 특성을 추정하는 목적"],
          ["방법", "평균값, 표준편차, 중위수, 최빈수, 최대값, 최빈수 등 통계량 분석 기법", "모수추정, 가설검정"],
          ["활용", "특정 학생 집단의 성적변화 추세 확인", "생산라인의 제품별 불량률 추정, 선거 지지도 조사"],
        ],
      },
      {
        caption: "추론통계 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["모수적 방법", "대응표본 t-검정", "두 기간에서의 변화를 분석할 때 사용"],
          ["모수적 방법", "독립표본 t-검정", "하나의 기간에 서로 다른 2개의 집단을 분석"],
          ["모수적 방법", "일원배치 분산분석", "하나의 집단에서 3개 이상의 기간에서의 변화 분석"],
          ["모수적 방법", "반복측정 분산분석", "하나의 집단에서 3개 이상의 기간에서 변화 분석"],
          ["비모수적 방법", "윌콕슨 부호순위 검정", "집단이 하나이고 두 기간에서의 변화 분석"],
          ["비모수적 방법", "맨휘트니 검정", "하나의 기간에서 서로 다른 2개의 집단 분석"],
          ["비모수적 방법", "크루스컬-월리스 검정", "하나의 기간에서 3개 이상의 집단을 분석"],
          ["비모수적 방법", "후리드만 검정", "하나의 집단에서 3개 이상의 기간에서의 변화 분석"],
          ["가설 검정", "통계학적 가설수립", "귀무가설(1종오류, 2종오류), 대립가설"],
          ["가설 검정", "검정통계량 선정", "표본으로부터 계산되는 표본통계량"],
          ["가설 검정", "유의수준 결정", "유의수준은 통계학적 검정에서 사용하는 판단의 기준"],
          ["가설 검정", "검정통계량 계산", "표본자료로부터 검정통계량의 계산"],
          ["가설 검정", "판정", "유의확률(p값)에 따라 기각, 채택"],
        ],
      },
    ],
    notes: ["개념도: 모집단(population)에서 표본(sample) 추출 → 표본의 특성 분석(기술통계) → 일반화 여부 판단 → 전체 모집단 특성으로 추정(추리통계)"],
  },
  {
    title: "추정 이론(Estimation Theory)",
    course: "ST",
    definition: "모집단으로부터 표본을 추출하여 모집단의 특성을 나타내는 모수에 대한 정보를 얻기 위한 일련의 과정",
    defShort: "표본에서 모집단 모수의 근사값을 점·구간으로 추정하는 과정",
    keywords: ["추정", "추정량", "추정값", "점 추정", "구간 추정"],
    tables: [
      {
        caption: "추정(Estimation) — 표본으로부터 모수의 근사값을 결정하는 것",
        headers: ["구분", "설명"],
        rows: [
          ["모수적 추정(Parametric Estimation)", "모집단이 특정한 분포를 따르는 것으로 가정하고, 그 분포를 결정하는 매개변수(모수)를 추정하는 방법"],
          ["비모수적 추정(Non-parametric Estimation)", "모집단의 특정한 분포를 가정하지 않고, 데이터를 통해 직접적으로 모집단의 특성을 추정하는 방법"],
        ],
      },
      {
        caption: "추정 방법 [점구]",
        headers: ["방법", "설명", "기법"],
        rows: [
          ["점 추정(Point Estimation)", "모집단의 모수를 하나의 값으로 추정하는 방법. 추정치가 구체적이지만 불확실성은 전달하지 못함", "최대 우도 추정(MLE), 모멘트 추정법(MOM), 베이지안 점 추정(MAP)"],
          ["구간 추정(Interval Estimation)", "모집단의 모수가 특정 구간 안에 있을 것이라는 신뢰 구간을 제시하는 방법. 추정의 불확실성을 표현", "신뢰 구간(Confidence Interval)"],
        ],
      },
      {
        caption: "추정량의 조건 [불효일충]",
        headers: ["조건", "설명"],
        rows: [
          ["불편성(Unbiasedness)", "기대값이 실제 모수 값과 동일"],
          ["효율성(Efficiency)", "불편한 추정량 중에서 분산이 가장 작은 추정량"],
          ["일치성(Consistency)", "표본의 크기가 커질수록 추정량이 실제 모수에 수렴"],
          ["충분성(Sufficiency)", "통계량만으로도 모수에 대한 충분한 정보를 제공"],
        ],
      },
      {
        caption: "불편추정량",
        headers: ["구분", "설명"],
        rows: [
          ["표본평균의 추정량", "E(X̄) = (x₁+x₂+…+xₙ)/n = a — 표본평균은 모수와 동일한 특성으로 인해 불편추정량임"],
          ["표준분산의 추정량", "V(X̄) = [(x₁−a)²+(x₂−a)²+…+(xₙ−a)²]/(n−1) — 표준분산은 분모를 n으로 나누게 되면, 모수의 표준분산과 달라지게 되어, 불편추정량 생성을 위해 n−1(자유도)로 나누어야 함"],
        ],
      },
    ],
    notes: ["자유도: 모집단에 대한 정보를 제공하는 독립된 표본의 수. 예) x + y + z = 10 방정식에서, x와 y값을 알면 z는 자동으로 결정 — 즉, 2개의 값만 알면 자동으로 알 수 있는 것으로, 예시는 자유도 2"],
  },
  {
    title: "연관성 분석(association analysis) - 기초통계",
    course: "ST",
    definition: "조사 대상에서 수집한 자료의 척도를 기준으로 변수들 간의 어떤 관계가 있는지 판단하기 위한 분석",
    defShort: "자료 척도 기준으로 변수 간 관계를 판단하는 분석",
    keywords: ["관계", "척도", "카이제곱 검정", "관측빈도", "기대빈도", "자유도", "기각역", "상관계수", "상관분석", "공분산"],
    tables: [
      {
        caption: "연관성 분석 유형",
        headers: ["분석 구분", "분석 방법", "척도", "설명"],
        rows: [
          ["교차분석", "교차분석", "명목척도", "두 범주형 자료 간에 상호 관련성(독립인지 아닌지)을 교차분할표를 이용해 분석하는 방법. 범주형 변수들 간의 관계를 분석하기 위해 사용"],
          ["상관분석", "스피어만 서열 상관분석", "서열척도", "서열척도로 구성된 변수 간의 선형적인 상관 관계를 파악하기 위한 통계 방법"],
          ["상관분석", "피어슨 상관분석", "등간척도·비율척도", "두 연속형 변수 간의 선형적인 상관 관계를 파악하기 위한 통계 방법"],
          ["상관분석", "편상관분석", "등간척도·비율척도", "제 3의 변수를 통제하는 상태에서 두 변수의 상관관계를 분석하는 방법"],
        ],
      },
      {
        caption: "교차 분석(Cross-tabulation analysis)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "범주형으로 구성된 자료들 간에 교차 표를 만들어 관계를 확인하는 분석 방법. 카이제곱 검정(Chi Squared Test)라고 부르기도 함"],
          ["교차표", "교차표를 통해 각 범주형 항목간 빈도를 나타낸 표. 관측빈도, 기대빈도"],
          ["유형", "적합도 검정, 독립성 검정, 동질성 검정"],
        ],
      },
      {
        caption: "상관 분석(correlation analysis)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "조사 목적에 맞게 구성된 변수들 간의 연관성을 분석하는 방법"],
          ["분석방법", "두 변수 간에 어떤 선형적 관계를 가지는지 분석하는 기법으로 상관계수(correlation coefficient)를 이용해 측정"],
          ["산포도", "양의 상관관계 / 상관관계 없음 / 음의 상관관계 — r이 0일 경우 선형관계 아님"],
          ["상관계수 유형", "피어슨, 켄달, 스피어만"],
        ],
      },
    ],
  },
  {
    title: "회귀분석(Regression Analysis)",
    course: "ST",
    definition: "특정 변수가 다른 변수에 어떤 영향을 미치는지 수학적 모형으로 설명, 예측 기법",
    defShort: "변수 간 영향을 수학적 모형으로 설명·예측하는 기법",
    keywords: ["선형성", "독립성", "등분산성", "정규성", "변수간 관계 모델링 및 예측"],
    tables: [
      {
        caption: "개념도 [선형회귀 예시]",
        headers: ["구분", "설명"],
        rows: [
          ["독립변수", "입력값 또는 원인을 설명하는 변수"],
          ["종속변수", "결과값 또는 효과를 설명하는 변수"],
          ["회귀선(회귀계수)", "독립변수가 주어질 때의 종속변수의 기댓값으로 일반적으로 최소제곱법 이용. y = ax + bx + … + c ((a, b, …)는 회귀계수, c는 y절편)"],
        ],
      },
      {
        caption: "회귀분석의 가정 [선정독등공] — 1~4 모두 만족해야 함",
        headers: ["가정", "설명"],
        rows: [
          ["(1) 선형성(Linearity)", "독립변수와 종속변수 간에 선형적인 관계가 있어야 함을 의미"],
          ["(2) 잔차 정규성(Normality)", "잔차의 기댓값은 0이며 정규분포를 따라야 함을 의미"],
          ["(3) 잔차 독립성(Independence)", "관측치들 간에 상관관계가 없어야 함을 의미"],
          ["(4) 잔차 등분산성(Homoscedasticity)", "잔차의 분산이 독립변수의 값에 상관없이 일정해야 함을 의미"],
          ["(5) 다중 공선성(Multicollinearity)", "다중 회귀분석을 수행할 경우 3개 이상의 독립변수 간에 상관관계로 인한 문제가 없어야 함을 의미. 독립변수 선택: 전진선택법, 후진소거법, 단계적 선택법"],
        ],
      },
      {
        caption: "회귀분석의 유형 [단다일다선로공분 리라엘]",
        headers: ["구분", "유형"],
        rows: [
          ["독립변수 기준", "단순 회귀분석, 다중 회귀분석"],
          ["종속변수 기준", "일변량 회귀분석, 다변량 회귀분석"],
          ["종속변수 형태", "선형 회귀분석, 로지스틱 회귀분석"],
          ["분산 형태", "공분산 분석, 분산분석"],
          ["정규화", "리지 회귀분석, 라쏘 회귀분석, 엘라스틱넷 회귀분석"],
        ],
      },
      {
        caption: "평가 및 진단방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["모델 설명력", "결정계수(R²)", "독립 변수가 종속 변수를 얼마나 설명하는지 비율로 나타낸 지표"],
          ["모델 설명력", "AIC/BIC", "모델의 적합도 평가 지표로 과적합 방지 위한 복잡성 고려"],
          ["변수 유의성", "p-value", "독립 변수가 종속 변수에 미치는 영향이 유의미한지 통계적 평가"],
          ["변수 유의성", "다중 공선성", "독립 변수들 간 상관성이 높은 경우를 진단"],
          ["오차진단", "잔차 분석", "관측값과 예측값의 차이(잔차)를 분석하여 오차패턴 진단"],
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
    defShort: "모델 적합도와 복잡도를 함께 고려한 모델 선택 지표",
    keywords: ["회귀", "모델 적합도·복잡도 균형 평가 기준"],
    tables: [
      {
        caption: "AIC — 수식 AIC = −2log(likelihood) + 2p",
        headers: ["구분", "설명"],
        rows: [
          ["−2Log(Likelihood)", "모형의 적합도. Likelihood가 커질수록 AIC는 작아짐"],
          ["2p", "모형에 인가하는 패널티(2의 배수). p: 변수(파라미터) 개수. p가 작을수록 AIC는 작아짐"],
          ["방법 — AIC 최소화", "AIC 최소화되는 Likelihood와 p 결정. 일반적으로 Likelihood가 클수록 좋고, 적은 수의 변수(p)로 잘 설명할수록 좋은 모델임"],
          ["방법 — 변수 개수(p)에 따른 우도결정", "변수 개수에 따른 Bias와 Variance 관계에서 최적의 모델 선택을 위한 균형점 제시. Bias: 변수를 제거하면서 생기는 오류 / Variance: 변수가 증가하면서 생기는 오류"],
        ],
      },
      {
        caption: "BIC — 수식 BIC = −2log(likelihood) + log(n)p",
        headers: ["구분", "설명"],
        rows: [
          ["−2Log(Likelihood)", "모형의 적합도. Likelihood가 커질수록 BIC는 작아짐"],
          ["Log(n)p", "모형에 인가는 패널티(log(n)의 배수). p: 변수(파라미터) 개수, n: 데이터 값 개수. p가 작을수록 BIC는 작아짐"],
          ["방법 — AIC 보완하여 변수 개수 중점", "AIC 수식에서 패널티 부분 수정 — n이 8보다 큰 경우 2p < log(n)p 성립(즉, n이 8보다 큰 데이터 셋을 가지면 BIC가 AIC보다 변수 개수에 더 민감하게 반응). 표본이 커질수록 정확해지며, 변수 개수를 줄이는 것에 중점을 두고 싶다면 BIC 참고"],
        ],
      },
      {
        caption: "AIC와 BIC 비교",
        headers: ["비교 항목", "AIC", "BIC"],
        rows: [
          ["목적", "예측 성능 중심", "모델의 진실성 중심 (모델 간 비교)"],
          ["패널티 항목", "2p", "log(n)p"],
          ["패널티", "비교적 낮음으로 과적합 위험 있음", "더 강한 패널티로 단순한 모델 선호"],
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
    defShort: "표본 근거로 모집단 가설의 채택·기각을 통계적으로 판정하는 방법",
    keywords: ["귀무가설", "대립가설", "검정통계량", "유의확률", "기각역", "귀무가설 기각", "귀무가설 채택"],
    tables: [
      {
        caption: "절차",
        headers: ["단계", "내용"],
        rows: [
          ["1단계", "(통계)가설 H₁과 H₀의 설정"],
          ["2단계", "통계분석방법 및 검정통계량 선택"],
          ["3단계", "통계적 유의 수준(α) 결정"],
          ["4단계", "통계분석(검정통계량 계산)"],
          ["5단계", "계산된 검정통계량의 p값을 유의수준(α)과 비교"],
          ["6단계", "H₀의 기각 혹은 수용 결정"],
        ],
      },
      {
        caption: "용어",
        headers: ["구분", "설명"],
        rows: [
          ["Ho", "귀무가설/영가설(예. 교육자소득 ≤ 비교육자소득). 직접 검정 대상이 되는 가설. 귀무가설은 옳다는 가정하에 시작"],
          ["H₁", "대립가설/연구가설(예. 교육자소득 > 비교육자소득). 귀무가설에 대립되는 가설. 새로운 주장 또는 실제로 입증하고자하는 가설"],
          ["통계분석 방법", "표본통계량의 표본분포, 검정통계량 계산 등 고려한 방법"],
          ["검정통계량", "표본통계량이 Ho 에서 모수에 대해 예측하는 수준에 얼마나 근접했는지 판단하게 해주는 수치. 유형: Z통계량, t통계량, χ²통계량, F통계량"],
          ["유의수준(α, 알파값)", "Ho(귀무가설)이 참이라는 전제하에 표본에서 계산된 검정통계량값이 표본분포에서 관찰될 확률"],
          ["임계치", "가설기각과 비기각(수용)지역을 구분하는 검정통계량 값"],
          ["기각/수용", "Ho 기각: p-value ≤ 유의수준 or 검정통계량 값 ≥ 임계치 / Ho 수용: p-value ≥ 유의수준 or 검정통계량 값 ≤ 임계치"],
          ["검정 유형", "좌측검정, 우측검정, 양측검정. Z검정, t검정, χ²검정, F검정"],
        ],
      },
      {
        caption: "P-value와 오류",
        headers: ["구분", "귀무가설이 사실", "대립가설이 사실"],
        rows: [
          ["귀무가설 채택", "옳은 결정", "제 2종 오류(β)"],
          ["귀무가설 기각", "제 1종 오류(α)", "옳은 결정"],
        ],
      },
      {
        caption: "1종·2종 오류",
        headers: ["오류", "설명"],
        rows: [
          ["제 1종 오류(α)", "귀무가설이 옳은데 귀무가설을 기각할 확률"],
          ["제 2종 오류(β)", "귀무가설이 거짓인데 귀무가설을 기각 못할 확률"],
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
    defShort: "세 집단 이상의 평균 차이를 F검정으로 판정하는 분산분석",
    keywords: ["분산분석", "후속검정", "F검정", "F분포", "F검정량", "단일변량 분산분석", "다변량 분산분석"],
    tables: [
      {
        caption: "ANOVA 조건 [정등독]",
        headers: ["구분", "특성", "설명"],
        rows: [
          ["조건", "정규성", "모집단 분포가 모두 정규분포여야 함"],
          ["조건", "등분산성", "모집단 간 분산이 모두 동일해야 함"],
          ["조건", "독립성", "독립변수의 범주가 세 집단 이상이어야 함"],
          ["예외", "정규성", "빅데이터급 데이터면 정규분포 증명 예외"],
          ["예외", "등분산성", "분산비 4이하면 등분산성 증명 예외"],
        ],
      },
      {
        caption: "F검정",
        headers: ["구분", "설명"],
        rows: [
          ["F검정", "두 모집단의 분산에 대한 차이가 통계적으로 유의한가를 판별하는 검정기법"],
          ["F-분포", "2개 이상의 표본평균들이 동일한 모평균을 가진 집단에서 추출되었는지 아니면 서로 다른 모집단에서 추출된 것인지를 판단하기 위하여 이용"],
          ["F 검정량", "두 집단의 샘플 분산의 비율. F 검정량이 커질수록 집단내 분산, 설명된 분산이 상대적으로 크다는 뜻이며 이는 그룹 간의 평균 차가 크지 않고 유사함을 의미"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "개념도 사례", "독립변수", "종속변수"],
        rows: [
          ["단일변량 분산분석", "One Way ANOVA", "한 개의 집단 구분 독립 변수 분석 (급여 → 생산성)", "1개", "1개"],
          ["단일변량 분산분석", "Repeated Measures ANOVA", "집단에 대한 반복 측정 분석 (급여 → 생산성, 1개월/3개월/6개월 후)", "1개", "1개"],
          ["단일변량 분산분석", "Two Way ANOVA", "두 개의 집단 구분 독립 변수 분석 (급여+나이 → 생산성)", "2개", "1개"],
          ["단일변량 분산분석", "Multi Way ANOVA", "다수의 집단 구분 독립 변수 분석 (급여+나이+성별·지역 등 → 생산성)", "3개 이상", "1개"],
          ["다변량 분산분석", "Multivariate ANOVA", "한 개의 집단 구분 독립 변수와 두 개 이상의 종속 변수 분석 (급여 → 생산성+만족도)", "1개", "2개 이상"],
        ],
      },
    ],
  },
  {
    title: "뮤테이션 테스트 (Mutation Test)",
    course: "SE",
    definition:
      "소스 코드 구문을 일정한 규칙으로 변형 후, 원본 프로그램으로 테스트할 때와 동일한 입력 값으로 서로 다른 결과를 출력시키는 테스트케이스를 선정하여 수행하는 결함 기반 테스트",
    defShort: "코드를 의도적으로 변형해 테스트케이스의 결함 검출력을 검증하는 테스트",
    keywords: ["정상 코드", "돌연변이 코드(뮤턴트)", "테스트 케이스 검증", "의도적 소스 변경", "뮤턴트 연산자", "뮤턴트 스코어"],
    tables: [
      {
        caption: "Test Case 추출 방법",
        headers: ["결과", "설명"],
        rows: [
          ["R1 = R2", "뮤테이션 식별 불가. 결함 발견 불가. Test case 제외"],
          ["R1 ≠ R2", "뮤테이션 식별 가능. 결함 발견 가능. Test case set 포함"],
        ],
      },
      {
        caption: "Mutation 연산자의 종류",
        headers: ["연산자", "연산자 사례", "설명"],
        rows: [
          ["대치", "상수 대치, 변수 대치, 상수 ↔ 변수 대치", "변수, 상수, 배열 등을 다른 값으로 대치"],
          ["변형(치환)", "입출력 값 변경, 서비스 순서 변경", "입력, 출력의 순서 변경, 속성 등의 변경"],
          ["삭제", "Cast 연산자 삭제, Overload 함수 삭제", "특정 함수, 변수, 연산자, 반환문 등을 삭제"],
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
    defShort: "주어진 환경에서 요구사항 목표치 달성 여부를 확인하는 테스트",
    keywords: ["요구사항 목표치 달성 여부 확인", "TPS", "응답시간", "부하/스파이크 테스트"],
    tables: [
      {
        caption: "프로세스",
        headers: ["단계", "구간"],
        rows: [
          ["요구사항 정의 → 성능테스트 계획", "성능테스트 계획"],
          ["성능테스트 설계 → 성능테스트 구현", "성능테스트 설계/구현"],
          ["성능테스트 수행 → 성능테스트 종료", "성능테스트 수행/종료"],
        ],
      },
      {
        caption: "성능 지표",
        headers: ["성능지표", "설명", "측정단위", "목표"],
        rows: [
          ["응답시간(Response Time)", "작업 요청시간에서 결과가 응답되기까지의 시간", "초", "낮춤"],
          ["시간당 처리량(Throughput)", "성공적으로 처리한 단위시간 당 요청건수", "TPS, OPS", "높임"],
          ["자원사용량(Utilization)", "CPU, 메모리 등 자원들의 용량 중 실제 사용하고 있는 비율", "%", "낮춤"],
          ["효율성(Efficiency)", "시간 당 처리량을 자원사용량 또는 비용으로 나눈 값", "%, tpmc", "높임"],
          ["반환시간(Turnaround Time)", "시스템에 도착한 시점부터 완료 및 사용자에게 반환되는 시간", "초", "낮춤"],
          ["가용도(Availability)", "자원을 사용할 수 있는 확률(MTBF, MTTR)", "%", "높임"],
          ["신뢰도(Reliability)", "장애가 발생하지 않을 확률", "%", "높임"],
        ],
      },
      {
        caption: "성능 테스트 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["테스트 방법 측면", "Load Test", "일정시간 동안 부하를 가하여 최대 TPS와 응답시간 산출"],
          ["테스트 방법 측면", "Stress Test", "정상 상황보다 더 많은 부하를 가하여 시스템의 최대 수용범위 측정"],
          ["테스트 방법 측면", "Spike Test", "특정시점에 순간적으로 대량의 트랜잭션 동시 발생"],
          ["테스트 방법 측면", "Endurance Test", "긴 시간동안 부하를 가하여 시스템 내구성을 테스트"],
          ["테스트 방법 측면", "Breakpoint Test", "부하를 점진적으로 증가시켜, 시스템의 장애발생 시점 테스트"],
          ["테스트 방법 측면", "Loop back Test", "특정위치에 Loop back code 삽입, 병목지점 도출하는 테스트"],
          ["테스트 방법 측면", "Availability Test", "시스템 이중구성의 상태에서 장애 유도 후 장애로 인한 서비스전환 동작 여부 테스트"],
          ["테스트 목적 측면", "단위 성능 테스트", "테스트 대상 시스템을 업무 단위로 각각 테스트 수행"],
          ["테스트 목적 측면", "복합 성능 테스트", "시스템이 사용되는 상황을 재현하여 테스트 수행"],
          ["테스트 목적 측면", "임계 성능 테스트", "시스템이 최대로 발휘할 수 있는 성능을 테스트"],
          ["테스트 목적 측면", "확장성테스트", "증설한 시스템의 성능 비율 측정"],
        ],
      },
    ],
  },
  {
    title: "퍼징 테스트 (Fuzzing Test)",
    course: "SE",
    definition:
      "제품에 랜덤 데이터를 입력하여 발생되는 예외, 오류 등을 분석, 보안 취약점을 찾아내는 테스팅 기법",
    defShort: "랜덤 데이터를 입력해 예외·오류를 분석, 보안 취약점을 찾는 테스트",
    keywords: ["Valid Case Fuzzing", "Invalid Case Skip Fuzzing", "Invalid Case Fail Fuzzing", "보안취약점", "블랙박스", "화이트박스"],
    tables: [
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1) 테스트 대상 분석", "분석 대상 시스템의 식별 및 특징 분석 — Application, Framework, 네트워크 프로토콜, source code, 역공학"],
          ["2) 입력 값 선정", "오류를 유발시킬 수 있는 입력값을 선정 — 미디어 파일, 다큐먼트 파일, 프로토콜, 비정상 입력값"],
          ["3) 테스트 케이스 생성", "입력값에 대한 테스트 케이스 생성 — 제너레이션, 뮤테이션 (Tool: FuzzBox, Seed gathering)"],
          ["4) 테스트 실행", "테스트 케이스를 입력하여 프로그램 실행 — Command line 인터페이스"],
          ["5) 시스템 동작 모니터링", "문제 발생시 로그 수집 (System log, kernel log, Crash call stack)"],
          ["6) 문제 분류 및 해결", "문제 발생 항목 점검, 원인 분석 및 코드 수정 — Null pointer dereferencing, divide by 0, buffer overflow"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["데이터 생성", "Dumb Fuzzing", "기존 데이터 변경(Mutate) 기반 테스트 데이터 정의"],
          ["데이터 생성", "Smart Fuzzing", "Input 모델에 기반한 새로운 유형의 테스트 데이터 정의"],
          ["데이터 생성", "Evolutionary", "응답 결과에 따라 새로운 데이터를 생성"],
          ["데이터 투입", "Valid Case Fuzzing", "유효(Valid) 명세에 따라 생성된 데이터를 통해 정상동작 여부 확인"],
          ["데이터 투입", "Invalid Case Skip Fuzzing", "자체적으로 비정상 입력을 처리하지 못하는 경우와 해당 테스트 케이스를 수행하지 못하는 경우 skip 여부 확인 테스트"],
          ["데이터 투입", "Invalid Case Fail Fuzzing", "비정상 테스트 데이터 투입 후 시스템 Fail 유도, 이후 정상테스트 투입 시스템 정상 응답 체크. 비정상 데이터 입력 후 미응답시, Valid Data를 전송하여 시스템이 살아있는지 체크"],
          ["변조 대상", "Mutation based Fuzzing", "비정상 변조데이터 대량으로 투입하는 휴리스틱 Fuzz테스팅"],
          ["변조 대상", "Generation based Fuzzing", "구조변형을 기반으로 한 Fuzz테스팅"],
          ["테스팅 기법", "블랙박스 퍼징", "시스템 내부를 분석하지 않고 무작위 입력값을 통한 퍼즈 테스팅"],
          ["테스팅 기법", "화이트박스 퍼징", "소스 코드 기반으로 시스템을 분석 후 입력값을 산출하는 퍼즈 테스팅"],
          ["테스팅 기법", "그레이박스 퍼징", "시스템의 내부구조를 일부만 알고 이 정보를 기반으로 입력값을 생성하여 블랙박스 테스트 수행"],
        ],
      },
    ],
  },
  {
    title: "리그레이션(회귀, Regression) 테스트",
    course: "SE",
    definition:
      "프로그램에 수정, 확장후 변경 부분 뿐만 아닌 기존 기능도 같이 테스트하여 오류사항 검출하는 테스트 기법",
    defShort: "수정·확장 후 기존 기능까지 함께 테스트해 오류를 검출하는 기법",
    keywords: ["프로그램 수정/확장", "변경 외 기존 기능 테스트", "종류(Reset All, Selective, Priority)", "Ripple Effect", "Side Effect"],
    tables: [
      {
        caption: "회귀 테스트의 종류",
        headers: ["종류", "수행방법", "분야"],
        rows: [
          ["Reset All 기법", "기 축적된 테스트 케이스를 전부 사용", "금융/대고객 업무등 고위험"],
          ["Selective 기법", "변경 대상 위주로 영향 범위 결정후 테스트", "일반 기업 시스템"],
          ["Priority 기법", "시스템의 핵심 기능 위주로 우선순위화 테스트", "저위험도 시스템"],
        ],
      },
      {
        caption: "회귀 테스트 검출 오류 종류",
        headers: ["검출 오류", "설명"],
        rows: [
          ["Ripple Effect(파급효과)", "오류제거나 수정을 위해서 변경된 내용이 이와 연관된 다른 부분으로 영향이 전파되어 변경되는 현상"],
          ["Side Effect(부작용)", "오류제거나 수정작업이 의도한 대로 이루어 졌으나 미처 고려하지 못한 다른 부분에서 의도치 않은 또 다른 결과가 발생하는 현상"],
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
    defShort: "인간과 구별 불가한 기계의 지적 능력을 확인하는 모방 게임 테스트",
    keywords: ["기계의 사고 능력 판별"],
    tables: [
      {
        caption: "절차도 및 세부 절차",
        headers: ["단계", "세부 절차", "설명"],
        rows: [
          ["1", "테스트 환경 구축", "차단된 2개의 방에 한쪽엔 인공지능, 다른 한쪽엔 피실험자 위치. 격리된 공간에 제 3의 심사위원 위치"],
          ["2", "테스트 수행", "피실험자 B와 인공지능 A가 화면을 통해 심사위원의 질문에 대해 문자로 답변. 서로는 서로에 대한 정보가 없음. 약 5분 수요"],
          ["3", "테스트 평가", "A,B의 대화를 듣고, 어느 쪽이 사람인지 심사위원들이 알 수 없다면, 인공지능은 생각 할 수 있는 것으로 평가"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["구분", "활용 사례", "설명"],
        rows: [
          ["이미지 인식분야", "CAPTCHA", "접근 사용자가 컴퓨터 프로그램인지 실제 사람인지 구별하기 위해 사용하는 방법"],
          ["이미지 인식분야", "구텐베르크 프로젝트", "인류 자산인 문학작품들을 전자화 및 배포하는 프로젝트. 전자화 과정중에 컴퓨터 인식이 어려운 부분을 Captcha 형식으로 접속 사용자에게 인식하도록 활용"],
          ["의료 분야", "엘리자(Eliza)", "1966년 조셉 와이젠바움이 만든 인공지능 소프트웨어. Doctor 모드에서 질문자의 진술을 키워드로 관련 질문을 만들어 심리 상담 프로그램 활용"],
          ["의료 분야", "패리(Parry)", "1972년 정신의학자 케네스 콜비가 만든 정신분열증 환자를 모사한 프로그램. 실제 엘리자와 서로 대화 나눈 기록"],
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
    defShort: "키워드 테스트 케이스로 자동 실행하는 ISO 29119 Part 5 표준 테스트 기법",
    keywords: ["편집기", "해석기", "데이터 시퀀서", "툴 브릿지", "실행 엔진", "테스트 대상", "테스트 라이브러리 저장소", "테스트 데이터 저장소"],
    tables: [
      {
        caption: "프레임워크 구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["테스트 라이브러리 저장소", "하나 이상의 프로젝트나 해당 프로젝트 중 일부의 키워드를 저장"],
          ["테스트 데이터 저장소", "키워드 테스트 케이스와 테스트 케이스에서 사용하는 테스트 데이터, 키워드 테스트 케이스 실행 코드를 위한 스크립트를 저장"],
          ["편집기", "키워드 테스트 라이브러리를 이용하여 테스트 케이스를 키워드 테스트 케이스로 작성하는데 사용"],
          ["해석기와 데이터 시퀀서", "복합 키워드 사용시 상위 레벨 키워드의 시퀀스로 구성된 키워드 테스트 케이스를 하위 레벨 키워드의 시퀀스로 변환하는 역할"],
          ["툴 브리지", "테스트 케이스나 테스트 라이브러리에 사용된 키워드가 테스트 환경에서 동작하도록 지원"],
          ["실행엔진", "키워드와 연관된 기능을 수행하여 테스트 케이스를 실행"],
          ["SUT", "System Under Test, 테스트 대상이 되는 소프트웨어"],
        ],
      },
      {
        caption: "Keyword Driven Testing 절차",
        headers: ["절차", "수행내용"],
        rows: [
          ["키워드 정의", "주어진 요구사항에서 계층을 결정하고 각 계층의 정의 또는 범위를 기반으로 계층에서 키워드를 식별"],
          ["키워드 테스트 케이스 작성", "사용자 키워드와 테스트 라이브러리에서 제공하는 키워드로 변수와 테스트 데이터를 이용하여 작성"],
          ["키워드 테스트 케이스 실행", "키워드 자동화 수행 툴을 이용하여 테스트 케이스를 실행"],
          ["키워드 리팩토링", "키워드 테스트 케이스를 유지 보수"],
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
    defShort: "실 서비스에 인위적 혼돈을 주입해 숨은 아키텍처 문제를 찾는 테스트",
    keywords: ["[정가실결문]", "카오스 엔지니어링 팀", "정상 상태", "가설수립", "실험 디자인", "결과확인", "문제점 수정"],
    tables: [
      {
        caption: "상세 절차 [정가실결문]",
        headers: ["절차", "설명", "사례"],
        rows: [
          ["1) 정상 상태", "시스템의 측정 가능한 값을 이용해 정상적인 동작 상태를 정량적으로 측정", "CPU load, NW I/O, Memory Utilization"],
          ["2) 가설 수립", "항상 정상적인 상태를 유지한다는 가설 기반으로 주요 테스트 시나리오 작성", "DB 다운, 접속 초과, DDoS 공격"],
          ["3) 실험 디자인", "실험 가설 선택, 실험 범위/규칙 설정. 측정 지표 선정, 실험 계획 알림", "작업 범위 (최소단위), 롤백 계획, 폭발 최소화"],
          ["4) 결과확인", "정상 지표와 테스트 결과 비교하여 가설 검증 및 문제점 확인", "장애 감지 시간, 전파, 알림, 복구 시간"],
          ["5) 문제점 수정", "발생된 문제점에 대해 문제점을 수정 및 지속적으로 개선", "45분간 접속 지연 발생, SLA 충족 못함"],
        ],
      },
      {
        caption: "효율적 카오스 테스트 수행 방안",
        headers: ["구분", "내용"],
        rows: [
          ["Team 구축", "Chaos Engineering Team"],
          ["도구 활용", "Chaos Monkey, Kube Monkey, GameDay, Failure Injection, ChAP, Gremlin"],
          ["Layer별 테스트", "개발팀, 애플리케이션, 스위칭, 인프라"],
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
    defShort: "여러 버전에 동일 입력을 주고 결과 불일치를 비교하는 테스트",
    keywords: ["Testcase작성/테스트 수행/결과값 비교/원인 분석", "자동차", "항공기 분야 사용"],
    tables: [
      {
        caption: "상세 절차",
        headers: ["상세 절차", "설명"],
        rows: [
          ["① Test Case 작성", "수행될 Test Case를 작성"],
          ["② 테스트 수행", "Test Case를 바탕으로 테스트 시스템에 대하여 병렬 테스트를 수행"],
          ["③ 결과값 비교", "각각의 테스트 시스템에서 출력되는 결과값을 비교"],
          ["④ 원인 분석", "테스트 결과 값이 불일치한다면, 불일치 원인에 대하여 분석"],
        ],
      },
      {
        caption: "자동차 분야의 모델 — 코드간 back-to-back test 수행",
        headers: ["절차", "설명"],
        rows: [
          ["모델 분석", "MATLAB/Simulink 모델을 분석하여 적절한 크기의 Sub model로 세분화 시키고, sub-model 별 In/Out 파라미터와 데이터 값 분석"],
          ["테스트 케이스 작성", "각 서브 모델의 제어흐름을 고려하여 Test Case 작성"],
          ["모델 테스트 케이스 수행", "테스트 케이스 모델을 수행하여 도출된 출력 데이터 및 테스트 커버리지 측정. 계획된 커버리지 목표에 도달하지 못할 경우 추가적 테스트 케이스 보완하여 수행"],
          ["소스코드 테스트 케이스 수행", "소스코드가 수행될 수 있는 환경을 설정하고, 테스트 케이스를 수행. 수행 결과로 나오는 출력 데이터 및 커버리지 측정"],
          ["결과 비교 및 리포트", "각 테스트 케이스 별 모델/코드간 출력 데이터를 비교하여 일치성 여부 판단"],
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
    defShort: "계획→케이스 설계→실행→결과 분석→오류 수정의 테스트 5단계",
    keywords: ["[계케실결오]", "IEEE 829"],
    tables: [
      {
        caption: "5단계 프로세스 [계케실결오]",
        headers: ["절차", "세부 단계", "설명", "산출물"],
        rows: [
          ["테스트 계획", "1.테스트 요구사항 수립 2.테스트 계획 작성 3.테스트 계획 검토", "1.테스트 목표 수립, 테스트 대상 및 범위 선정 2.테스트 전략, 일정, 보고를 위한 테스트 계획서 작성 3.작성된 테스트 계획을 정제, 테스트 계획을 확정", "테스트 요구사항 정의서, 테스트 계획서"],
          ["테스트 케이스 설계", "1.테스트 케이스 설계기법 정의 2.테스트 케이스 도출 3.원시 데이터 수집", "1.테스트 케이스를 설계하기 위한 기법을 정의 2.정의된 테스트 종류 및 테스트 케이스 설계 기법을 이용하여 테스트 케이스 도출 3.정의된 테스트 케이스를 수행하기 위한 적절한 원시 데이터를 작성", "테스트 케이스 설계 기법 명세서, 테스트 케이스 설계 명세서, 원시 데이터"],
          ["테스트 실행 및 측정", "1.테스트 환경 구축 2.테스트 케이스 실행 및 측정", "1.테스트 계획서에 정의된 테스트 환경 및 자원을 설정하여 테스트 실행을 준비 2.정의된 테스트 케이스를 실행하고 결과를 측정", "테스트 측정 결과"],
          ["결과 분석 및 보고", "1.측정결과 분석 2.테스트 결과 보고", "1.테스트 케이스의 수행 결과의 측정치 분석 2.테스트 측정 결과 분석서를 기본으로 테스트 결과 보고서를 작성", "테스트 케이스별 결과 분석서, 소프트웨어 상태 보고서, 테스트 결과 보고서"],
          ["오류 추적 및 수정", "1.Causal Effect 분석 2.오류 수정 계획 3.오류 수정 4.수정 후 검토", "1.테스트 결과 보고서에서 나온 테스트 결과를 확인하여 오류 지점을 분석 2.오류 수정 우선 순위를 결정하여 오류 수정 계획 작성 3.디버깅 도구 등을 이용하여 오류 수정 4.수정된 코드와 오류 수정 결과 및 테스트를 검토하여 수정의 정합성 검증", "오류 보고서, 오류수정 계획서, 오류수정결과 보고서, 오류가 수정된 대상물, 오류 수정 보고서"],
        ],
      },
    ],
  },
  {
    title: "ISO 29119",
    course: "SE",
    definition:
      "SW개발 생명주기 전 과정에 걸쳐 있는 테스팅 프로세스와 관련 산출물에 대한 국제 표준",
    defShort: "SW 생명주기 전 과정의 테스팅 프로세스·산출물 국제 표준",
    keywords: ["[개프도테키]", "개념", "프로세스", "문서화", "테스트 기법", "키워드 기반 테스팅"],
    tables: [
      {
        caption: "프레임워크 구성요소 [개프도테키]",
        headers: ["구분", "설명", "주요 항목"],
        rows: [
          ["Part 1. 개념과 정의(Concepts and Definitions)", "전체 시리즈에 대한 가이드 제공. 용어 정의, 소프트웨어 테스팅 개념. 8개 단락 구성", "소프트웨어 테스팅 소개 및 개념. 조직과 프로젝트 관점 소프트웨어 테스팅. SDLC 모델에서의 일반적 테스팅 프로세스. 위험 기반 테스팅. Test Subprocess, 테스트 사례, 테스트 자동화, 결함관리"],
          ["Part 2. 테스트 프로세스(Test Process)", "테스트 프로세스에 관한 부분. 조직, 테스트 관리, 동적 테스트의 세 가지 수준의 다계층 프로세스 모델 설명", "테스트 관리 프로세스(전략, 모니터링). 다계층 프로세스 모델(Multi-Layer Process Model). 조직의 테스트 프로세스(Organizational Test Process). 테스트 관리 프로세스(Test Management Process). 동적 테스트 프로세스(Dynamic Test Process)"],
          ["Part 3. 테스트 문서화(Test Documentation)", "테스트 문서 견본과 예시 제공. 테스트 프로세스 단계별 산출 문서 작성 방법과 포함될 내용 등 제공", "조직의 테스트 프로세스 문서. 테스트 관리 프로세스 문서. 동적 테스트 프로세스 문서"],
          ["Part 4. 테스트 설계 기법(Test Techniques)", "소프트웨어 테스팅 기법에 관한 부분. 테스트 설계 및 구현 단계에서 활용 가능한 명세 기반/구조 기반/경험 기반 테스트 설계 기법 제공", "테스트 설계 기법 — 명세 기반/구조 기반/경험 기반 테스트 설계 기법. 테스트 커버리지 측정. 명세/구조/경험 기반 테스트 설계 기법의 커버리지 측정"],
          ["Part 5. 키워드 주도 테스팅(Keyword-Driven Testing)", "키워드 주도 테스팅에 대한 소개와 접근 방법 제공. 키워드 주도 테스팅 위한 프레임워크, 도구에 대한 요구사항 등 다룸", "키워드 주도 테스팅 활용. 키워드 주도 테스팅 프레임워크. 키워드 주도 테스팅 이점과 관련 요구사항. 기본 키워드와 사례"],
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
    defShort: "AI 기반 시스템의 도입·테스트 방법 지침을 담은 ISO 기술보고서",
    keywords: ["AI 기반 시스템", "1~10 파트"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성", "설명"],
        rows: [
          ["1. Scope", "ISO/IEC TR 29119-11의 범위"],
          ["2. Normative references", "규범적 참조"],
          ["3. Terms, definitions and abbreviated terms", "본 문서의 목적을 위한 용어와 정의"],
          ["4. Introduction to AI and Testing", "AI 소개 및 AI 기반 시스템의 맥락에서 테스트 설명"],
          ["5. AI System characteristics", "AI 기반 시스템의 특성 소개. ISO/IEC 25010 품질 모델의 품질 특성은 부분적으로 AI 기반 시스템에 적용되지만 AI 기반 시스템만의 특성 존재"],
          ["6. Introduction to the testing of AI-based systems", "일반적인 AI 기반 시스템은 기존의 소프트웨어로 둘러싸인 하나 이상의 AI 구성요소 구성. 순수한 AI 부품도 소프트웨어로 구현되어 있어 일반적인 소프트웨어와 동일한 결함 가능. AI 기반 시스템에 대한 테스트 방법 소개"],
          ["7. Testing and QA of ML systems", "ML과 직접 관련된 품질 보증 및 시험 기회를 간략하게 설명"],
          ["8. Black-box testing of AI-based systems", "AI 기반 시스템의 블랙박스 테스트 방법 설명"],
          ["9. White-box testing of neural networks", "신경망에 대한 화이트 테스트 방법 설명"],
          ["10. Test environments for AI-based systems", "AI 기반 시스템의 테스트 환경은 일반적인 시스템의 테스트 환경과 많은 공통점 존재. ML 모델은 격리하여 시험할 때, 일반적으로 개발 프레임워크 내에서 시험"],
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
    defShort: "정량화 지표로 테스트 종료 시점을 정하는 테스트 완료 조건",
    keywords: ["완전성", "목적", "기준", "커버리지", "리스크", "스케쥴"],
    tables: [
      {
        caption: "기본 원칙",
        headers: ["구분", "대상", "기본 원칙"],
        rows: [
          ["구현", "어플리케이션 기능", "요구된 서비스(기능)의 정상 동작 여부"],
          ["구현", "어플리케이션 산출물", "어플리케이션 문서의 작성 및 최신화 유지"],
          ["단계", "Bugs의 100% 해결", "우선순위 높은 Bugs의 100% 해결"],
          ["단계", "Test Entry Criteria", "빌드 및 개발자의 재테스트 완료 시점"],
        ],
      },
      {
        caption: "완료 조건 [완목기커리스]",
        headers: ["완료조건", "설명", "사례"],
        rows: [
          ["테스트 완전성", "모든 테스트 Case가 수행되고, 심각한 Defect가 발견되지 않았을 때", "TC 650개 완료 중 Critical, Major Defect 미존재"],
          ["테스트 목적", "초기 정의된 품질 목표의 달성", "현업의 만족도 90% 이상"],
          ["테스트 기준", "테스터가 수립한 테스트 레벨 및 테스트 완료 조건 기준에 도달", "90%이상의 테스트케이스 만족 시"],
          ["테스트 커버리지", "Client의 요구사항이 모두 충족되었다고 판단될 때", "5가지 요구기능의 구현"],
          ["테스트 리스크", "예상되었던 모든 관련 Risk 제거가 완료되었을 때", "Defects 조치 속도의 미진함 해결"],
          ["테스트 스케쥴", "예정된 테스트 일정이 종료되었을 때", "테스트 종료일의 경과"],
        ],
      },
    ],
  },
  {
    title: "Lehman의 Software 변화의 원리",
    course: "SE",
    definition:
      "소프트웨어의 지속적 진화에 대해 3가지 Type으로 분류하고 그 진화에 대해 설명한 8가지 원리 (Software 변화의 법칙)",
    defShort: "SW의 지속적 진화를 3개 유형·8개 원리로 설명한 변화의 법칙",
    keywords: ["[변복진조친성품피]", "①계속 변경 ②복잡도 증가 ③프로그램 진화 ④조직적 안정화 ⑤친근성 유지 ⑥지속 성장 ⑦품질감소 ⑧피드백 시스템"],
    tables: [
      {
        caption: "Lehman의 System Type",
        headers: ["System Type", "특징", "설명"],
        rows: [
          ["S-Type (Static Type System)", "고정된 사양, 비진화", "고정되고 공식적인 사양으로 정의"],
          ["P-Type (Practical Type System)", "고정된 사양, 사양의 반복적 개선", "요구 사항을 정확하게 정의. System의 형태와 수용성은 환경에 의존적 System"],
          ["E-Type (Embedded Type)", "변화되는 사양 — Lehman의 원리 대상", "현실 세계의 문제를 해결하기 위한 System. Specification이 고정될 수 없는 Type"],
        ],
      },
      {
        caption: "Lehman의 Software 변화의 원리 [계복진조 친지감피]",
        headers: ["원리", "촉발 요인", "주요 내용"],
        rows: [
          ["계속적 변경(Continuing Change)", "사용 현실 반영, 품질 저하", "요구사항에 의해 계속적으로 변경되며, 그렇지 않을 경우 유용성이 저하"],
          ["복잡도 증가(Increasing Complexity)", "변경의 유용성 유지", "변경이 일어날수록 시스템의 구조는 점점 더 복잡화"],
          ["프로그램 진화(Program Evolution)", "4, 5 법칙의 일반화", "프로그램은 고유한 크기, 릴리즈 간격, 보고되는 에러의 개수는 변경 후에도 일정"],
          ["조직적 안정화(Organizational Stability)", "자원 투입 효과의 상한선", "시스템 생명주기 동안 개발 생산성은 일정. 특정 상한선을 넘어선 자원과 노력의 추가는 무의미"],
          ["친근성 유지(Conservation of Familiarity)", "사용성 유지", "시스템 생명주기 동안 시스템의 각 버전의 변화는 일정. System의 급격한 변화는 발생하지 않고 일정 차이로 변화"],
          ["지속적 성장(Continuing Growth)", "사용자 만족도", "사용자를 만족시키기 위해 지속적 기능 추가"],
          ["품질 감소(Declining Quality)", "운영 환경의 변화", "운영환경에 맞게 시스템을 변경시키지 않는다면 품질은 저하"],
          ["피드백 시스템(Feedback System)", "System의 환경 반영", "큰 폭의 제품개선을 위해 피드백 시스템으로 구성"],
        ],
      },
    ],
  },
  {
    title: "3R",
    course: "SE",
    definition:
      "소프트웨어 생산성을 극대화하기위해 레포지토리를 기반으로 역공학, 재공학, 재사용 기법을 사용하는 공학적 접근법",
    defShort: "레포지토리 기반 역공학·재공학·재사용의 생산성 극대화 접근법",
    keywords: ["레포지토리", "역공학", "재공학", "재사용"],
    tables: [
      {
        caption: "역공학(Reverse Engineering)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "자동화된 도구나 케이스를 활용하여 물리적 수준의 소프트웨어 정보를 논리적인 소프트웨어 정보로 추출하는 절차 및 행위"],
          ["절차", "1. Code 추출 → 2. Code 분석/수정 → 3. 문서화"],
          ["유형", "논리 역공학, 자료 역공학, 재문서화, 설계 복구"],
        ],
      },
      {
        caption: "재공학(Re-Engineering)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "자동화 도구를 활용하여 현재 구현 되어 있는 시스템을 검토 및 수정함으로써 시스템의 재설계, 교체를 진행하기 위한 절차 및 행위"],
          ["절차", "1. Reverse Engineering → 2. 재구조화 → 3. 구현"],
          ["유형", "CASE Tools, 재구조화, 재모듈화, 의미론적 정보 추출"],
        ],
      },
      {
        caption: "재사용(Re-Use)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "이미 개발 완료된 결과물(프로그램의 명령어, 모듈, 설계서, 요구 분석 기술 등)을 신규 개발 Software에 적용하기 위한 일련의 행위 및 절차"],
          ["필요 속성", "신뢰성, 확장성, 생산성, 사용성, 유지보수성, 적응성"],
          ["절차", "1. Forward Engineering → 2. Re-Use"],
          ["기법", "Library, Design Pattern, CBD"],
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
    defShort: "외부 기능은 그대로, 내부 구조를 단순화해 유지보수성을 높이는 기법",
    keywords: ["외부기능 변경없이 내부 구조 수정", "코드 스멜", "Move", "Extract", "Push Down", "Full Up"],
    tables: [
      {
        caption: "리팩토링 대상 [중긴큰긴산]",
        headers: ["대상", "설명"],
        rows: [
          ["중복된 코드", "한 곳 이상에서 중복된 코드가 존재"],
          ["긴 메소드", "메소드 처리 방법이 의미적 간격이 큰 구조"],
          ["큰 클래스", "한 클래스에 너무 많은 속성과 메소드가 존재"],
          ["긴 파라미터 리스트", "이해하기 어렵고 일관성이 없어 사용하기 어려운 파라미터 구조"],
          ["산탄총 수술", "특정 클래스를 수정 시 관련된 모든 클래스에서 변경이 발생"],
        ],
      },
      {
        caption: "리팩토링 기법",
        headers: ["측면", "기법", "설명"],
        rows: [
          ["결합도 측면", "Move", "Method가 정의된 클래스보다 다른 클래스에서 많이 사용하고 있으면 이동 — Move Method, Move Attribute"],
          ["결합도 측면", "Extract", "객체를 작은 단위로 분리 — Extract Class, Extract Method, Extract Interface"],
          ["응집도 측면", "Push Down", "서브 클래스만 사용하는 메소드나 속성 이전 — Push Down Method, Push Down Attribute"],
          ["응집도 측면", "Pull Up", "동일하게 사용하고 있는 메소드나 필드를 상위로 이전 — Pull up Method, Pull up Field"],
          ["응집도 측면", "Inline", "불필요한 객체를 삭제하고 기능을 사용하는 곳에 통합 — Inline Class, Inline Method"],
          ["단순화", "Rename Method", "Method Name이 그 목적에 맞게 이름을 변경"],
          ["은닉", "Encapsulate Field", "Public 필드가 있는 경우 그 필드를 Private으로 만들고 접근자를 제공"],
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
    defShort: "폐기 전 단계에서 오류 수정과 기능·수행력을 증진시키는 활동",
    keywords: ["계예응지", "데프문시", "수완예적"],
    tables: [
      {
        caption: "상세 절차",
        headers: ["절차", "설명", "담당자"],
        rows: [
          ["1", "변경요청서 작성(CR)", "사용자"],
          ["2", "변경요청서 검토, 영향도, 유지보수 우선순위결정", "분석가"],
          ["3", "분석결과에 따라 유지보수 승인, 실행에 대한 승인", "유지보수 관리 위원회"],
          ["4", "유지보수 수행, 변경보고서 작성, 관련 산출물 변경", "유지보수 담당"],
        ],
      },
      {
        caption: "유지보수 유형 [계예응지 / 데프문시 / 수완예적]",
        headers: ["분류기준", "종류", "설명"],
        rows: [
          ["시점에 의한 유지보수", "계획 유지보수", "주기적인 유지보수"],
          ["시점에 의한 유지보수", "예방 유지보수", "미리 예방 차원에서의 유지보수"],
          ["시점에 의한 유지보수", "응급 유지보수", "긴급한 경우의 유지보수, 사후 승인 필요"],
          ["시점에 의한 유지보수", "지연 유지보수", "시스템에 대해 변경된 부분에 대한 추후 지원"],
          ["대상에 의한 유지보수", "데이터 유지보수", "데이터의 Conversion 등의 필요시 처리"],
          ["대상에 의한 유지보수", "프로그램 유지보수", "프로그램의 변경 및 오류에 대한 처리"],
          ["대상에 의한 유지보수", "문서 유지보수", "문서 표준의 변경이나 기타 필요시"],
          ["대상에 의한 유지보수", "시스템 유지보수", "시스템의 변경 및 장애에 대한 처리"],
          ["원인에 의한 유지보수", "수정적 유지보수", "오류와 결함의 수정"],
          ["원인에 의한 유지보수", "완전적 유지보수", "기능 개선"],
          ["원인에 의한 유지보수", "예방적 유지보수", "정기적인 유지보수"],
          ["원인에 의한 유지보수", "적응적 유지보수", "변화, 갱신의 적용"],
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
    defShort: "SW 유지보수 프로세스를 6단계로 상세화한 국제 표준",
    keywords: ["수정/적응/완벽/예방 유지보수", "기법(SW 이해, 재공학, 역공학, 재구조화)", "유지보수 프로세스 단계"],
    tables: [
      {
        caption: "유지보수 프로세스",
        headers: ["프로세스", "설명"],
        rows: [
          ["공정구현", "유지보수 활동과 세부업무를 수행하기 위한 계획/절차 개발, 문서화, 형상관리 프로세스"],
          ["문제 및 수정분석", "1) 유형: 교정, 개선, 예방 또는 새로운 환경의 적응 등 2) 범위: 수정 규모, 소요비용, 수정 시간 등 3) 중요성: 성능, 안전, 보안의 영향 등"],
          ["수정 구현", "수정 필요 부분 분석 및 결정. 개별 프로세스 이용: 수정을 구현하기 위하여 개발(분석/설계/구현/테스트) 프로세스 이용"],
          ["유지보수 검토/승인", "무결성 검토: 수정 권한을 준 조직과 함께 검토. 수정완료 승인획득: 수정이 만족하게 완료되었는지 승인을 받아야 함"],
          ["이전", "전환 계획개발 및 실행. 전환계획의 통보 및 병행운영. 구 환경의 데이터 관리"],
          ["SW 폐기", "SW 제품은 소유자의 요구에 따라 폐기"],
        ],
      },
      {
        caption: "변경유형에 따른 S/W 유지보수 분류",
        headers: ["구분", "분류", "설명"],
        rows: [
          ["반응적(Reactive)", "수정", "납품 후 SW 발견된 문제 시정하기 위한 반응적 수정"],
          ["반응적(Reactive)", "적응", "납품 후 변화되고 또 변화된 환경에서 SW 제품을 계속 사용할 수 있도록 수행하는 수정"],
          ["순향적(Proactive)", "완벽", "납품 후 SW 제품의 성능이나 유지보수 개선을 위한 수정"],
          ["순향적(Proactive)", "예방", "납품 후 SW 제품의 잠재장애를 미리 검출하고 시정하기 위해 수행되는 수정"],
        ],
      },
      {
        caption: "S/W 유지보수 기법",
        headers: ["기법", "설명", "비고"],
        rows: [
          ["프로그램 이해", "전문적인 코드분석 툴 등을 이용하여 textbase의 소스 코드 이해성을 향상시키는 기법", "Code-Browser, 산출물(문서) 철저"],
          ["재공학", "자동화 도구를 이용하여 SW를 평가하고 수정하여 유지보수성을 향상시키는 기법", "리팩토링, Data Reengineering"],
          ["역공학", "문서화 자료가 프로그램 코드밖에 없을 경우 코드를 이용하여 설계, 분석 명세서를 작성하는 기법", "소스코드 분석기, 모듈 추출기, 문서화 도구"],
          ["재구조화", "오랜 시간 계속 변경하여 훼손된 SW 구조를 복원하여 유지보수 비용을 줄이는 기법", "클래스 변형, 설계 변형"],
        ],
      },
    ],
  },
  {
    title: "오픈소스 SW 보안위협",
    course: "SE",
    definition:
      "소스 코드가 공개되어 사용권 범위 안에서 자유롭게 사용·변경·공유(배포)할 수 있는 오픈소스의 사용·프로세스·공격·조치 측면 보안 위협과 관리방안",
    defShort: "공개 소스코드 사용에 따른 보안 위협과 관리·기술적 대응 방안",
    keywords: ["자유로운 배포", "소스 코드 공개", "Zero day Attack", "Log4j", "거버넌스"],
    tables: [
      {
        caption: "관리적 측면의 보안 위협과 관리방안",
        headers: ["구분", "보안 위협", "설명"],
        rows: [
          ["사용", "오픈소스 SW 사용 현황 부재", "자유로운 배포 특징으로 오픈소스 배포처에서 현황 파악 불가. 기업내 오픈소스 SW 사용 현황 관리 부실 빈번"],
          ["사용", "오픈소스 커뮤니티 소스코드 맹목적 사용", "Github 등 대형 오픈소스 커뮤니티 소스 맹목적 신뢰. 타이포스쿼팅(Typosquatting) 오픈소스 SW 보안 위협 존재"],
          ["프로세스", "오픈소스 SW 취약점 점검 프로세스 부재", "직접 개발한 SW와 비교하여 취약점 점검 수준 저하. 오픈소스 SW의 패키지 형태 사용으로 점검 예외 빈번"],
          ["프로세스", "오픈소스 SW 취약점 패치 검토 및 조치 지연", "오픈소스 SW 패치 시 Side-Effect 검토 등 조치 지연. 오픈소스 SW취약점 발생시 조치주체의 부재 및 모호성으로 인한 즉각적인 대응 부재"],
        ],
      },
      {
        caption: "기술적 측면의 보안 위협과 관리방안",
        headers: ["구분", "보안 위협", "설명"],
        rows: [
          ["공격", "공개 SW로 Zero Day 공격 가능성 증가", "소스가 공개 되어있는 특징으로 Zero Day 공격 가능. 해커 커뮤니티 통한 취약 공격 코드 확산 가능"],
          ["공격", "오픈소스 SW 내 악성코드 삽입 배포", "해커 원격 제어 가능(Remote Code Execution) 악성코드 배포. 크립토재킹(Cryptojacking) 코드 주입 가상화폐 채굴에 악용"],
          ["조치", "오픈소스 SW 취약점 자체 조치 불가", "오픈소스 SW 배포사의 취약점 패치 의존. Work Around(임시 조치 방안)으로 대응 불가피"],
          ["조치", "오픈소스 SW 보안 취약점 패치의 호환성 문제", "취약점 패치 시 호환성 문제 발생으로 조치 불가 상황 가능. 호환성 문제 해결시까지 보안 취약점 조치 지연 문제점"],
        ],
      },
      {
        caption: "보안 관리 방안",
        headers: ["구분", "보안 관리 방안", "설명"],
        rows: [
          ["사용", "오픈소스 SW 사용 현황 파악 Tool 도입", "오픈소스 SW 전용 Scan Tool 활용"],
          ["사용", "오픈소스 커뮤니티 소스코드 Hash값 확인", "인증되고 공신력 있는 제작자로부터 배포된 소스코드 사용. 소스코드가 Hash값(SHA-256 등)으로 악성코드 탐지 확인"],
          ["프로세스", "오픈소스 SW 보안 점검 프로세스 수립", "오픈소스 SW 보안 점검 가이드 전사 배포. 오픈소스 SW 긴급 패치 프로세스 간소화"],
          ["프로세스", "오픈소스 SW 보안 관리 전문가 점검 도입", "오픈소스 전문 업체 통한 유지보수 및 보안 점검 수행"],
          ["개발", "오픈소스 SW 적용 전 Sandbox 테스트 적용", "Sandbox 테스트로 악성코드 동작 유무 확인 진행. Hash값 확인보다 보다 직관적인 악성코드 탐지 방안"],
          ["개발", "오픈소스 SW 시큐어코딩적용", "2차적 저작물로 수정 시에 시큐어 코딩 적용"],
          ["장비", "오픈소스 SW 보안 업데이트 자동화 도입", "오픈소스 SW별 업데이트 방법 확인 및 자동화 구현. Script, Crontab, RPA 등 활용 오픈소스 SW 자동 업데이트"],
          ["장비", "지능형 IPS, FW 도입", "CWE,CVE 시그니처 기반 취약 코드 탐지 및 차단. 알려진 취약점 포함된 소스코드 사용시 차단"],
        ],
      },
    ],
  },
  {
    title: "오픈소스 거버넌스",
    course: "SE",
    definition:
      "OSS를 안전하게 사용·적용 및 배포하기 위해 필요한 사항을 다양한 관점에서 활용할 수 있도록 소프트웨어 라이프 사이클 단계별로 제시한 절차 및 체계",
    defShort: "OSS의 안전한 사용·배포를 위한 생명주기 단계별 절차·체계",
    keywords: ["거버넌스", "프레임워크", "정책수립", "획득", "적용", "운영 및 유지", "관리 및 개선"],
    tables: [
      {
        caption: "프레임워크 [정획적운관]",
        headers: ["FW", "활동요소", "설명"],
        rows: [
          ["정책수립", "컨설팅", "공개소프트웨어 적용과 전략수립을 위한 자문 서비스 제공"],
          ["정책수립", "정책수립", "목표와 전략에 따라 반드시 지켜야 할 규정과 지침을 수립"],
          ["정책수립", "조직구성", "효율적인 인력 구성과 역할과 책임에 따른 운영 방안을 제시"],
          ["획득", "요구분석", "고객 또는 사용자의 고민, 요구사항 등을 분석"],
          ["획득", "조사", "새로운 OSS 또는 특정 분야에 적합한 OSS를 찾음"],
          ["획득", "분석", "공개소프트웨어의 속성을 구분하고 상태나 수준을 정리"],
          ["획득", "평가", "각 속성에 가중치를 부여하고 평가 모델을 적용하여 채점"],
          ["적용", "계약", "OSS 도입 및 활용, 배포에 대한 책임과 의무의 조건과 규제 결정"],
          ["적용", "설계", "요구 분석 결과에 따라 기능과 사양을 미리 구성"],
          ["적용", "개발", "공개소프트웨어 프로그램을 변경 및 결합"],
          ["적용", "패키징", "공개소프트웨어 설치가 편리하도록 단일 프로그램으로 묶음"],
          ["적용", "시험", "요구 수준에 맞는지 품질과 성능을 확인"],
          ["적용", "배포", "공개소프트웨어를 저장매체, 웹사이트, 장비 등을 통해 전달"],
          ["운영 및 유지", "설치", "공개소프트웨어를 운영할 수 있는 장비에 탑재"],
          ["운영 및 유지", "운영", "공개소프트웨어를 실행시켜 지속적으로 가동시킴"],
          ["운영 및 유지", "유지보수", "최상의 운영 상태를 유지하도록 제반 작업을 수행"],
          ["운영 및 유지", "기술지원", "추가 요구 사항 반영이나 문제 해결 등 OSS 서비스를 제공"],
          ["운영 및 유지", "커뮤니티", "소스코드 기여, 재정적 지원, 활동 교류, 참여방법을 제시"],
          ["관리 및 개선", "컴플라이언스", "라이선스 의무사항 준수 및 법적 문제를 해결함"],
          ["관리 및 개선", "교육", "OSS의 도입, 활용, 배포에 대한 지식을 전달 및 역량강화"],
          ["관리 및 개선", "모니터링", "공개소프트웨어 적용 이후의 상황을 파악하고 피드백을 수렴"],
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
    defShort: "조직 프로세스 개선 활동을 성숙도 레벨로 제시한 개발 역량 모델",
    keywords: ["Category", "Capability", "Practices"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "세부 항목", "설명"],
        rows: [
          ["Category Area", "Doing, Managing, Enabling, Improving", "조직이나 프로젝트의 정의된 활동 내에서 성과를 개선하기 위한 관행을 정의하는 관련 영역 그룹"],
          ["Capability Area", "Category 하위 Practices 그룹 영역(12개)", "해당 Practice Area에 설명된 의도, 가치를 달성할 수 있는 유사성 묶음. 관련 있는 Practice Area들의 묶음 — Capability Area 단위로 개선 활동 진행"],
          ["Practices", "공통 Practices 영역(17개)", "총 17개의 그룹으로 정의된 목적 및 가치를 달성하기 위해 필요한 주요 활동을 설명하는 일련의 Practice들의 집합"],
          ["Practices", "도메인별 특정 Practices 영역(14개)", "특정 도메인의 목적을 달성하기 위해 필요한 주요 활동 Practice들의 집합"],
          ["Domain", "Development(DEV), Services(SVC), Suppliers(SPM), Security(SEC), Safety(SAF), People(PPL), Data, Virtual(VRT)", "프로세스 개선을 하고자 하는 특정 영역으로 각각 도메인에 맞는 특정 Practices 영역을 포함. 기존에서 총 8개로 확장"],
        ],
      },
      {
        caption: "성숙도 레벨",
        headers: ["레벨", "명칭"],
        rows: [
          ["1", "Initial (초기)"],
          ["2", "Managed (관리)"],
          ["3", "Defined (정의)"],
          ["4", "Quantitively Managed (정량적 관리)"],
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
    defShort: "국제표준 기반 국산 SW 품질을 시험·인증하는 한국형 제도",
    keywords: ["기능성", "신뢰성", "사용성", "성능효율성", "유지보수성", "이식성", "보안성", "호환성", "일반적 요구사항", "SW산업진흥법"],
    tables: [
      {
        caption: "GS 인증 SW 품질 평가 모델 [23측정 51요구 41평가]",
        headers: ["표준", "설명"],
        rows: [
          ["ISO/IEC 25023", "SW 제품 품질 측정에 관한 국제표준"],
          ["ISO/IEC 25051", "SW 제품 품질 요구사항과 시험에 관한 국제표준"],
          ["ISO/IEC 25041", "SW 제품 품질 평가에 관한 국제표준"],
        ],
      },
      {
        caption: "품질 특성(평가 항목)",
        headers: ["주특성", "부특성"],
        rows: [
          ["기능적합성", "기능완전성, 기능정확성, 기능적절성"],
          ["성능효율성", "시간반응성, 자원효율성, 용량성"],
          ["호환성", "공존성, 상호운용성"],
          ["사용성", "적절인지성, 학습성, 운영성, 사용자오류 방지성, 사용자인터페이스 심미성, 접근성"],
          ["신뢰성", "성숙성, 가용성, 결함허용성, 복구성"],
          ["보안성", "기밀성, 무결성, 부인방지성, 책임성, 인증성"],
          ["유지보수성", "분석성, 변경성, 시험성"],
          ["이식성", "적응성, 설치성, 대체성"],
          ["일반적 요구사항", "제품설명서 요구사항, 사용자문서(설치서) 요구사항, 품질특성별 정보제공"],
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
    defShort: "SW 조직의 프로세스 품질 역량을 심사해 등급을 부여하는 제도",
    keywords: ["프로세스", "품질", "소프트웨어 진흥법"],
    tables: [
      {
        caption: "소프트웨어 프로세스 품질인증 기준",
        headers: ["영역", "평가 항목", "설명"],
        rows: [
          ["프로젝트 관리", "프로젝트 계획", "프로젝트 목표와 일정, 자원 등을 계획하는 능력"],
          ["프로젝트 관리", "프로젝트 통제", "진행 상황을 모니터링하고 통제하는 체계"],
          ["프로젝트 관리", "협력업체 관리", "협력업체와의 의사소통 및 업무 조율 관리"],
          ["개발 영역", "고객 요구사항 관리", "고객 요구사항을 수집, 분석, 관리하는 체계"],
          ["개발 영역", "분석, 설계, 구현", "요구사항을 기반으로 시스템 설계 및 구현"],
          ["개발 영역", "테스트", "소프트웨어 기능 및 성능을 검증하는 테스트 수행"],
          ["지원 영역", "품질보증", "프로세스와 산출물의 품질을 보증하는 활동"],
          ["지원 영역", "형상관리", "개발 산출물의 변경 및 버전을 체계적으로 관리"],
          ["지원 영역", "측정 및 분석", "개발 및 관리 성과를 정량적으로 측정하고 분석"],
          ["조직관리 영역", "조직 프로세스 관리", "조직의 프로세스를 정의하고 운영 및 관리"],
          ["조직관리 영역", "구성원 교육", "구성원 역량 강화를 위한 교육 체계 구축"],
          ["프로세스 개선영역", "조직성과 관리", "조직의 성과를 체계적으로 관리하고 평가"],
          ["프로세스 개선영역", "문제 해결", "문제를 분석하고 적절한 해결 방안을 실행"],
          ["프로세스 개선영역", "프로세스 개선관리", "프로세스를 지속적으로 개선하고 최적화"],
        ],
      },
      {
        caption: "소프트웨어 프로세스 품질인증 등급",
        headers: ["등급", "설명", "심사 영역"],
        rows: [
          ["1", "프로젝트를 수행할 수 있으나 품질, 비용, 납기 목표를 안정적으로 충족하지 못하며 프로세스 역량 개선이 필요한 수준", "없음"],
          ["2", "개별 프로젝트 차원의 프로세스를 수립하고 이를 통제하여 성공적으로 프로젝트를 수행할 수 있는 수준", "프로젝트 관리, 개발, 지원"],
          ["3", "조직 차원의 프로세스를 정의하고 문제를 해결하며, 일관된 품질 수준으로 프로젝트의 지속적 개선이 가능한 수준", "프로젝트 관리, 조직관리, 프로세스 개선, 개발, 지원"],
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
    defShort: "SW 품질 특성과 평가 지표를 정의한 국제표준(9개 주특성)",
    keywords: ["기능적합성", "신뢰성", "상호작용 능력", "성능 효율성", "유지 보수성", "유연성", "보안성", "호환성", "안전성"],
    tables: [
      {
        caption: "ISO/IEC 25010:2023의 품질 특성",
        headers: ["주 특성", "부 특성"],
        rows: [
          ["기능 적합성", "기능완전성, 기능정확성, 기능적절성"],
          ["신뢰성", "성숙성, 가용성, 결함허용성, 복구성"],
          ["상호작용 능력", "적절 인지성, 학습성, 운용성, 사용자 오류 방지성, 사용자 참여도, 포괄성, 사용자 지원, 자기 설명성"],
          ["성능 효율성", "시간 반응성, 자원 효율성, 용량성"],
          ["유지 보수성", "모듈성, 재사용성, 분석성, 수정가능성, 시험가능성"],
          ["유연성", "적응성, 확장성, 설치성, 대체성"],
          ["보안성", "기밀성, 무결성, 부인방지, 책임성, 인증성, 내성(저항성)"],
          ["호환성", "공존성, 상호운용성"],
          ["안전성", "운영 제약, 위험 식별, 실패 안전, 위험 경고, 안전한 통합"],
        ],
      },
      {
        caption: "주요 개정 사항",
        headers: ["구분", "개정 내용"],
        rows: [
          ["품질 모델 분리", "소프트웨어 품질모델은 ISO/IEC 25010에 정의하고 있고, 사용 품질 모델은 ISO/IEC 25019에 정의"],
          ["품질 모델 대상 변경", "기존 대상을 시스템 및 소프트웨어 제품에서 ICT 제품 및 소프트웨어 제품으로 변경. '제품 품질 모델'이라고 변경"],
          ["주특성 추가", "안전성이라는 품질 주특성이 추가. 안전성의 부특성은 운영 제약성, 위험 식별성, 실패 안전성, 위험 경고성 등으로 구성"],
          ["주특성 변경", "사용성 → 상호작용 능력(interaction capability)으로 변경. 이식성(Portability) → 유연성(Flexibility)으로 변경"],
          ["부특성 변경", "기존 사용성의 부특성 '접근성'이 사용포함성(inclusivity)과 사용자 지원성(user assistence)으로 분할"],
          ["부특성 추가", "보안성에 저항성(resistance) 추가. 유연성(Flexibility)에 확장성(scalability) 추가"],
        ],
      },
    ],
  },
  {
    title: "상용소프트웨어 품질성능 평가 시험",
    course: "SE",
    definition:
      "동종의 경쟁 제품간 기능 및 성능 비교 평가를 통해 사용자의 요구사항을 만족하고 품질 및 성능이 우수한 제품을 가려내는 시험",
    defShort: "경쟁 상용SW 간 기능·성능을 비교 평가해 우수 제품을 가리는 시험",
    keywords: ["BMT", "소프트웨어 진흥법 제55조", "직접구매"],
    tables: [
      {
        caption: "평가대상",
        headers: ["구분", "내용"],
        rows: [
          ["평가대상", "경쟁입찰을 통한 직접구매 대상 상용SW 제품 중 구매금액 1억원 이상(VAT 포함)으로서 별표3(대상품목 34종)에 해당하는 SW 제품"],
          ["평가대상", "'소프트웨어사업 계약 및 관리감독에 관한 지침' 제8조제3항의 경우 SW 구매금액 2억원 이상으로서 별표3에 해당하는 소프트웨어 제품만을 대상으로 수행 (SW사업 총3억이상(부가가치세 포함)이고 5천이상(부가가치세 포함)인 다음 SW제품. 국가종합전자조달시스템 종합쇼핑몰 등록(5천만 미만도 포함) SW, GS, CC, NET, NEP, 5천미만인 경우 총금액 5천 초과인 경우)"],
          ["평가대상", "제조에서 정한 평가시험 대상에 해당하지 않는 경우에도 국가기관 등이 필요하다고 판단하는 경우에는 평가시험을 수행"],
          ["제외대상", "SW제품 구매 금액 대비 평가시험 비용이 큰 경우, 기존 사용하던 소프트웨어 제품을 증설하는 경우 등 시험비용 대비 효과가 낮다고 국가기관등의 장이 인정하는 경우 제11조 제1호에 따라 국가기관등의 장과 시험기관의 장이 협의하여 평가시험을 실시하지 않을 수 있다"],
          ["제외대상", "국가기관등의 장이 제1호에 따라 평가시험을 실시하는 경우 기존에 동일한 SW제품에 대하여 시험기관이 종전에 실시한 평가시험 결과의 활용을 우선 검토하여야 한다"],
          ["제외대상", "'정보보호산업의 진흥에 관한 법률' 제17조에 따라 정보보호제품에 대한 성능평가를 획득한 소프트웨어 제품의 경우에는 평가시험 결과를 대체할 수 있다"],
        ],
      },
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. 평가시험 대상 검토", "상용 소프트웨어 직접구매 대상 검토 요청(국가기관등) → 검토 결과 송부 → 의무화 대상 검토(국가기관등)"],
          ["2. 사전 협의", "평가시험 사전협의 요청·제외 사유 검토(지정시험기관) → 평가시험 실시 → 종전 평가시험 결과 활용"],
          ["3. 평가시험 설계", "국가기관등의 요구사항 및 운영 시스템 분석(지정시험기관) → 평가항목 개발 → 평가항목 초안 수립 → 평가시험 환경 구성 → 평가시험 실시 계획 수립 및 환경 구축"],
          ["4. 조달 발주", "제안요청서에 평가항목 및 배점 반영(국가기관등) → 사전규격 공개(조달청) → 평가시험 설명회 개최(지정시험기관) → 입찰공고 게재(조달청)"],
          ["5. 평가시험 의뢰", "평가시험 참여 의향서 제출(SW공급자) → 평가시험 실시 의뢰(국가기관등) → 평가시험 회신 접수 및 실시 준비 → 대상 제품 제출(SW공급자 → 지정시험기관)"],
          ["6. 평가시험 실시", "평가시험 실시(지정시험기관/SW공급자) → 평가시험 결과서 작성 및 검토 → 결과서 교부(지정시험기관 → 국가기관등) → 평가시험 실시 결과 공개"],
          ["7. 평가시험 결과 반영", "평가시험 결과서 접수 및 평가시험 점수 환산(국가기관등) → 점수 통보 → 결과를 기술성평가에 반영 및 우선협상대상자 선정(조달청)"],
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
    defShort: "제어 흐름 그래프의 회전수로 SW 복잡도를 계산하는 방법",
    keywords: ["복잡도 = (edge − node + 2) = (폐구간 + 1) = (의사결정 수 + 조건 수 + 1)"],
    tables: [
      {
        caption: "복잡도 계산 공식",
        headers: ["공식", "설명"],
        rows: [
          ["복잡도 = e − n + 2", "e: 간선의 수, n: node의 수"],
          ["복잡도 = 폐구간 + 1", "폐쇄영역(enclosed areas) + 1"],
          ["복잡도 = 의사결정 수 + 조건 수 + 1", "의사결정 수: if-then-else, do while, case(각각이 하나) / 조건 수: and, or, not 등"],
        ],
      },
      {
        caption: "복잡도 분석",
        headers: ["복잡도", "분석 내용"],
        rows: [
          ["5 이하", "간단한 프로그램"],
          ["5~10", "구조적이며 안정된 프로그램"],
          ["20 이상", "문제 자체가 매우 복잡하거나 구조가 필요 이상으로 복잡한 프로그램"],
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
    defShort: "위험 원인을 트리로 찾아가는 연역적(Top-down) 분석 기법",
    keywords: ["Top-down", "연역적 기법", "트리 다이어그램"],
    tables: [
      {
        caption: "프로세스",
        headers: ["단계", "프로세스", "설명"],
        rows: [
          ["Step 1", "Top 이벤트 설정", "위험도를 고려하여 해석할 Top 이벤트 설정"],
          ["Step 2", "특성 파악", "시스템의 공정과 작업 내용등 파악, 위험 관련 상세 조사"],
          ["Step 3", "FT 작성", "Fault Tree 다이어그램 작성"],
          ["Step 4", "FT 구조 분석(정성적)", "Top이벤트에 영향을 미치는 기본 사상 파악"],
          ["Step 5", "FT 정량화", "발생빈도, 고장율, 에러 데이터 등을 정리하여 발생확률 조사"],
          ["Step 6", "해석 결과의 평가", "위험 수준 파악 및 대책 수립"],
        ],
      },
      {
        caption: "표기법",
        headers: ["FTA 기호", "구분", "설명"],
        rows: [
          ["사상 기호", "사상(Event) — 사각형", "개개의 사상, Event. 고장, 불량, 원치 않는 이벤트"],
          ["사상 기호", "기본사상(Basic Event) — 원", "최하위 사상, 더 이상 전개하지 않는 기본적 사상"],
          ["사상 기호", "전입(In) — 삼각형", "동일한 FT 내의 타 부분에서의 전입"],
          ["사상 기호", "전출(Out) — 삼각형(선)", "동일한 FT 내에서 타 부분으로의 전출"],
          ["사상 기호", "부전개 사상(undeveloped event) — 마름모", "어떤 논리 게이트에 적용되는 제약/조건"],
          ["게이트 기호", "AND 게이트", "A, B가 동시에 발생해야 상위사상 발생"],
          ["게이트 기호", "OR 게이트", "A, B 중 어느 하나만 발생해도 상위사상 발생"],
          ["게이트 기호", "Priority AND 게이트", "A가 B보다 먼저 발생할 때 상위사상 발생"],
          ["게이트 기호", "Exclusive OR 게이트", "A, B 중 하나만 발생해야 상위사상 발생"],
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
    defShort: "고장 요인의 영향도로 우선순위를 정하는 귀납적(Bottom-up) 분석",
    keywords: ["Bottom-up", "RPN = 심각도 x 발생도 x 검출도"],
    tables: [
      {
        caption: "고장영향 평가 방법 — RPN 3축",
        headers: ["항목", "설명"],
        rows: [
          ["심각도", "중요도, Severity, S. 설계적 문제 (1: 심각하지 않음, 10: 매우 심각)"],
          ["발생도", "Probability of Occurrence, O. 공정기술의 문제 (1: 발생빈도 매우 낮음, 10: 발생빈도 매우 높음)"],
          ["검출도", "Detection, D, Probability of Detection. 관리력의 문제 (1: 검출가능성 높음, 10: 검출가능성 낮음)"],
        ],
      },
      {
        caption: "FMEA 유형",
        headers: ["구분/유형", "설계 FMEA", "공정 FMEA", "시스템 FMEA"],
        rows: [
          ["대상", "제품 (시스템)", "공정 (작업)", "설비 (생산라인)"],
          ["목적", "설계, 제품 결함 분석, 대책", "제조, 공정의 결함 분석, 대책", "설비 설계, 기능 결합 분석, 대책"],
          ["시기", "구상설계 ~ 최종설계 단계", "공정 설계 단계 ~ 생산 전", "설비설계 단계 ~ 생산 전"],
          ["대상 요소", "제품의 구성요소", "공정, 작업, 재료", "설비의 구성요소"],
        ],
      },
      {
        caption: "FTA, FMEA, HAZOP 비교",
        headers: ["항목", "FTA", "FMEA", "HAZOP"],
        rows: [
          ["목적", "원인 분석", "영향분석", "위험 식별"],
          ["분석 특징", "정성/정량적", "정성적", "정성적"],
          ["분석 기법", "연역적, Top-down", "귀납적, Bottom-up", "귀납적, Bottom-up"],
          ["적용 시점", "설계 단계", "요구분석, 검증단계", "상세 설계, 설계 완료 단계"],
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
    defShort: "공정변수×가이드워드 조합으로 이탈 원인·영향을 분석하는 기법",
    keywords: ["경험기반", "이탈 = 공정변수 * 가이드워드", "공정(특정변수, 일반변수)", "가이드워드(7가지) : 없음/증가/감소/반대/부가/부분/기타"],
    tables: [
      {
        caption: "수행 절차",
        headers: ["절차", "설명"],
        rows: [
          ["목적, 범위 설정", "분석 목적, 검토범위 설정"],
          ["분석 팀 구성", "관련 전문가 팀 구성(리더, 팀원)"],
          ["예비 조사", "자료 수집, 분석 절차 수립"],
          ["토론 및 검토", "Study Node, 공정변수, 가이드워드 조합 브레인스토밍"],
          ["분석 결과 기록", "이탈 원인, 결과 개선 권고사항 기록"],
        ],
      },
      {
        caption: "평가 방식",
        headers: ["구분", "설명"],
        rows: [
          ["평가 방식", "이탈 = 공정변수 × 가이드워드"],
          ["이탈", "설계 의도(정상운전조건)에서 벗어난 상태"],
          ["공정변수 — 특정변수", "가이드워드와 조합되어 이탈 발생하는 변수"],
          ["공정변수 — 일반변수", "단독으로 이탈 발생하는 변수"],
          ["가이드워드 — 없음(NO OR NOT)", "설계의도에 완전히 반하여 변수의 양이 없는 상태"],
          ["가이드워드 — 증가", "변수가 양적으로 증가되는 상태"],
          ["가이드워드 — 감소", "변수가 양적으로 감소되는 상태"],
          ["가이드워드 — 반대", "설계 의도와 정반대로 나타나는 상태"],
          ["가이드워드 — 부가", "설계의도 외에 다른 변수가 부가되는 상태 (오염)"],
          ["가이드워드 — 부분", "설계의도대로 완전히 이루어지지 않는 상태"],
          ["가이드워드 — 기타", "설계의도대로 설치되지 않거나 운전 유지되지 않는 상태"],
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
    defShort: "초기 이벤트부터 성공/실패 확률로 사고 시나리오를 도출하는 분석",
    keywords: ["[범위초 트결경]", "이벤트 기반", "Event Tree", "Tree 분석"],
    tables: [
      {
        caption: "분석 절차 [범위초 트결경]",
        headers: ["절차", "설명"],
        rows: [
          ["1) 분석 대상 및 범위 정의", "분석 대상 및 범위를 명세서와 설계서 등을 활용하여 정의"],
          ["2) 시스템 위험 또는 사고 정의", "시스템 위험 또는 사고를 정의"],
          ["3) 초기 이벤트 정의", "정의된 사고와 관련된 초기이벤트 정의 및 Event Tree에 위치"],
          ["4) Event Tree 전개", "초기 이벤트로부터 최종 결과에 이르는 중간 이벤트 도출. 중간 이벤트의 성공/실패 여부를 분석하여 최종결과에 도달할 때까지 Tree 생성"],
          ["5) 결과 리스크 파악", "시스템 위험 또는 사고 시나리오의 발생 가능성을 계산 및 리스크 평가"],
          ["6) 위험 경감 대책 수립", "위험 감소, 예방할 수 있는 안전조치 도출 및 개선 계획 수립"],
        ],
      },
      {
        caption: "위험관계 분석 기법 관계",
        headers: ["기법", "추론 방향", "설명"],
        rows: [
          ["FMEA", "귀납적 추론", "알려진 원인들로부터 시작 → 가능한 영향들"],
          ["FTA", "연역적 추론", "가능한 원인들 ← 알려진 영향들로부터 시작"],
          ["HAZOP·STPA", "탐색적 추론", "가능한 원인들 ↔ 하나의 사건에서 출발 ↔ 가능한 영향들"],
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
    defShort: "STAMP 기반, 요소 간 상호작용의 안전 위협을 분석하는 기법",
    keywords: ["STAMP", "요소간 상호작용", "사고 및 위험정의", "Control Structure 도식화", "Unsafe Control Action 도출", "원인 시나리오 도출"],
    tables: [
      {
        caption: "위험 분석 절차 (4단계)",
        headers: ["위험분석 절차", "설명"],
        rows: [
          ["1단계: 사고 및 위험 정의", "사고 정의, 시스템 수준 위험 정의, 시스템 수준 안전 제약사항 도출. 관련 사고 도출 → 위험 정의 → 위험을 안전 제약사항으로 변환"],
          ["2단계: Control Structure 도식화", "제어 관계에 따른 개체(컴포넌트) 식별. 제어명령, 피드백, 프로세스 모델 등 도식화"],
          ["3단계: Unsafe Control Actions 도출", "위험 유발 가능한 Unsafe Control Action 4가지 유형 도출 — 1) Control Action의 부재 2) 부적절한 Control Action 3) Control Action 제공 시간, 순서 4) Control Action 지속시간. Unsafe Control Action: 시스템의 위험을 유발할 수 있는 Control Action의 불안전한(Unsafe) 형태"],
          ["4단계: 원인 시나리오(Causal Scenario) 도출", "Unsafe Control Action 발생 원인 도출. Controller가 UCA를 제공한 원인 도출. 제공한 Control Action이 부적절 수행 및 미수행 원인 도출. 원인들을 토대로 하여 원인 시나리오(Causal Scenario)를 작성"],
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
    defShort: "SW 규모 파악으로 공수·자원·기간을 산정해 계획을 세우는 과정",
    keywords: ["하향식 산정", "상향식 산정", "수학적 산정"],
    tables: [
      {
        caption: "규모 산정 방법",
        headers: ["산정방법", "기법", "내용"],
        rows: [
          ["하향식(Top Down)", "전문가 감정, 델파이 방식", "경험적 단언, 개발자 합의(인력, 시스템 크기, 예산)"],
          ["상향식(Bottom Up)", "LOC 기법, Man/Month", "업무분류구조 정의, 각 구성요소에 대한 독립적 산정, 집계"],
          ["수학적", "기능점수(FP), COCOMO", "소프트웨어 비용산정의 자동화, 수치화에 의한 비용을 산정"],
        ],
      },
      {
        caption: "규모 산정 시 고려사항",
        headers: ["구분", "항목", "내용"],
        rows: [
          ["프로젝트 요소", "문제의 복잡도", "난이도, 유형, 개발언어"],
          ["프로젝트 요소", "시스템 크기", "트랜잭션(입력, 출력), 데이터 연계"],
          ["프로젝트 요소", "시스템 신뢰도", "정확성, 견고성, 완전성, 일관성"],
          ["자원 요소", "인적 자원", "관리자, 개발자, 지원체계"],
          ["자원 요소", "하드웨어 자원", "개발장비, 운영장비"],
          ["자원 요소", "소프트웨어 자원", "개발지원 도구, 테스트 툴"],
          ["생산성 요소", "개발자 능력", "경험, 전문지식 습득 정도"],
          ["생산성 요소", "고객 능력", "업무 요건에 대한 지식"],
          ["생산성 요소", "개발 방법론", "최신기법, 개발 방법론, 관리 방법론"],
        ],
      },
      {
        caption: "규모산정 방법 비교",
        headers: ["비교", "하향식(Top Down)", "상향식(Bottom UP)"],
        rows: [
          ["특징", "전체 시스템 차원 비용 산정. 인력비용은 유사한 과거 프로젝트의 비용 검사하여 추정. 모듈들에 대한 여러 가지 기술요인 반영", "각 모듈 또는 서브시스템을 개발 비용 우선 산정하고, 합산하여 전체비용 산정. 시스템 차원 비용은 고려하지 못할 수도 있음, 연산방식에 의한 비용 산정"],
          ["장점", "간편, 신뢰감", "객관성 부여"],
          ["단점", "비과학적, 낙관적", "세부 기술적 난이도 배제"],
          ["산정방식", "그룹에 의한 산정, 전문가 감정", "LOC, 기능점수, COCOMO"],
        ],
      },
    ],
  },
  {
    title: "Function Point",
    course: "SE",
    definition:
      "정보처리 규모와 기능의 복잡도 요인에 의거한 SW 규모 산정 방식",
    defShort: "정보처리 규모와 기능 복잡도 기반의 SW 규모 산정 방식",
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
          ["측정 유형 결정", "개발 프로젝트", "SI 프로젝트가 종료된 후, 사용자에게 인도되는 SW"],
          ["측정 유형 결정", "개선 프로젝트", "SW 추가, 수정, 삭제 부분에 대한 SW 비용 산정"],
          ["측정 유형 결정", "어플리케이션", "사용자가 사용하고 있는 소프트웨어의 현장 기능을 측정(설치된 기능 점수 측정)"],
          ["측정범위와 경계 식별", "범위결정", "개별 변경할 SW에 대한 전체 범위 결정"],
          ["측정범위와 경계 식별", "경계식별", "각 어플리케이션과 경계를 분류하는 과정"],
          ["데이터 기능 유형", "내부 논리 파일(ILF)", "사용자가 식별할 수 있는 논리적으로 연관된 데이터 그룹 또는 제어정보. 어플리케이션 경계 내에서 유지되는 Data 및 제어정보(예: 내부 DB)"],
          ["데이터 기능 유형", "외부 연계 파일(EIF)", "데이터 그룹은 측정되는 어플리케이션의 외부에서 참조. 어플리케이션 경계 밖에서 유지되는 Data 및 제어정보(예: 외부 DB)"],
          ["트랜잭션 기능 유형", "외부입력(EI)", "애플리케이션 경계 안으로 들어오는 데이터나 제어정보를 처리하는 단위 프로세스"],
          ["트랜잭션 기능 유형", "외부출력(EO)", "애플리케이션 경계 밖으로 조회되는 것으로 파생 데이터 생성과 같은 처리 로직을 포함하는 단위 프로세스(계산 처리 된 후 외부로 나가는 것)"],
          ["트랜잭션 기능 유형", "외부조회(EQ)", "EO와 같으나 파생 데이터 생성과 같은 처리 로직을 포함하지 않는 단위 프로세스(계산 처리 없이 단순 데이터가 외부로 나가는 것)"],
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
    defShort: "예산·발주·계약 시 SW 적정대가 산정 기준 (1FP=605,784원)",
    keywords: ["구현단계(사기전후직소)", "기획단계", "ISP/BPR", "EA/ITA", "ISMP"],
    tables: [
      {
        caption: "SW사업 기획 단계 대가 산정 방법",
        headers: ["구분", "산정 방법", "설명"],
        rows: [
          ["ISP/ISP/BPR", "컨설팅 업무량 방식", "(산출)업무 범위 설정 → 업무별 가중치 계산 → 업무별 난이도계산 → 컨설팅 업무량 계산 → 직접경비 → 정보전략계획 수립비 계산. 컨설팅 업무량 = 업무 가중치 × 난이도 / 컨설팅 대가 = 컨설팅 업무량 × 단가 + 직접 경비"],
          ["EA/ITA", "컨설팅 업무량 방식", "컨설팅 업무량 = EA/ITA 업무 가중치 × EA/ITA 난이도 / 컨설팅 대가 = 공수 × 컨설팅 업무량 + 직접 경비"],
          ["ISP/BPR, EA/ITA, ISMP, 정보보안 컨설팅", "투입 공수 방식", "(산출)사전준비 → 투입 공수 산정 → 직접 인건비 계산 → 제경비 및 기술료 계산 → 직접 경비 계산 → 컨설팅 대가 산정. 직접 인건비 = 직무별 투입 공수 × 소프트웨어 기술자 평균임금 / 제경비 = 직접 인건비 × 144%~154% / 기술료 = (직접인건비+제경비) × 20%~40% / 컨설팅 대가 = 직접 인건비 + 제경비 + 기술료 + 직접경비"],
        ],
      },
      {
        caption: "기능점수 방식에 의한 소프트웨어 개발비 대가산정 절차 [사기전후직소]",
        headers: ["절차", "산출물", "주요내용"],
        rows: [
          ["사전준비", "개발업무 기능 요구사항, 규모산정 방법", "개발대상 업무와 요구사항을 명확히 정의하고, 개발 규모(기능점수) 산정방법(정통법 또는 간이법)을 결정 함"],
          ["개발대상 SW 기능점수 산정", "개발대상 SW 기능점수", "요구사항에 근거하여 개발대상 소프트웨어의 기능을 식별하고, 복잡도를 고려하여 기능점수를 산정함"],
          ["보정 전 개발원가 산정", "보정 전 개발원가", "산정된 기능점수에 기능점수당 단가를 곱하여 보정 전 개발원가를 산정함. 보정전 개발원가 = 기능점수 × 기능점수당 단가"],
          ["보정 후 개발원가 산정", "보정 후 개발원가", "소프트웨어사업 특성을 고려하여 보정요소별로 보정 계수를 식별함. 보정요소: 규모보정, 연계복잡성, 성능, 운영 환경 호환성, 보안성. 식별된 보정계수에 따라 개발원가를 보정한다. 개발원가 = 보정전 개발원가 × 보정계수"],
          ["직접경비 및 이윤 산정", "직접경비, 이윤", "해당 소프트웨어 개발에 관련된 직접경비를 산정함. 이윤은 개발원가의 25% 이내에서 산정함"],
          ["소프트웨어 개발비 산정", "소프트웨어 개발비", "소프트웨어 개발비를 산정한다. SW개발비 = 개발원가 + 직접경비 + 이윤"],
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
    defShort: "코드 가독성을 낮춰 역공학에 대비하는 코드 변경 기법",
    keywords: ["[구데집제예]", "구획 난독화", "데이터 난독화", "집합 난독화", "제어 난독화", "예방 난독화"],
    tables: [
      {
        caption: "난독화 기술 분류 [구데집제예]",
        headers: ["구분", "설명", "세부분류"],
        rows: [
          ["구획 난독화(layout obfuscation)", "프로그램에 큰 영향을 끼치지 않는 세부적인 요소를 변화하거나 제거하여 프로그램 복원에 성공하였더라도 프로그램 내용의 상당 부분을 훼손시켜 복원할 수 있도록 막는 방법", "형식변화, 주석제거, 식별자손상"],
          ["데이터 난독화(data obfuscation)", "데이터를 담을 변수를 나누거나 합치거나 읽기 어렵게 하는 방향의 모든 기술", "Storage, Aggregation, Ordering, Encoding"],
          ["집합 난독화(aggregation obfuscation)", "순서를 이용해서 코드를 난독화(array transformation). 하나의 클래스를 두 개로 분할하여 난독화(Split a class)", "자료순서변환, 클래스분할"],
          ["제어 난독화(Control obfuscation)", "제어를 복잡하게 하고, 문장의 묶는 단위를 조절하는 방법", "Aggregation, Ordering, Computation"],
          ["예방 난독화(Preventive obfuscation)", "이미 알려진 역 난독화 방법을 알고 그 방법을 봉쇄하는 방법", "Targeted, Inherent"],
        ],
      },
      {
        caption: "난독화 기술 비교",
        headers: ["구분", "Layout", "Data", "Control", "Preventive"],
        rows: [
          ["특징", "세부적인 요소를 변화, 제거. 복원 성공 시에도 프로그램의 상당 부분 훼손", "프로그램의 처리 변수의 변환. 데이터의 저장 변수를 합치거나, 읽기 어렵게 변경", "프로그램의 문장이 묶이는 단위의 조절. 프로시저 등의 변경으로 인한 불명확성을 증대", "역 난독화에 대한 대응. 역 난독화 프로그램이 구체화된 경우 사용 가능"],
          ["장점", "성능저하 미존재", "자료의 보호", "로직의 보호", "능동적 역공학 방해"],
          ["단점", "로직 보호 불가", "성능의 저하", "성능의 저하", "성능의 저하"],
          ["예시", "전: GetPayroll() / 후: a()", "전: t=\"Net\"; / 후: t[1]='N'; t[2]='e'; t[3]='t';", "전: for(i=0;i<100;i++) / 후: for(i=100;i>0;i--)", "Hardware breakpoint Detection, Detecting breakpoints by CRC, Ring3 debugger detection via LDR_MODULE"],
        ],
      },
    ],
  },
  {
    title: "SBOM",
    course: "SE",
    definition:
      "소프트웨어 컴포넌트 및 구성 요소를 식별할 수 있는 메타데이터와 저작권 및 라이선스 등으로 소프트웨어 콘텐츠에 대한 정보를 포함하는 공식 SW 자재 명세서",
    defShort: "SW 구성요소·저작권·라이선스 정보를 담은 공식 SW 자재 명세서",
    keywords: ["Author Name", "Timestamp", "Version String", "SPDX", "CycloneDX", "SWID"],
    tables: [
      {
        caption: "기술 요소 — Baseline Attributes",
        headers: ["핵심 기술", "설명"],
        rows: [
          ["Author Name", "SW 작성자 정보"],
          ["Timestamp", "SBOM이 마지막으로 업데이트된 날짜 및 시간(ISO 8601)"],
          ["Supplier Name", "SW 공급업체의 이름 또는 기타 식별자"],
          ["Component Name", "SW 구성요소 이름 또는 식별자"],
          ["Version String", "SW Version 정보 (Semantic Versioning)"],
          ["Component Hash", "SW 컴포넌트 해시 값을 통한 무결성 증빙"],
          ["Unique Identifier", "고유한 Namespace 및 고유 식별자 생성"],
          ["Relationship", "SBOM 구성 요소 간의 종속성 및 연간 관계 표현"],
        ],
      },
      {
        caption: "기술 요소 — Formats",
        headers: ["포맷", "설명"],
        rows: [
          ["SPDX", "Software Package Data Exchange — 리눅스 재단 오픈소스 저작권 및 라이선스 정보 교환 표준"],
          ["CycloneDX", "OWASP 재단 공급망 구성요소 보안 및 경량 SBOM 표준"],
          ["SWID", "Software Identification — SW 정보에 대한 Tag 생성 및 오픈소스 SW 인벤토리 지원"],
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
    defShort: "운영 중 정보시스템의 안정 운영·성능·개선을 점검하는 감리",
    keywords: ["개발 소프트웨어", "상용 소프트웨어", "인프라", "배포관리", "장애관리", "보안", "성능", "패치", "백업"],
    tables: [
      {
        caption: "운영 감리의 감리대상별 점검 분야",
        headers: ["감리대상", "점검분야"],
        rows: [
          ["개발 소프트웨어(DS)", "릴리즈 및 배포관리, 테스트 지원, 장애관리"],
          ["인프라(IF)", "신규 및 변경 서비스의 기획, 구현을 위한 지원 서비스 수준관리, 서비스 보고, 서비스 연속성 및 가용성 관리, 용량관리, 정보보안관리, 비즈니스 관계 관리, 공급자 관리, 인시던트 및 서비스 요청 관리, 문제 관리, 구성관리, 변경 및 릴리즈 관리, 운영상태관리"],
        ],
      },
      {
        caption: "유지보수 감리의 감리대상별 점검 분야",
        headers: ["감리대상", "점검분야"],
        rows: [
          ["개발 소프트웨어(DS)", "응용서비스 모니터링, 응용서비스장애처리, 사용자지원, 성능관리, 정기/비정기점검, 시스템 테스트 지원, 장애관리, 유지보수 계획, 유지보수 표준 및 절차, 요구사항관리, 유지보수 이행(CSR 처리), 구성관리, 릴리즈 및 배포관리(이관)"],
          ["상용 소프트웨어(CS)", "유지보수 계획, 유지보수 표준 및 절차, 업그레이드 및 패치, 이전 및 재설치, 일상지원, 긴급/장애처리, 예방점검, 운영자 교육, 사용자 교육, 보안 정책 및 계획 수립, 보안 점검 및 예방 활동, 보안 조치 및 기술지원"],
          ["인프라(IF)", "OS 업그레이드 및 패치, HW 업그레이드, 예방 점검(일상점검, 정기점검, 비정기점검), 긴급/장애처리, 통합자원할당 및 회수, 운영자교육, 기술이전, 부품지원, 운영상태관리, 이전 및 재설치"],
        ],
      },
    ],
    notes: ["개념도: 정보시스템 구축단계(단계별 감리 — 계획에 맞게 설계·개발·테스트가 제대로 이루어지고 있는지 점검, 요구사항 충족여부·일정 및 범위관리·품질관리 등) ↔ 운영 및 유지보수 단계(운영 및 유지보수 감리 — 시스템이 안정적이고 효율적으로 운영 및 개선 되는지 점검, 운영 안정성·성능 유지·보안·백업 및 복구 등)"],
  },
  {
    title: "정보시스템 감리 의무 대상과 관점별 점검 기준",
    course: "SE",
    definition:
      "정보시스템 효율성 향상과 안전성 확보 위해 제3자적 관점에서 구축 사항을 종합적으로 점검, 개선하는 활동",
    defShort: "제3자 관점에서 정보시스템 구축을 점검·개선하는 활동의 기준",
    keywords: ["3자적 관점", "대국민 서비스", "공동 행정 서비스", "5억 이상", "기관장의 필요성 인정", "절차", "산출물", "성과"],
    tables: [
      {
        caption: "의무 대상",
        headers: ["영역", "구분", "의무대상"],
        rows: [
          ["정보화 사업", "정보시스템의 특성", "대국민 서비스를 위한 행정/민원 업무 용도. 여러 중앙행정기관 등이 공동 구축, 사용"],
          ["정보화 사업", "사업비 규모", "사업비가 5억 원 이상인 경우"],
          ["정보화 사업", "행정기관 등의 장이 필요성 판단", "해당 기관 장이 감리가 필요하다고 인정하는 경우"],
          ["행정/공공 기관", "행정기관", "중앙행정기관 및 그 소속기관, 지방자치단체"],
          ["행정/공공 기관", "공공기관", "'공공기관의 운영에 관한 법률' 제4조에 따른 법인·단체 또는 기관. '지방공기업법'에 따른 지방공사 및 지방공단, 특별법에 따라 설립된 특수법인. '초·중등교육법', '고등교육법'의 각급 학교, 그 밖에 대통령령으로 정하는 법인·단체 또는 기관"],
        ],
      },
      {
        caption: "정보시스템 관점별 점검 기준 [성산절]",
        headers: ["감리 관점", "점검 기준"],
        rows: [
          ["성과", "실현성, 충족성"],
          ["산출물", "기능성, 무결성, 편의성, 안전성, 보안성, 효율성, 준거성"],
          ["절차", "절차 적정성, 준수성"],
        ],
      },
      {
        caption: "정보시스템 3단계 감리 수행 절차",
        headers: ["구분", "요구정의단계", "설계단계", "종료단계"],
        rows: [
          ["수행 절차", "A00 예비조사", "B00 현장감리", "C00 조치확인"],
          ["산출물", "001. 감리계획서", "002. 감리수행결과보고서", "003. 시정조치확인보고서"],
        ],
      },
    ],
  },
  {
    title: "공통감리 절차",
    course: "SE",
    definition:
      "정보시스템 개발사업, EA, ISP수립, DB구축 등 모든 유형의 정보화 사업에 공통적으로 적용되는 감리절차",
    defShort: "모든 정보화 사업에 공통 적용되는 감리 3단계 절차 [예현조]",
    keywords: ["[예현조]", "예비조사", "현장감리", "조치 확인", "준실감", "감착감보종보", "준시작보"],
    tables: [
      {
        caption: "절차 [예현조]",
        headers: ["절차", "세부절차", "산출물"],
        rows: [
          ["A00. 예비조사", "예비조사 준비 → 예비조사 실시 → 감리계획서 작성 및 제출", "감리계획서"],
          ["B00. 현장감리", "감리시작 → 착수회의 → 감리수행 → 보고서(안) 작성 및 검토 → 종료회의 → 보고서 확정 및 통보", "감리수행결과 보고서"],
          ["C00. 조치 확인", "시정조치 확인준비 → 시정조치 확인 → 확인보고서 작성 및 협의 → 확인보고서 확정 및 제출", "시정조치확인 보고서"],
        ],
      },
      {
        caption: "감리법인·발주기관·피감리인 흐름",
        headers: ["순서", "활동", "산출물"],
        rows: [
          ["1", "감리계약체결 → 감리계획서의 세부점검항목 협의", "감리 기본점검표"],
          ["2", "감리계획서 제출 → 발주기관·피감리인 감리계획서 접수", "감리계획서"],
          ["3~5", "착수회의 → 현장감리 시행 → 종료회의", ""],
          ["6", "감리보고서 통보 → 발주기관·피감리인 감리보고서 검토", "감리보고서"],
          ["7~9", "감리결과 조치계획 수립 및 제출(피감리인) → 접수 및 검토(발주기관) → 감리결과 반영", ""],
          ["10~12", "감리결과 조치내역 확인 요청 → 확인(감리법인) → 조치내역 확인보고서 제출", "감리결과 조치내역 확인 보고서"],
        ],
      },
    ],
  },
  {
    title: "정보시스템 감리결과보고서 (구성, 보고사항)",
    course: "SE",
    definition:
      "독립된 감리법인이 제3자적 관점에서 수행한 현장감리 내용에 대해 결과를 정리하고 제출하는 최종결과보고서",
    defShort: "감리법인이 현장감리 결과를 정리·제출하는 최종 보고서",
    keywords: ["1)종합의견 2)감리영역별 점검결과 3)별첨", "감리계획서", "필수", "협의", "권고", "장기", "단기"],
    tables: [
      {
        caption: "구성",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["1. 종합의견", "전제조건", "감리보고서를 작성할 시점에 대한 전제조건 정의"],
          ["1. 종합의견", "총평", "점검대상 사업에 대한 감리의견 총괄정리"],
          ["1. 종합의견", "감리영역별 상세점검결과 요약", "개선권고사항 및 유형, 중요도, 발주기관 협조필요여부의 표시"],
          ["2. 감리영역별 점검결과", "감리영역 1", "가.점검항목별 점검결과, 나.상세점검결과 — 사업관리 및 품질보증활동 영역 점검결과"],
          ["2. 감리영역별 점검결과", "감리영역 2", "가.점검항목별 점검결과, 나.상세점검결과 — 응용시스템 영역 점검결과"],
          ["2. 감리영역별 점검결과", "감리영역 3", "가.점검항목별 점검결과, 나.상세점검결과 — 데이터베이스, 시스템아키텍처 및 보안 영역 점검결과"],
          ["3. 별첨", "감리계획서", "감리수행 전 제출된 감리계획서의 첨부"],
        ],
      },
      {
        caption: "개선권고 유형·시점",
        headers: ["구분", "유형"],
        rows: [
          ["개선권고 유형", "필수, 협의, 권고"],
          ["개선시점", "장기, 단기"],
          ["기타 표기", "중요도, 발주기관 협조필요"],
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
    defShort: "운영 성과 측정·평가로 정비 대상을 정해 성과를 높이는 활동",
    keywords: ["전자정부법 제23조", "운영의 적정성", "유지의 용이성", "비용의 효율성", "기능 활용도", "업무성과 달성도"],
    tables: [
      {
        caption: "추진절차",
        headers: ["추진절차", "절차 정의", "주요활동"],
        rows: [
          ["업무성과 계획관리", "정보시스템 운영 성과를 측정할 수 있도록 성과 지표를 설계하고, 매년 성과지표별 목표를 수립", "연중 실적 관리. 성과지표별 목표 수립"],
          ["통폐합 대상관리", "3~4등급으로 분류된 정보시스템 대상으로 통폐합 추진 가능성 검토", "통폐합 추진 가능성 검토. 통폐합 불가 시 성과관리 심의위원회 심의"],
          ["성과측정 대상관리", "성과측정 대상을 확인하고 필요시 성과측정 제외 신청", "서비스 오픈 후 1년경과한 정보시스템"],
          ["성과측정 및 평가", "비용 및 업무 측면의 성과를 측정하고 결과와 증빙자료를 제출", "비용측면 성과측정. 업무측면 성과측정"],
          ["폐기 예외관리", "성과평가 결과 총점 40점 미만인(폐기 대상) 정보시스템 중 폐기 예외 사유에 해당하는 경우 예외 신청 및 관리", "폐기예외 검토. 성과관리심의위원회 심의"],
          ["정비계획 수립", "성과평가 및 폐기 예외관리 결과에 따라 정비유형이 개선, 폐기로 분류된 정보시스템의 정비계획 수립", "폐기-통폐합-기능고도화-전면재개발 순으로 검토"],
          ["정비계획 이행관리", "정비 대상 정보시스템별로 수립한 정비계획의 정비방식과 정비시점에 따라 활동 수행 및 결과관리", "정비활동 수행. 정비방법 변경 시 성과관리 심의위원회 심의"],
        ],
      },
      {
        caption: "성과측정 지표",
        headers: ["구분", "지표", "설명", "측정 산식"],
        rows: [
          ["비용지표", "운영의 적정성", "개발비와 유지보수비의 비율을 점검하여 적정한 비용 구조로 운영하는지 평가", "누적 유지보수비 / 누적 개발비 × 100%"],
          ["비용지표", "유지의 용이성", "투입 운영유지비의 증감 수준을 점검하여 정보시스템이 비용 효율적 구조 유지하는지 평가", "전년대비 운영유지비 증감률"],
          ["비용지표", "비용의 효율성", "정보시스템의 활용 규모 대비 비용 효율적 구조를 유지하고 있는지 평가", "전년대비 활용규모당 운영유지비 증감률"],
          ["업무지표", "기능 활용도", "업무지원 및 서비스제공을 위해 구현된 기능의 실제 활용 수준 평가", "기능별 전년대비 사용량 증감률에 따른 활용점수의 평균값"],
          ["업무성과 달성도", "공통지표·고유지표", "직전연도 성과지표별 성과 목표 대비 업무성과의 달성수준을 평가", "측정대상연도 업무성과 실적치 / 업무성과 목표치 × 100%"],
        ],
      },
      {
        caption: "정비 방식",
        headers: ["정비 방식", "설명"],
        rows: [
          ["폐기", "현재 제공하는 서비스를 앞으로 더 이상 제공하지 않고 종료하는 경우"],
          ["통폐합", "다른 정보시스템으로 통합, 현행 시스템은 폐기하기로 결정한 경우"],
          ["기능고도화", "다른 정보시스템의 기능이나 서비스를 통합하여 현행 정보시스템의 규모를 확장하는 경우, 기능개선 사업을 추진하거나 시스템 개선 범위 내에서 정비활동이 가능한 경우"],
          ["전면재개발", "정보시스템의 개선을 위해 현행 정보시스템에서 제공하는 기능과 서비스를 새롭게 구축하고 현행 정보시스템은 폐기하기로 결정한 경우"],
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
    defShort: "SW 안전 책임자와 개발·운영단계 안전 관리기준을 담은 지침",
    keywords: ["SW진흥법 제30조 제2항", "총괄 담당자 지정", "관리 대상 소프트웨어 지정", "개발단계에서의 안전확보", "운영단계에서의 안전확보"],
    tables: [
      {
        caption: "주요 용어",
        headers: ["용어", "정의"],
        rows: [
          ["위험원", "생명, 신체, 재산 피해, 시스템 손실을 초래할 수 있는 SW 원인"],
          ["장애", "소프트웨어 오류, 하드웨어 고장으로 SW 를 사용 어려운 상태"],
          ["소프트웨어 안전", "사이버 공격 등의 외부침입 없이, SW내부의 오작동과 안전기능 미비 등으로 발생 가능한 생명, 신체, 재산의 피해에 대비된 상태"],
        ],
      },
      {
        caption: "지침 조항 내용",
        headers: ["장", "조"],
        rows: [
          ["제1장 총칙", "제1조 목적, 제2조 정의, 제3조 적용 범위, 제4조 업무 및 담당자(총괄 담당자 지정), 제5조 안전관리 대상 SW지정"],
          ["제2장 SW개발단계 안전확보", "제6조 안전 요구사항의 정의, 제7조 SW 위험원 분석, 제8조 SW 설계 및 구현, 제9조 SW 검증"],
          ["제3장 SW운영단계 안전확보", "제10조 SW 운영관리 계획, 제11조 운영 위험 분석, 제12조 SW 안전점검, 제13조 SW 변경관리, 제14조 장애관리"],
          ["제4장 그 외 SW 안전확보 사항", "제15조 정보공유, 제16조 기반확보, 제17조 기타사항, 제18조 재검토 기한"],
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
    defShort: "대규모 신규 사업의 예산 편성 전 타당성을 검증·평가하는 제도",
    keywords: ["국가재정법", "사업비 500억 & 국가재정지원규모 300억 신규 사업"],
    tables: [
      {
        caption: "예비타당성 조사 제도 필요성",
        headers: ["구분", "필요성", "설명"],
        rows: [
          ["경제적 측면", "예산낭비 최소화", "수요가 없거나 경제성이 없는 사업이 추진될 가능성 제거"],
          ["기술적 측면", "사업 리스크 완화", "예기치 않은 사업비 증액과 잦은 사업계획 변경 등을 초래할 우려 제거"],
          ["기술적 측면", "사업 취소 방지", "사업에 착수한 이후 타당성 없음을 이유로 중도에 사업이 취소되는 것을 방지"],
          ["정책적 측면", "사업의 우선순위", "개별 사업의 타당성 여부를 판단함과 동시에 보다 폭넓은 '후보사업군'을 대상으로 한 면밀한 비교·검토를 통해 사업의 추진 여부를 결정"],
        ],
      },
      {
        caption: "예비타당성 조사 제도 기준 [사5지 3신]",
        headers: ["기준", "설명"],
        rows: [
          ["사업비 규모", "대상사업은 총사업비가 500억원 이상이고 국가의 재정지원 규모가 300억원 이상인 신규사업 (사5지3신)"],
          ["정보화 사업 대상", "국가정보화 기본법 제 15조 1항에 따른 정보화 사업. 국가기관등은 행정업무의 효율성 향상과 국민 편익 증진을 위하여 행정, 보건, 사회복지, 교육, 문화, 환경, 과학기술, 재난안전 등 소관 업무에 대한 정보화사업을 추진하여야 함"],
          ["신규사업", "타당성조사비, 설계비 등의 국고지원이 없었던 사업"],
          ["대상사업 요건", "국가직접시행사업, 국가대행사업, 지방자치단체보조사업, 민간투자사업 등 정부 재정지원이 포함되는 모든 사업을 대상"],
        ],
      },
    ],
  },
  {
    title: "소프트웨어사업 영향평가",
    course: "SE",
    definition:
      "국가기관 등에서 소프트웨어사업의 예산편성, 발주, 소프트웨어 배포 및 서비스 제공을 추진하는 경우 민간 소프트웨어 시장 침해 등 소프트웨어 산업 생태계에 미치는 영향을 검토하여 사전 조정하는 제도",
    defShort: "공공 SW사업의 민간시장 침해 영향을 사전 검토·조정하는 제도",
    keywords: ["소프트웨어 진흥법 43조", "민간 시장 위축 방지", "대상사업 명확화", "SW사업자에게 재평가 요청권 부여"],
    tables: [
      {
        caption: "개념도(절차)",
        headers: ["순서", "절차"],
        rows: [
          ["1", "소프트웨어사업 기본정보 작성"],
          ["2", "운영계획 검토 (사업구분: 상용소프트웨어의 구매·설치 및 유지관리 사업 / 국가안보·치안·외교 등 민간이 서비스하기에 부적합한 사업 / 민간투자형 소프트웨어 사업 / 단일기관 내부용(소속기관 제외) 화면을 대상으로 제공하는 소프트웨어 사업 / 데이터베이스 구축 사업 / 소프트웨어 기능개선·추가 또는 변경이 없는 단순 유지관리·운영사업 / 그 외 소프트웨어 사업)"],
          ["3", "민간 소프트웨어 시장 침해 가능성 검토 → 민간 동일 유사 소프트웨어 유무 확인"],
          ["4", "사업의 필요성 및 공공성 검토"],
          ["5", "종합의견 작성"],
        ],
      },
      {
        caption: "법적 근거·대상·제외",
        headers: ["구분", "설명"],
        rows: [
          ["법적 근거", "'소프트웨어 진흥법' 제43조(소프트웨어사업 영향평가), 시행령 제35조(영향평가의 실시), 제36조(영향평가 제외 사업), 제37조(영향평가 결과의 재평가 제외사유). '소프트웨어사업 계약 및 관리감독 지침' 제5조(소프트웨어사업 영향평가), 제6조(영향평가 제외대상)"],
          ["대상 기관", "국가기관, 지방자치단체 또는 국가·지방자치단체가 투자하거나 출연한 법인·단체로서 대통령으로 정하는 기관('소프트웨어 진흥법' 제21조 제4항). 시행령 제21조 규정에 해당하는 모든 기관"],
          ["대상 사업", "국가기관 등의 장이 발주하는 소프트웨어 기획, 구축, 유지관리 사업"],
          ["제외 사업", "1. 상용소프트웨어의 구매·설치 및 유지·관리 사업 2. 국가안보, 치안, 외교 등의 분야와 관련된 소프트웨어사업으로서 민간이 서비스하는 것이 부적합한 소프트웨어사업 3. 민간투자형 소프트웨어사업 4. 그밖에 민간 소프트웨어 시장에 미치는 영향을 고려하여 과학기술정보통신부장관이 정하여 고시하는 소프트웨어사업 — 지침 제6조: 1) 단일기관 내부사용 목적의 소프트웨어사업 2) 데이터베이스 구축 사업 3) 소프트웨어 기능개선·추가 또는 변경이 없는 단순 유지관리·운영사업"],
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
    defShort: "공공사업에서 상용SW만 별도 발주·평가·계약해 직접 구매하는 제도",
    keywords: ["별도 발주", "3억", "5천만원", "소프트웨어 진흥법 제54조"],
    tables: [
      {
        caption: "상용 SW 직접 구매 대상 및 제외 기준",
        headers: ["구분", "설명"],
        rows: [
          ["상용SW 직접구매 대상", "① 총 사업규모: 3억원 이상(VAT 포함) ② 조달청 종합쇼핑몰 등록 SW(가격에 관계없음) ③ SW가격: 5천만원 이상 또는 동일 SW의 다량구매 가격이 5천만원을 초과하며 인증을 획득한 제품 — GS, 행정업무용, CC, NEP, NET, 국가정보원 검증/지정"],
          ["제외기준 사업", "'소프트웨어진흥법' 제40조에 민간투자형 SW 사업"],
          ["제외기준 SW", "시스템 통합 불가능, 비용 상승 초래, 사업기간 지연, 비효율적"],
        ],
      },
      {
        caption: "법적 근거",
        headers: ["근거법령", "조항", "설명"],
        rows: [
          ["소프트웨어 진흥법", "제54조", "국가기관 등의 상용소프트웨어 구매"],
          ["소프트웨어사업 계약 및 관리감독에 관한 지침", "제7조", "상용소프트웨어 직접구매 대상"],
          ["소프트웨어사업 계약 및 관리감독에 관한 지침", "제8조", "상용소프트웨어 직접구매 제외"],
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
    defShort: "실사용 관찰·분석으로 제품의 효율성·문제점을 찾는 테스트",
    keywords: ["UX리서치 방법론", "SUS설문", "편의성", "정확성", "만족도", "유연성", "탐구형테스트", "평가형 테스트"],
    tables: [
      {
        caption: "사용성 평가 절차",
        headers: ["절차", "평가내용", "산출물"],
        rows: [
          ["1. 계획 수립", "평가 목적 및 대상 분석. 사용자 정의. 사용자 태스크 분석, 주요기능 및 태스크 추출", "사용성 평가 계획서"],
          ["2. 평가 설계", "테스트 디자인: 질적/양적 결과 데이터 정의. 테스트 참가자 선정, 테스트 선정. 질문지 인터뷰 작성", "사용성 평가 설계서"],
          ["3. 평가 실행", "진행 스크립트 작성. 사전 테스트: 연습 시행, 진행 스크립트 수정. 본 테스트 진행: 사용자 Verbal/관찰 사항 체크", "질적/양적 Row Data"],
          ["4. 분석/보고", "결과 분석: 질적/양적 데이터 분석. 보고서 작성: 사용성 고려사항 등", "사용성 평가 결과 보고서"],
        ],
      },
      {
        caption: "사용성 테스트의 4가지 유형",
        headers: ["유형", "시기", "목적", "방법", "설명"],
        rows: [
          ["탐색적 테스트", "초반", "디자인 컨셉 유효성", "페이퍼 mock-up, 화면 디자인", "제품을 사용하면서 무엇을 상상하는가? 제품의 기능들이 사용자에게 가치를 제공하는가?"],
          ["평가 테스트", "초/중반", "컨셉 효율성", "정량적 자료, 과업 수행", "UI를 직관적으로 사용하는가?"],
          ["검증 테스트", "후반", "사용성 보증 표준 부합 여부", "실행 속도(속도 정확도) 선호도, 결함 발견", "과업 표준이 '시간 안에 완료하는 것'이라면 참여자의 70%는 표준에 들어가야 한다"],
          ["비교 테스트", "전체", "대안평가", "I/F 스타일, 요소의 평가", "경쟁사 제품에 반해 얼만큼의 견줄 수 있는지 제안된 타겟 집단의 잠재적 선호도"],
        ],
      },
      {
        caption: "사용성 평가 항목 및 측정 지표",
        headers: ["평가항목", "측정지표", "설명"],
        rows: [
          ["작업시간", "완료시간, 로딩시간", "사용자가 특정 목표를 완료한 시간"],
          ["작업시간", "이벤트까지 걸린 시간", "사용자가 특정 기능 또는 인터랙션 모드에 머무는 시간"],
          ["작업시간", "입력시간", "사용자가 특정 기능을 입력하는 시간"],
          ["사용패턴", "사용빈도, 정보접근성", "사용자의 행동 또는 기능의 사용빈도"],
          ["사용패턴", "최선 해결책과의 편차", "최적의 해결방법과 실제 행동 사이의 비율"],
          ["정확성", "오류율, 공간 정확도", "사용자가 특정 목표를 완료할 때까지 에러의 양"],
          ["정확성", "정보의 정확성", "검색 정보의 총량과 정확한 정보 사이의 비율"],
          ["완성도", "성공/실패 여부와 비율", "사용자의 목표 성공여부에 대한 숫자 혹은 백분율(%)"],
          ["학습 용이성", "행동 유도성", "객체를 보는 즉시 사용방법을 알 수 있는 정도"],
          ["학습 용이성", "기억 용이성", "특정 목표를 달성하기 위해 필요한 기능 습득 정도, 외부 요소가 간섭없이 습득하는 정도"],
          ["일관성", "시각적 일관성, 기능적 일관성", "특정 목표를 달성하기 위해 필요한 기능 습득 정도, 외부 요소가 간섭없이 습득하는 정도"],
          ["일관성", "가독성, 친숙성", "사용자가 이해할 수 있는 인식 요소와의 상호작용을 제공하는지의 여부"],
        ],
      },
    ],
  },
  {
    title: "선형 자료구조와 비선형 자료구조",
    course: "DS",
    definition: "데이터 사이의 대응 구조에 따라 선형, 비선형 자료구조로 분류",
    defShort: "데이터 대응 구조에 따라 선형(1:1)·비선형(1:N)으로 나눈 분류",
    keywords: ["선형자료구조(Array, Linked List, 스택(LIFO), 큐(FIFO))", "비선형자료구조(트리, 그래프)"],
    tables: [
      {
        caption: "선형 자료구조 (1:1 대응 구조로 저장 — 구조가 간단, access 속도가 빠름)",
        headers: ["유형", "설명"],
        rows: [
          ["Array", "같은 데이터형의 요소들이 동일한 크기로 순서를 갖고 순차적으로 나열되어 있는 자료구조"],
          ["Linked List", "각 노드가 데이터와 포인터를 가지고 한 줄로 연결되는 방식으로 데이터를 저장하는 자료구조"],
          ["Stack (LIFO)", "모든 원소들의 삽입과 삭제가 리스트의 한쪽 끝에서만 수행되는 제한 조건을 가지는 선형 자료 구조. 먼저 들어온 데이터가 나중에 나가는 자료구조(LIFO)"],
          ["Queue (FIFO)", "선형리스트의 한쪽에서는 삽입, 다른 한쪽에서는 삭제되도록, 먼저 들어온 데이터가 먼저 나가는 자료구조"],
        ],
      },
      {
        caption: "비선형 자료구조 (1:N 또는 M:N 구조로 관계 — 자료 간의 관계를 표현)",
        headers: ["유형", "설명"],
        rows: [
          ["Tree", "노드들이 나무 가지처럼 연결된 비선형 계층적 자료구조. 그래프의 일종으로, 한 노드에서 시작해서 다른 정점들을 순회하여 자기 자신에게 돌아오는(순환이 없는) 연결 그래프"],
          ["Graph", "정점(Vertex)의 집합 V와 간선(Edge)의 집합으로 구성된 비선형 데이터 구조. 정점의 집합을 V, 간선의 집합을 E, 그래프를 G라고 했을 때, G = (V, E)"],
        ],
      },
    ],
  },
  {
    title: "링크드 리스트(Linked List)",
    course: "DS",
    definition:
      "각 노드(Node)가 데이터(Data)와 포인터(Pointer)를 가지고 한 줄로 연결되어 있는 데이터를 저장하는 자료 구조",
    defShort: "노드가 데이터와 포인터로 한 줄로 연결된 자료 구조",
    keywords: ["노드 = 데이터 + 포인터", "Singly / Doubly / Single Circular / Double Circular Linked List"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "개념", "설명"],
        rows: [
          ["Head", "시작점", "외부에서 해당 리스트를 참조할 때 가장 처음 접근하는 주소, 시작을 알리는 노드"],
          ["Tail", "종료점", "해당 리스트를 참조, 처리할 때 끝을 알리는 노드"],
          ["Node", "실제 데이터", "실제 데이터를 저장하는 노드, 자료 저장소와 다음 노드에 대한 포인터로 구성"],
        ],
      },
      {
        caption: "삽입/삭제 연산",
        headers: ["연산", "설명"],
        rows: [
          ["삽입", "1) 노드1이 노드2를 가리키도록 포인터 수정 2) 삽입된 노드2는 다음 노드로 노드3 가리키도록 포인터 수정 3) 노드2가 마지막일 경우 Null을 가리키도록 수정"],
          ["삭제", "1) 노드2를 가리키던 노드1이 노드3을 가리키도록 포인터 변경 2) 노드2를 free 시킴"],
        ],
      },
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["Singly Linked List", "각 노드는 저장할 데이터와 다음 노드의 포인터로 구성. 처음 노드의 위치를 알고 이전 노드는 알 필요 없음. 마지막 노드의 포인터는 Null 가리킴"],
          ["Double Linked List", "이전/다음 노드를 가리키는 포인터, 저장할 Data를 소유. 전/후방 어느 쪽으로도 순환이 가능. 처음과 마지막 노드의 포인터는 Null을 가리킴"],
          ["Singly Circular Linked List", "Single Linked List와 모두 동일하나 마지막 Node가 Null이 아닌 처음 노드를 가리키는 것이 차이"],
          ["Double Circular Linked List", "Double Linked List와 모두 동일하나 처음과 마지막 노드가 마지막과 처음 노드를 가리킴"],
        ],
      },
    ],
  },
  {
    title: "Stack",
    course: "DS",
    definition:
      "나중에 삽입된 자료가 가장 먼저 삭제되는 후입선출(LIFO)방식으로 리스트의 한쪽 끝으로만 자료의 삽입, 삭제 작업이 이루어지는 자료구조",
    defShort: "한쪽 끝에서만 삽입·삭제하는 후입선출(LIFO) 자료구조",
    keywords: ["LIFO", "Top", "bottom", "삽입(Push)", "제거(pop)"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명"],
        rows: [
          ["TOP", "스택에서 삽입, 삭제가 일어나는 리스트의 끝. 스택 포인터(stack pointer)"],
          ["Bottom", "TOP의 반대쪽 리스트의 끝. Bottom에선 삽입, 삭제가 일어나지 않음"],
          ["PUSH", "스택에서 값을 삽입(입력) 하는 것. *overflow: 스택 포인터 > 스택 크기"],
          ["POP", "스택에서 값을 삭제(출력) 하는 것. *Underflow: Top pointer 주소 = 0"],
        ],
      },
      {
        caption: "연산",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["연산", "push(item)", "item 하나를 스택의 가장 윗 부분에 추가"],
          ["연산", "pop()", "스택에서 가장 위에 있는 항목을 제거하고 Return"],
          ["연산", "init()", "스택 초기화 스택 포인터를 0으로 설정"],
          ["연산", "isEmpty()", "스택이 비어 있을 때에 true를 반환"],
          ["발생 예외", "Overflow", "Stack Pointer의 값이 스택에서 할당 받은 메모리 부분의 마지막 주소보다 커져 스택의 모든 기억장소가 꽉 채워져 있는 상태. 더 이상 자료를 삽입할 수 없어 Overflow를 발생"],
          ["발생 예외", "Underflow", "Stack Pointer의 주소 0을 가지고 있다면 스택에는 삭제할 자료가 없으므로 Underflow를 발생"],
        ],
      },
    ],
  },
  {
    title: "Queue",
    course: "DS",
    definition:
      "선형리스트의 한쪽에서는 삽입 작업이 이루어지고 다른 한쪽에서는 삭제 작업이 이루어지도록, 먼저 들어온 데이터가 먼저 나가는 자료구조",
    defShort: "한쪽은 삽입, 반대쪽은 삭제하는 선입선출(FIFO) 자료구조",
    keywords: ["FIFO", "선형큐", "순환큐(원형큐)", "링크드리스트큐", "덱 [선순링덱]"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명"],
        rows: [
          ["Front", "줄의 맨 앞을 전단(Front)"],
          ["Rear", "맨 뒤를 후단(Rear)"],
          ["Enqueue", "후단에 데이터를 삽입하는 작업"],
          ["Dequeue", "전단의 데이터를 삭제하는 작업"],
          ["isFull", "큐가 가득 차 있는지 판단 (배열만해당)"],
          ["isEmpty", "큐가 공백 큐인지 확인"],
        ],
      },
      {
        caption: "유형 [선순링덱]",
        headers: ["유형", "설명"],
        rows: [
          ["선형 큐", "배열을 선형으로 사용하여 큐를 구현"],
          ["순환 큐(원형 큐)", "배열의 끝과 시작이 이어진 것처럼(논리적으로 원형) 전단과 후단을 관리"],
          ["LinkedList 큐", "LinkedList로 구현한 큐"],
          ["덱(Double-ended Queue)", "큐의 전단(front)과 후단(rear)에서 모두 삽입과 삭제가 가능한 큐"],
        ],
      },
    ],
  },
  {
    title: "이진 탐색 트리(Binary Search Tree)",
    course: "DS",
    definition:
      "이진탐색(binary search)과 연결리스트(linked list)를 결합한 자료구조로, 이진탐색의 효율적인 탐색 능력을 유지하면서 빈번한 입력과 삭제가 가능하도록 고안된 자료 구조",
    defShort: "이진탐색과 연결리스트를 결합해 탐색·삽입·삭제가 효율적인 트리",
    keywords: ["이진 탐색", "재귀"],
    tables: [
      {
        caption: "성질",
        headers: ["번호", "성질"],
        rows: [
          ["1)", "각 노드의 좌측 서브 트리에는 해당 노드의 값보다 작은 값을 지닌 노드들로 구성"],
          ["2)", "각 노드의 우측 서브 트리에는 해당 노드의 값보다 큰 값을 지닌 노드들로 구성"],
          ["3)", "중복된 노드가 없음"],
          ["4)", "좌측 서브 트리와 우측 서브 트리도 모두 이진 탐색 트리"],
        ],
      },
      {
        caption: "데이터 탐색 매커니즘 (키 x를 가진 노드 검색 시)",
        headers: ["순서", "설명"],
        rows: [
          ["1", "트리에 해당 노드가 존재 시 해당 노드 리턴, 미 존재 시 NULL 리턴"],
          ["2", "검색 값을 루트 노드와 먼저 비교, 일치하면 루트 노드 리턴"],
          ["3", "불일치 & (검색 값 < 루트 노드 값): 좌측 서브 트리에서 재귀적 검색"],
          ["4", "불일치 & (검색 값 ≥ 루트 노드 값): 우측 서브 트리에서 재귀적 검색"],
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
    defShort: "좌우 서브트리 높이차(BF)가 1 이하가 되게 회전하는 균형 BST",
    keywords: ["Balance factor", "균형 이진 트리", "LL", "RR", "LR", "RL"],
    tables: [
      {
        caption: "트리 회전",
        headers: ["회전 타입", "설명"],
        rows: [
          ["LL", "왼쪽-왼쪽으로 치우친 경우(insert 3, 2, 1) → 오른쪽으로 한 번 회전하여 균형"],
          ["RR", "오른쪽-오른쪽으로 치우친 경우(insert 1, 2, 3) → 왼쪽으로 한 번 회전하여 균형"],
          ["LR", "왼쪽-오른쪽으로 치우친 경우(insert 3, 1, 2) → LL 회전 후 RR 회전"],
          ["RL", "오른쪽-왼쪽으로 치우친 경우(insert 1, 3, 2) → RR 회전 후 LL 회전"],
        ],
      },
      {
        caption: "추가 순서 예: 9 → 4 → 3 → 12 → 14 → 10",
        headers: ["단계", "동작"],
        rows: [
          ["(1)~(3)", "9 삽입 → 4 삽입 → 3 삽입(BF +2 발생)"],
          ["(4)", "LL 회전 → 4가 루트(3, 9 자식)"],
          ["(5)~(6)", "12 삽입 → 14 삽입(9의 BF −2 발생)"],
          ["(7)", "RR 회전 → 12가 서브트리 루트(9, 14 자식)"],
          ["(8)~(9)", "10 삽입(BF −2) → RL 회전 → 9가 루트(4, 12 서브트리 균형)"],
        ],
      },
    ],
  },
  {
    title: "힙(Heap)",
    course: "DS",
    definition:
      "여러 개의 노드들 가운데서 가장 큰 키 값을 가지는 노드나 가장 작은 키 값을 가지는 노드를 빠른 시간 내에 찾아 내도록 만들어진 자료 구조",
    defShort: "최대·최소 키 값을 빠르게 찾도록 만든 완전 이진 트리",
    keywords: ["완전 이진 트리", "최대 힙(Max-Heap)", "최소 힙(Min-Heap)"],
    tables: [
      {
        caption: "최대 힙(Max-Heap)과 최소 힙(Min-Heap)",
        headers: ["구분", "개념", "노드"],
        rows: [
          ["최대 힙(Max-Heap)", "완전 이진 트리이며 heap의 한 노드는 그 노드의 모든 자손 노드들보다 큰 키 값을 가짐. 루트에는 항상 가장 큰 키 값을 가지는 노드가 위치하므로 우선순위 큐(priority queue)를 구성하는데 적합한 자료 구조", "자손 노드보다 큰 값"],
          ["최소 힙(Min-Heap)", "완전 이진 트리이며 heap의 한 노드는 그 노드의 모든 후손 노드들보다 작은 키 값을 가짐", "자손 노드보다 작은 값"],
        ],
      },
      {
        caption: "Min-Heap 삽입 연산 (2, 6, 4, 9, 7 순서 삽입 후 1 추가)",
        headers: ["단계", "설명"],
        rows: [
          ["1", "2, 6, 4, 9, 7을 순서대로 삽입"],
          ["2", "새로운 노드인 1을 추가 — 완전 이진 트리 형태를 유지하기 위해 노드 4의 왼쪽으로 삽입"],
          ["3", "자식 노드 1은 부모 노드 4보다 작으므로 1과 4를 치환"],
          ["4", "자식 노드 1은 부모 노드 2보다 작으므로 1과 2를 치환"],
          ["5", "삽입 완료 — 1이 루트"],
        ],
      },
    ],
  },
  {
    title: "B-Tree(Balanced Tree)",
    course: "DS",
    definition: "하나의 노드가 가질 수 있는 자식 노드의 최대 숫자가 2보다 큰 이진 트리의 확장형 트리 구조",
    defShort: "자식 노드를 2개 이상 갖는 이진 트리의 확장형 균형 트리",
    keywords: ["m/2", "분할", "균형 유지"],
    tables: [
      {
        caption: "구조와 특징",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["구조", "Root node", "최소 2개의 자식 노드 보유, 최소 한 개의 값 보유"],
          ["구조", "Internal node", "최대 m개의 자식 노드 보유(차수가 m일 경우)"],
          ["구조", "Leaf node", "최하위 노드는 동일레벨로 구현"],
          ["특징", "자식노드 수", "리프, 루트를 제외한 노드는 최소 m/2개의 자료 보유"],
          ["특징", "균등 탐색 속도", "최악의 경우가 존재하지 않아 시간 복잡도는 O(log N)으로 일정"],
          ["특징", "효율성", "자식 노드를 많이 보유하여 트리의 높이가 줄어들어 효율성 확보"],
          ["특징", "정렬상태", "각 노드에 입력된 자료는 정렬된 상태로 존재"],
          ["유형", "B+ Tree", "인덱스 세트(index set)와 순차세트(sequence set)로 구성된 트리"],
          ["유형", "B* Tree", "리프, 루트를 제외한 노드가 최소한 2/3가 채워지도록 제한한 트리"],
        ],
      },
      {
        caption: "삽입/삭제 연산",
        headers: ["연산", "설명"],
        rows: [
          ["삽입", "1) 새로운 키 값은 항상 잎에 삽입 2) 해당 노드가 가득 차 있지 않은 경우는 키 값을 오름차순으로 채움 3) 해당 노드가 가득 찬 경우(Overflow) 해당 노드를 두개의 노드로 분할 4) (분할) 키 값들과 새 키 값 중 중간 키 값을 부모 노드로 올려 보내고, 나머지 키 값들을 절반씩 분할된 두 노드에 옮기며, 이 두 노드가 올라간 키 값의 좌우 종속 트리가 되도록 설정"],
          ["삭제", "1) 삽입 연산과 동일하게 리프 노드에서 시작 2) 삭제하려는 키 값이 리프 노드가 아닌 노드에 있으면 키 값이 후행 키 값과 자리를 변경하여 리프 노드로 옮긴 후에 삭제 진행"],
        ],
      },
    ],
  },
  {
    title: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
    course: "DS",
    definition: "개별 요소들이 특정한 방향을 향하고 있으며, 서로 순환하지 않는 구조로 구성된 그래프",
    defShort: "방향을 가지며 순환이 없는 구조의 그래프",
    keywords: ["위상 정렬", "유향 비순환", "진입차수"],
    tables: [
      {
        caption: "위상 정렬(Topological Ordering)",
        headers: ["구분", "설명"],
        rows: [
          ["절차", "진입차수 0인 정점을 큐에 삽입 → 큐에 삽입과 동시에 연결된 간선 제거 → 모든 정점이 제거되었는가? NO면 반복, YES면 완료"],
          ["설명", "유향 그래프의 꼭짓점들을 변의 방향을 거스르지 않도록 나열한 정렬 알고리즘. 깊이 우선 탐색(DFS)이나 큐(Queue)로 풀 수 있는 대표적인 정렬 방법"],
          ["진입 차수(in-degree)", "한 정점으로 들어가는 간선의 개수"],
          ["진출 차수(out-degree)", "한 정점에서 나오는 간선의 개수"],
        ],
      },
      {
        caption: "위상정렬 실시 과정 및 결과",
        headers: ["순서", "수행 내용"],
        rows: [
          ["정점 별 진입차수 표 작성", "각 정점과 진입차수 정보를 기입"],
          ["큐 삽입 및 연결 간선 제거 ①", "진입차수가 0인 정점(4)을 큐에 삽입, 큐에 삽입된 정점과 간선 제거"],
          ["큐 삽입 및 연결 간선 제거 ②", "진입차수가 0으로 수정된 정점(1, 6)을 큐에 삽입, 정점과 간선 제거"],
          ["큐 삽입 및 연결 간선 제거 ③", "진입차수가 0으로 수정된 정점(2, 3)을 큐에 삽입, 정점과 간선 제거"],
          ["정점 제거 확인", "진입차수가 0으로 수정된 정점(5)을 큐에 삽입, 모든 정점 제거 완료 확인"],
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
    defShort: "시간·공간 지표를 기준으로 알고리즘 성능을 판단하는 프로세스",
    keywords: ["시간복잡도(수행시간)", "공간복잡도(사용 메모리공간)", "점근적 성능표기법"],
    tables: [
      {
        caption: "성능 평가 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["성능분석", "알고리즘 복잡도 분석", "직접 구현하지 않고서 수행 시간을 분석하는 것. 알고리즘이 수행하는 연산의 횟수 측정 비교. 일반적으로 연산의 횟수는 n의 함수. 시간복잡도 분석: 수행시간 분석 / 공간복잡도 분석: 수행 시 필요로 하는 메모리 공간 분석"],
          ["성능측정", "수행시간 측정", "알고리즘의 실제 수행시간을 측정하는 것. 알고리즘의 실제 구현물이 필요. 동일한 하드웨어 사용 필요"],
          ["효율성 평가", "시간 복잡도(Time complexity)", "입력 크기의 값에 대하여, 단위 연산을 몇 번 수행 하는지를 계산함으로써, 알고리즘의 수행시간 평가. 프로그램의 컴파일 시간과 실행 시간의 합. 3가지 점근적 표현법(O-빅오, Ω-오메가, Θ-세타)"],
          ["효율성 평가", "공간 복잡도(Space complexity)", "알고리즘 수행에 필요한 메모리의 양을 평가. 필요한 고정 공간(프로그램 명령어가 차지하는 공간)과 가변 공간(데이터 개수에 따라 변하는 공간)의 합. 보통 시간 소요량이 적은 알고리즘은 공간 소요량이 많고 공간 소요량이 적은 알고리즘은 시간 소요량이 큼"],
        ],
      },
      {
        caption: "점근적 성능 표기법(Asymptotic Notation)",
        headers: ["표기법", "설명"],
        rows: [
          ["O Notation (빅오 표기법)", "점근적 상한선(Asymptotic upper bound). 입력데이터가 최악일 때를 기준으로 알고리즘의 효율을 평가하기 위해 사용하는 수학적 기호"],
          ["Ω Notation (오메가 표기법)", "점근적 하한선(Asymptotic lower bound). 입력데이터가 최상일 때를 기준으로 알고리즘의 효율을 위해 사용하는 수학적 기호"],
          ["Θ Notation (세타 표기법)", "점근적 상한선과 점근적 하한선의 교집합(Asymptotic tighter bound). 빅오, 오메가를 둘 다 포함하는 개념으로 알고리즘 수행 시간의 하한인 동시에 상한을 표시"],
        ],
      },
      {
        caption: "시간 복잡도 사례",
        headers: ["구분", "알고리즘 A", "알고리즘 B", "알고리즘 C"],
        rows: [
          ["코드", "sum=n*n;", "for (i=1;i<=n;i++) sum=sum+n;", "for (i=1;i<=n;i++) for (i=1;i<=n;i++) sum=sum+1;"],
          ["연산", "대입연산: 1, 곱셈연산: 1", "대입연산: n, 덧셈연산: n", "대입연산: n*n, 덧셈연산"],
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
    defShort: "데이터 수 N에 대한 시간 복잡도를 표현하는 상한 점근 표기법",
    keywords: ["시간 복잡도", "매개변수 N"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "설명", "사례"],
        rows: [
          ["O(1)", "상수형. 입력 크기와 무관하게 바로 해를 구함", "해시 함수(Hash Function)"],
          ["O(log N)", "로그형. 입력 자료를 나누어 그 중 하나만 처리", "이진탐색(Binary Search)"],
          ["O(N)", "선입. 입력 자료를 차례로 하나씩 모두 처리", "단순탐색(Find Item)"],
          ["O(N log N)", "분할과 합병형. 자료를 분할하여 각각 처리하고 합병", "퀵 정렬(Quick Sort)"],
          ["O(N²)", "제곱형. 주요처리(기본 연산) loop 구조가 2중인 경우", "버블 정렬(Bubble Sort)"],
          ["O(N³)", "세제곱형. 주요처리(기본 연산) loop가 3중인 경우", "Finding the Shortest Path"],
          ["O(2ⁿ)", "지수형. 가능한 해결방법 모두를 다 검사하여 처리함", "Dynamic Programming"],
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
    defShort: "Pivot 기준으로 분할·정복하여 재귀적으로 정렬하는 알고리즘",
    keywords: ["Pivot", "평균실행시간: O(n logn)", "최악의 경우: O(n²)", "분할 정복(divide and conquer)"],
    tables: [
      {
        caption: "동작 원리",
        headers: ["구분", "설명"],
        rows: [
          ["1) 비교 정렬", "다른 원소와의 비교과정만을 거쳐서 정렬을 수행하는 비교 정렬"],
          ["2) 분할과 정복", "Pivot을 기준으로 리스트를 분할하여 분할된 리스트를 각각 정렬"],
          ["3) 재귀적 수행", "분할된 리스트에 대하여 재귀적으로 분할과 정렬과정을 반복해 정렬"],
          ["시간복잡도", "O(nlogn)"],
        ],
      },
      {
        caption: "수행 과정(오름차순 정렬) — 용어",
        headers: ["용어", "설명"],
        rows: [
          ["Pivot", "중심점, 피봇이라고 부름"],
          ["Left", "정렬할 요소들의 가장 왼쪽 지점"],
          ["Right", "정렬할 요소들의 가장 오른쪽 지점"],
          ["Low", "피봇을 제외한 가장 왼쪽 지점"],
          ["High", "피봇을 제외한 가장 오른쪽 지점"],
        ],
      },
      {
        caption: "수행 절차",
        headers: ["순서", "설명"],
        rows: [
          ["1", "Low는 왼쪽부터 Pivot보다 큰 값을 찾는다"],
          ["2", "High는 오른쪽부터 Pivot보다 작은 값을 찾는다"],
          ["3", "큰 값과 작은 값의 위치를 교환한다"],
          ["4", "다시 왼쪽부터 Pivot보다 큰 값, 오른쪽부터 Pivot보다 작은 값을 찾는다"],
          ["5", "두 값의 순서가 교차되는 경우 Pivot과 high의 값을 교환한다"],
          ["6", "Pivot을 중심으로 왼쪽에는 작은 값, 오른쪽에는 큰 값들이 정렬된다"],
          ["7", "왼쪽의 Pivot을 다시 잡고 재귀실행, 오른쪽의 Pivot을 잡고 정렬이 끝날 때까지 재귀 실행한다"],
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
    defShort: "이미 정렬된 부분과 비교해 자기 위치를 찾아 삽입하는 정렬",
    keywords: ["이미 정렬", "자신 위치 찾아 삽입"],
    tables: [
      {
        caption: "수행 개념도",
        headers: ["단계", "설명"],
        rows: [
          ["Step 1", "정렬 영역(1,5,6)과 비정렬 영역(4,2,3)을 구분하고, 정렬할 요소(4)가 자신이 들어갈 위치를 검색"],
          ["Step 2", "해당 위치 이후 값을 Shift (5, 6을 오른쪽으로 밀기)"],
          ["Step 3", "해당 위치로 삽입 → 1,4,5,6 | 2,3"],
        ],
      },
      {
        caption: "삽입 정렬 과정",
        headers: ["순번", "과정 설명"],
        rows: [
          ["1", "n개의 데이터 정렬 시 처음의 A[0]는 정렬된 데이터로 취급"],
          ["2", "다음 데이터 A[1]을 정렬된 데이터와 비교하여 적절한 위치에 삽입"],
          ["3", "다음 데이터 A[2]를 정렬된 데이터 A[0], A[1]과 비교하여 적절한 위치에 삽입"],
          ["4", "같은 방식으로 나머지 데이터들을 삽입하여 정렬을 완성"],
        ],
      },
      {
        caption: "예시 (31, 25, 12, 22, 11)",
        headers: ["단계", "데이터", "설명"],
        rows: [
          ["초기", "31 25 12 22 11", "처음 상태"],
          ["1", "31 [25] 12 22 11", "두 번째 원소(25)를 정렬된 부분 리스트에서 적절한 위치에 삽입"],
          ["2", "<25> 31 [12] 22 11", "<25> 삽입 완료. 세 번째 원소(12)를 정렬된 부분 리스트에서 적절한 위치에 삽입"],
          ["3", "<12> 25 31 [22] 11", "<12> 삽입 완료. 네 번째 원소(22)를 적절한 위치에 삽입"],
          ["4", "12 <22> 25 31 [11]", "<22> 삽입 완료. 마지막 원소(11)를 적절한 위치에 삽입"],
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
    defShort: "이웃한 요소끼리 비교·교환을 반복하며 정렬하는 방법",
    keywords: ["인접 원소 비교", "거품", "완전 정렬", "O(n²)", "위치 교환 방식"],
    tables: [
      {
        caption: "버블 정렬 과정",
        headers: ["순번", "과정 설명"],
        rows: [
          ["1", "A(1)과 A(2), A(2)와 A(3), A(3)과 A(4) 순서로 값을 비교, 앞쪽 배열 값이 뒤쪽 배열 값보다 크면 상호 교환"],
          ["2", "1회 수행 후 A(4) 배열 값은 배열 값 중 가장 큰 값. 2회 수행 때는 A(1)과 A(2), A(2)와 A(3)만 비교, 반복"],
          ["3", "2회 수행 후 A(3)과 A(4) 값은 이미 뒤쪽부터 정렬 완료. A(1)과 A(2) 만 비교"],
        ],
      },
      {
        caption: "수행 개념도 (7, 5, 8, 3, 9 정렬)",
        headers: ["단계", "결과"],
        rows: [
          ["시작", "7 5 8 3 9"],
          ["1단계", "5 7 3 8 [9] — 가장 큰 값 9가 맨 뒤로 확정"],
          ["2단계", "5 3 7 [8 9]"],
          ["…", "3 5 [7 8 9]"],
          ["완료", "[3 5 7 8 9] — 정렬 완료 방향은 뒤에서 앞으로"],
        ],
      },
      {
        caption: "예시 (7, 5, 3, 2)",
        headers: ["회차", "과정", "결과"],
        rows: [
          ["1회", "7 5 3 2 → 5 7 3 2 → 5 3 7 2 → 5 3 2 7", "5 3 2 [7]"],
          ["2회", "5 3 2 7 → 3 5 2 7 → 3 2 5 7", "3 2 [5 7]"],
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
    defShort: "리스트를 반복 분할한 뒤 정렬하며 병합하는 분할 정복 정렬",
    keywords: ["분할과 정복", "O(n log n)"],
    tables: [
      {
        caption: "수행 절차",
        headers: ["순서", "설명"],
        rows: [
          ["①", "정렬할 데이터를 반으로 나눔"],
          ["②", "나누어진 하위 데이터 집합의 크기가 2이상이면 ①을 반복"],
          ["③", "원래 같은 집합에서 나뉘어져 나온 하위 데이터 집합 둘을 병합하여 하나의 데이터 집합으로 만듦. 단 병합할 때 데이터 집합의 원소는 순서에 맞춰서 정렬"],
          ["④", "데이터 집합이 다시 하나가 될 때까지 ③을 반복"],
        ],
      },
      {
        caption: "병합 정렬 과정 (5, 1, 6, 4, 8, 3, 7, 9, 2 정렬)",
        headers: ["구분", "설명"],
        rows: [
          ["분할", "5 1 6 4 8 3 7 9 2 → (5 1 6 4 8) (3 7 9 2) → (5 1 6)(4 8)(3 7)(9 2) → (5 1)(6)(4)(8)(3)(7)(9)(2) → (5)(1) 까지 분할"],
          ["정복", "(5)(1) → (1 5) → (1 5 6)·(4 8)·(3 7)·(2 9) → (1 4 5 6 8)·(2 3 7 9) → 1 2 3 4 5 6 7 8 9"],
        ],
      },
    ],
    notes: ["퀵 정렬과 달리 최악의 경우에도 O(n log n)이 보장되며, 안정 정렬(stable sort)이라는 점이 차이"],
  },
  {
    title: "해시 테이블",
    course: "AL",
    definition: "키(key)라는 특별한 인덱스로 자료에 접근하는 배열로 구성되는 자료구조",
    defShort: "키(key)를 인덱스로 자료에 접근하는 배열 기반 자료구조",
    keywords: ["해시 키", "고정길이", "해시함수", "해시테이블", "버킷", "충돌", "오버 플로우"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "설명"],
        rows: [
          ["해시 함수", "키 값으로부터 레코드의 물리적 주소로 사상시키는 사상 함수. 임의 길이 메시지를 고정길이 메시지(Message digest)로 변환 시 사용하는 단방향 함수(One-way Function)"],
          ["해시 키(Hash Key)", "해시 함수가 레코드 주소를 계산하기 위해 사용하는 레코드의 키 값"],
          ["해시 테이블(Hash Table)", "키 연산에 의해 직접 접근이 가능한 구조(배열)의 기억장소"],
          ["버킷(bucket)", "하나의 주소를 갖는 파일의 한 구역을 나타내며, 버킷의 크기는 같은 주소에 포함될 수 있는 레코드 수를 의미"],
          ["슬롯(Slot)", "1개의 레코드를 저장할 수 있는 공간으로 n개의 슬롯이 모여 하나의 버킷을 형성"],
          ["직접파일(Direct File)", "해싱 방법을 기초로 하여 만들어진 파일. 레코드를 식별하기 위한 키 값과 저장 장치에 저장되어 있는 레코드 사이의 사상(Mapping) 관계가 성립 되어야 함"],
          ["해싱표", "해시 테이블, 해시 함수에 의해서 계산된 주소"],
          ["동거자(Synonym)", "해시 함수가 같은 주소로 변환시킨 모든 레코드"],
          ["충돌(Collision)", "서로 다른 레코드들이 같은 주소로 반환되는 경우"],
          ["오버 플로우", "더 이상 빈자리가 없는 과잉 상태. Bucket에 레코드들이 가득 찬 상태"],
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
    defShort: "해시함수로 주소를 계산해 데이터에 직접 접근하는 탐색 방법",
    keywords: ["나폴리는 중세기다", "선이중무 체코"],
    tables: [
      {
        caption: "해싱 기법 [나폴리는 중세기다]",
        headers: ["기법", "상세 설명"],
        rows: [
          ["나눗셈법(Division)", "나머지 연산자(modulus operator: %)를 사용하여 테이블 주소를 계산하는 방법. 레코드 키 값을 수치자료로 간주하여 어떤 양의정수(대개 해시 테이블의 크기)로 나눈 나머지를 홈 주소로 결정하는 해시 함수"],
          ["폴딩법(Folding)", "레코드의 키를 마지막 부분을 제외한 모든 부분의 길이가 동일하게 여러 부분으로 나누고, 이들 부분을 모두 더하거나 배타적 논리합(XOR)을 취하여, 해시 테이블의 홈 주소로 이용하는 방법"],
          ["중간 제곱법(Mid Square)", "레코드 키 값을 제곱한 후에 결과 값의 중간 부분에 있는 몇 비트를 선택하여 해시 테이블의 홈 주소로 사용"],
          ["기수 변환법(Radix-Exchange)", "어떤 진법으로 표현된 주어진 레코드 키를 다른 진법으로 간주하고 키를 변환하여 홈 주소를 얻는 방법 (10진법 → 7진법)"],
          ["자릿수 분석법(Digit-Analysis)", "레코드 키를 구성하는 수들이 모든 키들 내에서 각 자리별로 어떤 분포인지를 조사하여 비교적 고른 분포를 나타내는 자릿수를 필요한 만큼 선택하여, 레코드의 홈 주소로 사용하는 방법"],
          ["무작위 방법(Pseudo-Random)", "난수 발생 프로그램을 이용하여 난수(random number)를 발생시켜 각 레코드 키의 홈 주소를 결정하는 방법"],
        ],
      },
      {
        caption: "충돌 해결방법 [선이중무 체코]",
        headers: ["구분", "해결 방법", "설명"],
        rows: [
          ["개방 주소법", "선형 조사법(Linear Probing)", "충돌 발생 시 다음 주소로 순차 이동하여 빈자리에 저장"],
          ["개방 주소법", "이차 조사법(Quadratic Probing)", "충돌 발생 시 다음 주소로 이동하되 제곱 간격으로 이동"],
          ["개방 주소법", "이중 해싱법(Double Hashing Probing)", "충돌 발생 시 제2의 해시 함수를 적용하여 새로운 주소 결정"],
          ["개방 주소법", "재해싱(Rehashing)", "충돌 발생 시 새로운 해시 함수로 테이블 전체를 다시 해싱"],
          ["폐쇄 주소법", "해시 체이닝(Hash Chaining)", "같은 주소에 충돌한 레코드를 연결 리스트로 연결하여 저장"],
          ["폐쇄 주소법", "병합 체이닝(Coalesced Hashing)", "Address, Value, Pointer 구조로 빈 슬롯에 저장하고 포인터로 연결"],
        ],
      },
    ],
  },
  {
    title: "동적 계획법(Dynamic Programming)",
    course: "AL",
    definition:
      "최적성 원리 문제에 대한 점화관계 도출, 분할, Memoization 기법 활용, 부분 반복 문제의 최적화 해결 위한 Bottom-Up Approach 알고리즘",
    defShort: "부분 문제의 해를 저장·재사용해 최적화하는 Bottom-Up 알고리즘",
    keywords: ["점화/재귀식", "Top-down(메모이제이션 - 재귀)", "Bottom-Up(타뷸레이션 - 반복문)"],
    tables: [
      {
        caption: "전제 조건과 동작 원리",
        headers: ["구분", "설명"],
        rows: [
          ["전제 조건", "최적성 원리 만족 → 점화/재귀 관계식 도출 가능 문제. 점화/재귀 관계식 도출: a(n+1) = f(a(n)) [함수 f(a(n)): 수열 {a(n)}의 점화식, a(n)/a(n+1): 인접 항]"],
          ["① 점화/재귀 관계식 도출", "점화/재귀 관계식 도출, 부분 문제로 분할"],
          ["② Memoization", "최소 문제 점화식 해 계산 테이블 저장"],
          ["③ Bottom-Up Approach", "상위 문제 해 계산 시 저장된 부분 문제 해 활용 최종 최적해 도출"],
        ],
      },
      {
        caption: "접근방법",
        headers: ["구분", "코드", "설명"],
        rows: [
          ["Top Down", "int fibo(int n) { if(n<=2) return 1; else return fibo(n-1)+fibo(n-2) }", "메모이제이션(재귀) 방식. 메모리에 저장된 내역을 참조하여 값을 찾아옴"],
          ["Bottom Up", "int fibo(int n) { for (int i=2; i<=n; i++) { cache[i] = cache[i-1] + cache[i-2]; } return cache[n]; }", "타뷸레이션(반복문) 방식. 반복으로 테이블의 처음부터 마지막까지 채우는 과정"],
        ],
      },
    ],
  },
  {
    title: "그리디(탐욕) 알고리즘",
    course: "AL",
    definition: "선택 시 마다 그 순간 최적의 해를 선택하여 최종적인 해를 도출하는 알고리즘",
    defShort: "매 순간 최적의 해를 선택해 최종 해를 도출하는 알고리즘",
    keywords: ["[해적검] 해 선택", "적합성 검증", "해 검증"],
    tables: [
      {
        caption: "수행 절차 [해적검]",
        headers: ["단계", "설명"],
        rows: [
          ["해 선택", "부분해 집합(Solution Set)에 더해질 다음 항목을 선택. 현재 상태에서 부분적인 최적화의 기준을 만족하는가에 의해 수행"],
          ["적합성 검증", "새로운 부분해 집합의 제약조건 위반여부 검사. 현재의 집합이 해가 될 가능성이 있는지 여부를 검사"],
          ["해 검증", "새롭게 구성된 집합이 주어진 문제의 해인지를 검사. 아직, 문제의 해가 아니라면 (1) 단계로 반복"],
        ],
      },
      {
        caption: "플로우 차트 예시 (770원 거스름돈 최소 동전 수)",
        headers: ["단계", "설명"],
        rows: [
          ["문제정의(동전의 액면)", "목표: 770원 거스름돈 최소 동전 수 / 선택: 500, 100, 50, 10원"],
          ["해 선택", "동전선택 — 최소 동전수가 목적이므로 현재 가장 큰 금액의 동전선택"],
          ["적합성 확인", "선택 부분해의 제약조건 위반여부 확인 — 목표(770원) 초과시 미적합(해 선택으로 복귀)"],
          ["해 검증", "최종해 여부 확인 — 현재까지의 거스름돈이 770원 여부확인. 해 아니면 해 선택으로 복귀"],
          ["해 도출", "최종해 도출"],
        ],
      },
      {
        caption: "최적해 미도출 사례",
        headers: ["항목", "설명"],
        rows: [
          ["사례 설명", "거스름돈이 800원이고 동전의 종류가 500원, 100원, 50원, 10원이 있는데 400원짜리 동전이 새롭게 생겼을 경우 그리디 알고리즘을 사용할 경우 최적해가 미도출됨"],
          ["거스름돈", "800원"],
          ["동전의 종류", "500원, 400원(새롭게 추가됨), 100원, 50원, 10원"],
          ["최종해", "500원 1개, 100원 3개 (총 4개)"],
          ["실제 최적의 해", "400원 2개 (총 2개)"],
        ],
      },
    ],
  },
  {
    title: "허프만(Huffman) 코딩",
    course: "AL",
    definition:
      "가변 길이 부호화로서 자주 발생하는 데이터에는 짧은 부호를, 자주 발생하지 않는 데이터에는 긴 부호를 할당하여 전체 데이터 길이 압축하는 기법",
    defShort: "빈도가 높은 데이터에 짧은 부호를 주는 가변 길이 압축 기법",
    keywords: ["무손실 압축", "빈도", "통계적 기법", "엔트로피"],
    tables: [
      {
        caption: "알고리즘 동작",
        headers: ["순번", "알고리즘 동작"],
        rows: [
          ["1", "모든 문자들의 빈도수 참고하여 내림차순 정렬"],
          ["2", "가장 적은 빈도수 두 문자를 연결하고 다시 이 연결된 문자들과 다음으로 적은 것과 연결. 모든 문자가 연결될 때까지 반복(Binary Fusion)"],
          ["3", "0과 1을 각각의 쌍에 배정 (높은 쪽에 0을 배정)"],
          ["4", "각 문자에 코드 할당"],
        ],
      },
      {
        caption: "사례 (데이터: AAAAABABCCCDBBBCDA)",
        headers: ["과정", "설명"],
        rows: [
          ["발생확률 계산", "A: 빈도 7 → 7/18 / B: 5 → 5/18 / C: 4 → 4/18 / D: 2 → 2/18"],
          ["트리생성", "빈도가 낮은 것부터 결합 — P(A)=7/18은 0, 나머지는 1 하위에서 P(B)=5/18(10), P(C)=4/18(110), P(D)=2/18(111)"],
          ["각 문자에 코드 할당", "A: 0 / B: 10 / C: 110 / D: 111"],
          ["데이터 압축", "AAAAABABCCCDBBBCDA → 0 0 0 0 0 10 0 10 110 110 110 111 10 10 10 110 111 0(2). 아스키 코드 크기(1Byte) × 18 = 18Byte 에서 35bit로 압축"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["활용", "설명"],
        rows: [
          ["데이터 압축", "DEFLATE (PKZIP의 알고리즘)에 적용"],
          ["멀티미디어 코덱", "JPEG, MP3 등의 기본 알고리즘으로 활용"],
        ],
      },
    ],
  },
  {
    title: "런랭스(Run Length) 코딩",
    course: "AL",
    definition:
      "데이터에서 같은 값이 연속해서 나타나는 것을 그 개수와 반복되는 값만으로 표현하는 데이터 압축 알고리즘 (Run은 반복되는 문자, Length는 반복되는 횟수를 의미)",
    defShort: "연속된 같은 값을 개수와 값으로 표현하는 무손실 압축 알고리즘",
    keywords: ["무손실 압축", "RUN", "LENGTH"],
    tables: [
      {
        caption: "예제",
        headers: ["구분", "예제 1", "예제 2"],
        rows: [
          ["평문", "AAAABBBBBCCCCCCCCCDEEEE (22byte)", "ABCDDDDDDDDEEEEEEEEE (19byte)"],
          ["압축", "4A5B8C1D5E (10byte)", "ABC*8D*9E (9Byte)"],
          ["압축률", "22byte / 10byte = 2.2%", "19byte / 9byte = 2.11%"],
          ["적용 방식", "LENGTH, RUN 순서로 나열. 하나의 값으로 변화가 자주 발생하며 압축률 현저히 떨어짐", "유일한 자료로 이루어진 스트링의 경우 그대로 적용. 반복된 자료에만 Run Length Coding 적용"],
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
    defShort: "음수 아닌 가중치 그래프에서 한 정점의 최단 경로를 구하는 알고리즘",
    keywords: ["음수가 아닌 가중치", "무한대(∞) 설정 → 시작 정점 최단경로 추가 → 인접 정점 탐색 → 추가탐색"],
    tables: [
      {
        caption: "수행 과정 (S = 방문한 노드 집합, Q = 방문하지 않은 노드 집합)",
        headers: ["#", "설명"],
        rows: [
          ["1", "출발지를 A로 초기화 d[A]=0. 방문하지 않은 노드는 무한(d[다른 노드]=무한). Q는 방문하지 않은 노드들의 집합 — 아직 탐색전이므로 모든 노드가 Q에 속함. S는 방문한 노드 집합. S={}, Q={A,B,C,D,E,F}"],
          ["2", "A가 출발지이므로 A를 S에 넣고 Q에서 제거. 출발지 A에서 모든 이웃 노드와의 거리를 측정 — d[B]=10, d[C]=30, d[D]=15. S={A}, Q={B,C,D,E,F}"],
          ["3", "가중치 가장 낮은 B선택. B를 S에 추가하고 Q에서 제거. B에서 모든 이웃 노드 사이의 거리를 측정 — d[E]=20. S={A,B}, Q={C,D,E,F}"],
          ["4", "가중치 가장 낮은 D선택. D를 S에 추가, Q에서 제거. D에서 모든 이웃 노드 사이의 거리를 측정 — d[C]=20, d[F]=35. 기존에 d[C]=30 였는데 더 빠른 경로를 발견했으므로 d[C]=20 으로 업데이트. S={A,B,D}, Q={C,E,F}"],
          ["5", "가중치 가장 낮은 C선택. C를 S에 추가, Q에서 제거. C에서 모든 이웃 노드 사이의 거리를 측정 — d[F]=25. 기존에 d[F]=35 였는데 더 빠른 경로를 발견했으므로 d[F]=25 로 업데이트. S={A,B,D,C}, Q={E,F}"],
          ["6", "가중치 가장 낮은 F선택. F를 S에 추가, Q에서 제거. F에서는 방문하지 않은 이웃 노드가 없음. S={A,B,D,C,F}, Q={E}"],
          ["7", "가중치 가장 낮은 E선택. E를 S에 추가, Q에서 제거. Q는 공집합. S={A,B,D,C,F,E}, Q={}"],
          ["8", "위의 과정이 반복되어 Q가 공집합이 되었다면 최단거리를 결정한다. S={A,B,D,C,F,E}(방문한 순서대로 정렬). d[A]=0, d[B]=10, d[C]=20, d[D]=15, d[E]=30, d[F]=25, Q=∅. 목적지가 F였으므로, A→D→C→F가 최단 경로이며, 거리는 25로 결정된다"],
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
    defShort: "문서군에서 특정 단어의 문서 내 중요도를 나타내는 통계적 가중치",
    keywords: ["TF", "IDF", "TDM", "NORM", "내적", "코사인 거리"],
    tables: [
      {
        caption: "정의",
        headers: ["구분", "개념"],
        rows: [
          ["TF(Term Frequency)", "단어빈도. 특정한 단어가 문서 내에 얼마나 자주 등장하는지를 나타내는 값. 이 값이 높을수록 문서에서 중요하다는 의미"],
          ["IDF(Inverse Document Frequency)", "역문서 빈도를 의미하며 DF(Document Frequency)의 역수. DF가 높으면 단어가 흔하게 등장한다는 의미로 역수인 IDF값을 통해 중요도 산출. 즉, IDF 값이 높으면 중요한 단어를 의미"],
        ],
      },
      {
        caption: "산출 절차",
        headers: ["순서", "절차", "설명"],
        rows: [
          ["1", "DTM 작성", "주어진 문서를 DTM(Document Term Matrix) 작성을 통한 행렬 표현"],
          ["2", "단어빈도(TF) 계산", "특정 문서 내 특정 단어의 등장 빈도 수치화. 문서 내에서 단어의 등장 횟수를 직접 사용하거나, 문서의 전체 단어 수로 정규화하는 등 다양한 방법을 사용"],
          ["3", "불용어 처리", "조사, 시제 등 중요 하지 않은 단어의 TF가 높아지는 문제 해결 필요"],
          ["4", "역문서빈도(IDF) 산출", "특정 단어가 다른 문서에서 얼마나 흔하게 나타나는지를 나타내는 값. 타 문서에도 자주 나오는 단어의 가중치 낮춤"],
          ["5", "TF-IDF 계산", "TF와 IDF를 곱하여 TF-IDF 값을 계산"],
        ],
      },
      {
        caption: "문서1과 문서2에 대한 TF-IDF 계산 예",
        headers: ["구분", "계산"],
        rows: [
          ["TF 계산(문서 별 단어의 빈도수)", "this: 문서1=1, 문서2=2 / is: 1, 1 / a: 2, 0 / sample: 1, 0 / another: 0, 1 / example: 0, 1"],
          ["IDF 계산(단어의 등장 빈도의 역수)", "this: log(2/2)=0 / is: log(2/2)=0 / a: log(2/1)=0.3 / sample: 0.3 / another: 0.3 / example: 0.3"],
          ["TF-IDF 계산(TF × IDF)", "this: 3×log(2/2)=0 / is: 2×0=0 / a: 2×log(2/1)=0.6 / sample: 1×0.3=0.3 / another: 0.3 / example: 0.3"],
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
    defShort: "모든 정점을 연결하는 가중치 합이 최소인 신장 트리",
    keywords: ["신장트리", "간선 가중치 최소", "비순환", "프림(Prim)", "크루스칼(Kruscal)"],
    tables: [
      {
        caption: "프림(Prim) 알고리즘",
        headers: ["순서", "개념"],
        rows: [
          ["1)", "Prim 알고리즘은 시작 정점에서부터 출발하여 신장 트리 집합을 단계적으로 확장해 감"],
          ["2)", "시작 단계에서는 시작 정점만이 신장 트리 집합에 포함"],
          ["3)", "앞 단계에서 만들어진 신장 트리 집합에 인접한 정점들 중에서 최저 간선으로 연결된 정점을 선택하면서 트리를 확장함"],
          ["4)", "과정의 종료는 트리가 'n-1'의 간선을 가질 때 종료됨"],
        ],
      },
      {
        caption: "크루스칼(Kruscal) 알고리즘",
        headers: ["순서", "개념"],
        rows: [
          ["1)", "MST가 최소의 비용의 간선으로 구성됨과 사이클을 형성하지 않는다는 조건에 충실하면서 각 단계에서 사이클을 이루지 않는 최소비용 간선을 선택함"],
          ["2)", "그래프의 간선들을 가중치의 오름차순으로 정렬"],
          ["3)", "정렬된 간선들의 리스트에서 사이클 형성 않는 간선을 찾아서 현재의 MST 리스트 집합에 추가"],
          ["4)", "만약 사이클 형성한다면 그 간선은 제외"],
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
          ["AG / DG / BC / EF / CG / AB", "9 / 10 / 11 / 12 / 13 / 14", "사이클 형성 시 제외"],
        ],
      },
    ],
    notes: ["프림은 '정점 중심'으로 트리를 키워 나가고, 크루스칼은 '간선 중심'으로 가중치가 낮은 간선부터 골라 붙인다 — 둘 다 그리디 알고리즘"],
  },
  {
    title: "트리 순회(Tree Traversal)",
    course: "AL",
    definition: "계층적 구조를 갖는 트리(Tree)의 모든 노드(node)를 한 번씩 체계적으로 방문하는 과정",
    defShort: "트리의 모든 노드를 한 번씩 체계적으로 방문하는 과정",
    keywords: ["전위 순회(Pre-Order Traversal)", "중위 순회(In-Order Traversal)", "후위 순회(Post-Order Traversal)"],
    tables: [
      {
        caption: "유형",
        headers: ["구분", "전위 순회(Pre-Order)", "중위 순회(In-Order)", "후위 순회(Post-Order)"],
        rows: [
          ["노드 방문 순서", "Root 노드 → Left 노드 → Right 노드", "Left 노드 → Root 노드 → Right 노드", "Left 노드 → Right 노드 → Root 노드"],
          ["의사 코드", "preorder(node) { if node == null then return; Visit(node); Preorder(node.left); Preorder(node.right); }", "inorder(node) { if node == null then return; Inorder(node.left); Visit(node); Inorder(node.right); }", "postorder(node) { if node == null then return; Postorder(node.left); Postorder(node.right); Visit(node); }"],
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
    defShort: "그래프 G=(V,E)의 모든 정점을 한 번씩 방문하는 탐색",
    keywords: ["깊이 우선 방식(DFS)", "너비 우선 방식(BFS)"],
    tables: [
      {
        caption: "너비 우선 탐색(BFS)과 깊이 우선 탐색(DFS) 비교",
        headers: ["구분", "너비 우선 탐색(BFS)", "깊이 우선 탐색(DFS)"],
        rows: [
          ["개념", "횡방향 탐색: 현재 정점과 연결된 정점들에 대해 횡방향탐색을 진행하는 방식", "종방향 탐색: 현재 정점에서 연결된 정점을 하나 골라 파고들 수 있는 최대한 깊게 파고들어가며 탐색"],
          ["구현", "큐 이용하여 구현", "스택 이용하여 구현, 백트래킹 사용"],
          ["장점", "옆으로 넓은 그래프에 대해선 좋은 성능을 기대할 수 있음", "아래로 깊은 그래프에서는 좋은 성능을 기대할 수 있음"],
          ["단점", "아래로 깊은 그래프에서는 탐색시간이 오래 걸림", "옆으로 넓은 그래프에서는 탐색시간이 오래 걸림"],
        ],
      },
      {
        caption: "BFS 동작 예 (큐 활용)",
        headers: ["단계", "설명"],
        rows: [
          ["1", "노드1을 큐에 삽입 — Queue: [1]"],
          ["2", "노드1의 첫번째 너비는 2와 3 — Queue: [2, 3]"],
          ["3", "노드2의 첫번째 너비는 4와 5 — Queue: [3, 4, 5]"],
          ["4", "이어서 6, 7 방문 — Queue: [4, 5, 6] → [5, 6, 7]"],
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
    defShort: "아날로그 정보를 디지털로 효율 변환하는 매핑·변환 기법",
    keywords: ["소스코딩(압축)", "채널코딩(오류제어)", "라인코딩(bipolar, unipolar, polar)"],
    tables: [
      {
        caption: "소스 코딩",
        headers: ["구분", "상세"],
        rows: [
          ["개념", "통신 시스템 상에서 효율적 정보 전송을 위해 전송하려는 원천 데이터에서 불필요한 정보 및 중복 정보를 제거하여 전송 데이터를 줄이는 과정 및 기법(압축 부호화)"],
          ["원천정보 형태 분류 — 영상 부호화", "영상 정보를 부호화하는 기법 (JPEG, MPEG)"],
          ["원천정보 형태 분류 — 오디오 부호화", "파형부호화, 음성 파형 부호화(PCM, DM) 등"],
          ["코드 길이 고정 여부 — 고정 길이 부호화", "심볼 모두에 동일한 코드 길이를 부여한 부호 방식 (FLC(Fixed Length Coding), ASCII 코드)"],
          ["코드 길이 고정 여부 — 가변 길이 부호화", "사용 빈도에 다른 코드 길이 가변 부호화 (모스부호)"],
          ["데이터 손실 여부 — 무손실 압축 부호화", "압축 데이터 복원시 압축 전의 데이터와 일치 (허프만코딩, 런렝스 코딩)"],
          ["데이터 손실 여부 — 손실 압축 부호화", "압축한 데이터 복원 시 압축 전의 데이터와 불일치(JPEG, MPEG)"],
        ],
      },
      {
        caption: "채널 코딩",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "디지털 전송 채널 상의 잡음, 간섭 등에 의해 발생되는 오류를 검출 및 정정하기 위해 송수 양측에 의해 합의된 잉여 비트를 추가하고 복원하는 과정. 에러 검출(패리티 검사 등), 에러 정정"],
          ["개념도", "실제 전송 정보의 속도 100 kbps + 50 kbps Redundancy → 150 kbps로 전송(채널코딩에 의한 속도저하). 에러 발생시 FEC로 스스로 에러의 복원 시도"],
        ],
      },
      {
        caption: "라인 코딩",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "수신 측의 원활한 동기 재생과 오류 검출을 위해 2진 bit의 디지털 데이터를 신호 전달을 위한 의미 있는 디지털 신호(기저대역 신호, 전기적 신호)로 변환하는 과정"],
          ["개념도", "전송측 디지털 데이터(010…110) → Line Coding으로 디지털 신호 변환 → Link 전송 → 수신측 디지털 데이터(010…110) 복원"],
        ],
      },
    ],
    notes: ["전송 부호화 개념도 — 송신: 아날로그신호 → A/D변환 → 소스코딩 → 채널코딩 → 변조 → 라인코딩 → 전송 / 수신: 복조 → 채널디코딩 → 소스디코딩 → D/A변환 → 아날로그신호"],
  },
  {
    title: "PCM(Pulse-Code Modulation)",
    course: "NW",
    definition:
      "아날로그 신호를 표본화 정리로 정해지는 표본화 주파수로 표본화하고, 각 표본(샘플)의 값을 양자화 한 후, 2진 부호화 하는 디지털 변조방식",
    defShort: "표본화·양자화·부호화로 아날로그를 디지털로 바꾸는 변조방식",
    keywords: ["표본화(Sampling)", "양자화(Quantization)", "부호화(Encoding)", "디지털화", "아날로그신호를 디지털신호로 변환(A/D변환)", "나이퀴스트"],
    tables: [
      {
        caption: "동작 원리 — 송신",
        headers: ["동작", "설명"],
        rows: [
          ["표본화(Sampling)", "프레임, 즉 표본간격(Sampling Time) 기준으로 신호를 샘플링. 표본간격으로 추출된 펄스열을 PAM(Pulse Amplitude Modulation)이라 함. 나이퀴스트 이론(fs(표본화 횟수) >= 2 × fm(최고주파수))이 활용됨"],
          ["양자화(Quantization)", "PAM 신호를 디지털화 하기 위해 진폭 축으로 이산 값을 갖도록 처리하는 과정. PAM신호를 이산적인 디지털 값으로 변환. 양자화 레벨 = 2^n (n=표본당 전송 비트 수)"],
          ["부호화(Encoding)", "양자화된 PCM 펄스의 진폭 크기를 2진수(0, 1)로 표시하는 과정"],
        ],
      },
      {
        caption: "동작 원리 — 수신",
        headers: ["동작", "설명"],
        rows: [
          ["재생", "수신된 디지털 신호를 재생하는 단계"],
          ["복호화(Decoding)", "수신된 디지털 신호(PCM)을 PAM신호로 되돌리는 단계"],
          ["재구성(Filtering)", "PAM 신호를 원래의 아날로그 신호로 복원하는 단계"],
        ],
      },
      {
        caption: "나이퀴스트 샘플링 정리",
        headers: ["구분", "상세"],
        rows: [
          ["개념", "입력 신호의 최고 주파수(fm)의 2배 이상의 주파수를 샘플링 하면 복호화 시에 원신호에 가깝게 복원이 가능하다는 이론. 표본화 횟수(fs) >= 2 × 최고 주파수(fm)"],
          ["샘플링 사례", "나이퀴스트 sampling / 적절한 sampling / 앨리어싱이 발생하는 under sampling"],
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
    defShort: "반송파의 진폭과 위상을 동시에 변화시키는 디지털 변조 방식",
    keywords: ["디지털 변조 방식", "진폭 변조", "위상 변조"],
    tables: [
      {
        caption: "16QAM 성상도(Constellation Diagram)",
        headers: ["구분", "설명"],
        rows: [
          ["X 축", "동위상 반송파(In-Phase carrier)"],
          ["Y 축", "구상 반송파(Quadrature carrier)"],
          ["심볼 코딩", "한 심볼에 n bit 코딩 (16 QAM의 경우 1 symbol = 4 bits)"],
          ["심볼 표현", "심볼 '0000'은 위상 φ, 진폭 a 를 이용. 심볼 '0011', '0001'은 같은 위상, 다른 진폭. 심볼 '0000', '1000'은 다른 위상, 같은 진폭"],
          ["16 QAM", "3가지의 진폭과 12가지의 위상을 활용"],
        ],
      },
      {
        caption: "QAM 활용 계층적 변조 방식 예 (64QAM)",
        headers: ["구분", "설명"],
        rows: [
          ["비트 할당", "심볼 당 6 비트가 할당. 최상위 2비트는 QPSK로 이용"],
          ["신호 상태 좋음", "수신된 신호의 상태가 좋으면 전체 QAM 좌표가 추출"],
          ["신호 상태 나쁨", "수신된 신호가 나쁘면 상위 2 비트를 이용하는 QPSK 부분만 추출"],
          ["우선순위", "우선순위가 높은 비트 스트림은 상위 2비트 이용해 QPSK 코딩. 나머지 4 비트는 낮은 우선순위의 비트로 코딩"],
          ["적용", "디지털 TV 표준 DVB-T에 적용되는 QPSK와 QAM을 사용하는 계층적 변조"],
        ],
      },
    ],
  },
  {
    title: "CSMA/CD",
    course: "NW",
    definition:
      "각각의 호스트가 링크를 사용하기 전에 링크의 사용 상태를 감지하여 전송 충돌을 최소화하기 위한 프로토콜",
    defShort: "링크 사용 상태를 감지해 전송 충돌을 최소화하는 프로토콜",
    keywords: ["1-Persistent", "Non-Persistent", "P-Persistent", "충돌", "Back-off"],
    tables: [
      {
        caption: "동작원리",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["송신 준비", "송신 데이터 준비", "송신이 필요한 디바이스에서 송신을 위해 데이터 준비"],
          ["채널 감시", "채널 Free", "데이터 송신 후 채널 감시, 미충돌시 프레임 전송 완료"],
          ["채널 감시", "충돌 발생", "Jamming Signal 전송하여, Back-off 방식에 따라 대기 및 재전송 시도"],
          ["채널 감시", "채널 Busy", "데이터 송신을 위해, 채널 재 탐색 수행"],
        ],
      },
      {
        caption: "Persistent 방식 3종",
        headers: ["방식", "특징"],
        rows: [
          ["1-Persistent", "지국이 회선이 휴지 상태인 것을 감지하면 즉시 프레임을 전송. 채널이 idle 상태일 때마다 1의 확률을 가지고 프레임을 전송"],
          ["Non-Persistent", "전송할 프레임이 있는 지국이 회선을 감지하는 특징. 채널 사용되는 것 감지 시, 임의의 시간동안 데이터 전송 지연(wait randomly)"],
          ["P-Persistent", "1-Persistent와 Non-Persistent의 장단점을 상호 보완하는 특징. 확률값(p)를 이용하여 전송여부 결정 — Time slot 단위로 확률 판정, >p면 wait a slot, <=p면 station can transmit"],
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
    defShort: "K개 후보를 유지해 그리디의 최적해 미보장을 보완한 탐색",
    keywords: ["최적해 미보장 단점 보완", "최적해", "Beam size"],
    tables: [
      {
        caption: "알고리즘 수행절차",
        headers: ["No", "수행 절차", "수행 항목"],
        rows: [
          ["①", "문제 정의", "문제 조건 확인, 제약 사항 확인"],
          ["②", "최초 K개의 해 선택", "Beam Size K개 만큼 높은 확률 기반 최초 해를 선택. 현재 상태 기준 최적화 기준 만족하는 K개 확인"],
          ["③", "부분 해 확장", "새로운 부분 해 집합 제약조건 여부. 각 후보는 확률 기반으로 Score 도출"],
          ["④", "K개 해 선택", "가장 확률이 높은 K개의 Sequence 해가 도출되며 다른 후보들은 삭제. Sequence가 종료될 때까지 ③, ④번 반복"],
          ["⑤", "최종 해 선택", "최종 해 중 확률 점수가 가장 높은 해 선택"],
        ],
      },
      {
        caption: "자연어 처리의 Beam Search 활용 사례 (Beam size = 2)",
        headers: ["단계", "설명"],
        rows: [
          ["1단계", "<S>에서 I(0.4), the(0.3) 두 후보 유지"],
          ["2단계", "I → am(0.8) / do(0.5), the → cat(0.4) / dog(0.6) 확장 후 상위 2개 유지"],
          ["3단계", "am → cat(1.0) / dog(0.8), dog → barked(0.9) / sleep(0.7)"],
          ["최종", "\"I am cat\"(1.0 선택) vs \"the dog barked\"(0.9 미선택) → 확률이 가장 높은 \"I am cat\" 선택"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["구분", "설명"],
        rows: [
          ["자연어 처리", "Greedy 알고리즘의 단일 예측의 단점을 보완하기 위해 확률 기반 Beam size(K) 만큼 선택하여 최종 결정하므로 Seq2Seq 디코딩 방식에 최적화 활용"],
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
    defShort: "무선 환경에서 전송 전 충돌을 사전 회피하는 매체 접근 제어",
    keywords: ["충돌 회피", "IFS", "RTS/CTS", "NAV", "Back-off", "ACK"],
    tables: [
      {
        caption: "CSMA/CD와 CSMA/CA 비교",
        headers: ["구분", "CSMA/CD", "CSMA/CA"],
        rows: [
          ["적용 환경", "유선 LAN(이더넷)", "무선 LAN(Wi-Fi)"],
          ["핵심 개념", "충돌 검출(Collision Detection) — 충돌이 나면 감지하고 재전송", "충돌 회피(Collision Avoidance) — 충돌 자체가 나지 않도록 사전 예방"],
          ["충돌 감지", "전송 중 신호를 감시하여 충돌 감지 가능", "송신 중 자기 신호가 커서 타 신호 감지 곤란(Hidden Node 문제)"],
          ["주요 기법", "Jam 신호 전송 후 Back-off 대기", "IFS 대기 + Back-off + RTS/CTS 예약 + ACK 확인"],
        ],
      },
      {
        caption: "주요 기술 요소",
        headers: ["요소", "설명"],
        rows: [
          ["IFS(Inter Frame Space)", "채널이 유휴 상태가 되어도 곧바로 보내지 않고 일정 시간 대기 — 우선순위 부여"],
          ["Back-off", "IFS 후에도 임의의 시간을 추가로 대기하여 동시 전송 확률을 낮춤"],
          ["RTS/CTS", "송신 요청(RTS)과 수신 준비 완료(CTS)를 주고받아 채널을 예약 — 히든 노드 문제 해결"],
          ["NAV(Network Allocation Vector)", "RTS/CTS를 엿들은 다른 단말이 그 시간 동안 전송을 자제하도록 하는 가상 반송파 감지"],
          ["ACK", "무선은 충돌 감지가 불가하므로 수신 측 ACK로 성공 여부 확인, 미수신 시 재전송"],
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
    defShort: "하나의 전송로를 분할해 여러 신호를 동시 전송하는 기술",
    keywords: ["FDM", "TDM", "SDM", "CDM", "WDM"],
    tables: [
      {
        caption: "다중화 종류",
        headers: ["종류", "설명"],
        rows: [
          ["FDM(주파수)", "공통 채널을 효율적으로 이용하기 위해, 전송매체를 주파수 분할로 전송. 넓은 대역폭을 나눠서 사용"],
          ["TDM(시간)", "시간분할 된 타임슬롯을 전송 하는 방식. 하나의 회선을 시간간격으로 분할"],
          ["CDM(코드)", "상호 직교성이 있는 코드를 이용하여 전송하는 방식. 확산 대역(Spread Spectrum)을 사용하여 전송"],
          ["WDM(파장)", "손실이 적은 주파수 대역 이용. 파장이 다른 광 신호를 한 가닥의 광섬유에 다중화"],
          ["SDM(공간)", "공간적으로 분리된 다수의 물리 채널을 마치 하나의 채널인 것처럼 만들어진 논리적 채널로 전송"],
        ],
      },
      {
        caption: "다중화 vs 다원접속",
        headers: ["구분", "다중화(Multiplexing)", "다원접속(Multiple Access)"],
        rows: [
          ["목적", "전송매체의 효율적 이용, 통신비용 절감", "한정된 자원의 공동 이용, 사용자의 구분"],
          ["송신측", "데이터 송신 지점이 한 곳, 동일 지점에서 데이터를 모아 송출", "데이터 송신 지점이 여러 곳, 독립된 각 터미널에서 송출"],
          ["다중화", "단일 송신국에서 신호가 다중화 되어 발신", "여러 단말기 신호가 다중화되어 발신"],
          ["기술유형", "FDM, TDM, CDM, WDM, SDM", "FDMA, TDMA, CDMA, WDMA"],
          ["전파방향", "하향 Down-LINK", "상향 UP-LINK"],
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
    defShort: "계층 간 통신 서비스를 요청·응답으로 규정한 기본형식",
    keywords: ["요구(Request)", "지시(Indication)", "응답(Response)", "확인(Confirm)"],
    tables: [
      {
        caption: "종류",
        headers: ["종류", "설명"],
        rows: [
          ["요청(Request)", "상위계층이 하위계층에게 데이터의 전송을 요구하거나 연결설정을 요청할 때 사용하는 서비스"],
          ["지시(Indication)", "하위계층이 상위계층에게 데이터의 도착이나 연결설정의 요청이 있음을 알려주는 서비스"],
          ["응답(Response)", "지시에 따른 데이터의 처리나 연결설정을 알리는 서비스로 상위의 계층이 하위계층에게 알리는 서비스"],
          ["확인(Confirm)", "처음의 요청에 응답이 왔음을 알리는 서비스로 하위계층이 상위계층에게 알리는 서비스"],
        ],
      },
      {
        caption: "표현 사례 — T.CONNECT.request(called address, calling address, …, user data)",
        headers: ["구분", "설명", "예"],
        rows: [
          ["① 서비스 제공 계층", "어느 계층이 제공하는 서비스인지", "L: Link Layer, N: Network Layer, T: Transport Layer, S: Session Layer"],
          ["② 수행되는 동작 이름", "무슨 동작인지", "CONNECT, DATA 등"],
          ["③ 프리미티브 방향", "요청·지시·응답·확인 중 어느 것인지", "Request, Indication, Response, Confirmation"],
          ["④ 파라미터", "함께 전달하는 값", "주소, 사용자 데이터, 원하는 서비스 형태, 데이터 최대크기 등"],
        ],
      },
    ],
    notes: ["동작 흐름: 송신측 상위계층 1.Request(하향) → 수신측 하위계층 2.Indication(상향) → 수신측 3.Response(하향) → 송신측 4.Confirm(상향)", "표현 예 해석: Transport 계층(T)에서 접속(CONNECT)을 요구(Request)하면서, 착·발신 주소를 알려주며 사용자 데이터를 송부"],
  },
  {
    title: "OSI 7 Layer (ISO 7498)",
    course: "NW",
    definition: "국제표준기구(ISO)에서 표준화된 네트워크 구조를 제시한 기본 모델",
    defShort: "ISO가 표준화한 네트워크 구조의 7계층 기본 모델",
    keywords: ["[아파서티내다]", "Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"],
    tables: [
      {
        caption: "계층별 역할과 프로토콜 [아파서티내다]",
        headers: ["계층", "상세설명", "프로토콜"],
        rows: [
          ["7계층 Application", "사용자가 네트워크에 접근할 수 있도록 해주는 계층. 사용자 인터페이스, 전자우편, 데이터베이스 관리서비스", "HTTP, SMTP, SNMP, FTP, Telnet, NFS, RTSP, NTP"],
          ["6계층 Presentation", "운영체제의 한 부분으로 I/O 데이터를 표현 형태로 변환. 번역을 수행하여 두 장치가 일관되고 이해할 수 있음", "JPEG, MPEG, XDR, SMB, AFP"],
          ["5계층 Session", "통신세션을 구성하는 계층으로 포트연결 확인. 통신 장치 간의 상호작용을 설정하고 유지하며 동기화", "TLS, SSH, RPC, NetBIOS, AppleTalk"],
          ["4계층 Transport", "전체 메시지를 발신지 대 목적지간 제어와 에러 관리. 패킷들의 전송 유효확인, 실패한 패킷은 재전송하여 신뢰성 있는 통신 보장. 머리말에는 세그먼트가 포함", "TCP, UDP, RTP, SCTP, SPX"],
          ["3계층 Network", "다중 네트워크 링크에서 패킷을 목적지로 전달. 패킷이 시작시점에서 최종 목적지까지 성공적으로 전달되도록 관리", "IP, ICMP, IGMP, X.25, CLNP, ARP, RARP, BGP, OSPF, RIP, IPX, DDP"],
          ["2계층 Data Link", "오류 없이 한 장치에서 다른 장치로 프레임을 전달. 스위칭 테이블을 참조하여 입력되는 패킷의 MAC 주소를 보고 해당 포트로 패킷 전송", "PPP, HDLC, Ethernet, TokenRing, ISDN, FDDI"],
          ["1계층 Physical", "물리적 매체를 통해 비트(Bit)흐름 전송. 장치 간의 물리적 접속을 제어하기 위한 기능 제공", "RS-232C, 광 섬유, 동축케이블, ISDN, DSL"],
        ],
      },
      {
        caption: "계층별 데이터 단위와 장비",
        headers: ["구분", "내용"],
        rows: [
          ["데이터 단위(PDU)", "Transport = segment, Network = packet, Data Link = frame, Physical = bits"],
          ["중계 장비", "Router(3계층), Bridge(2계층), Repeater(1계층)"],
          ["캡슐화/역캡슐화", "송신측은 계층을 내려가며 헤더 정보를 붙이고(캡슐화), 수신측은 올라가며 헤더를 벗김(역캡슐화)"],
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
    defShort: "QUIC(UDP+TLS1.3) 기반으로 지연을 줄인 응용계층 프로토콜",
    keywords: ["QUIC(QUICK UDP Internet Connections)", "TLS 1.3", "UDP", "HTTP 1.1 HOL 블로킹 문제 해결", "0-RTT", "1-RTT Handshake"],
    tables: [
      {
        caption: "프로토콜 스택",
        headers: ["구분", "HTTP/2", "HTTP/3"],
        rows: [
          ["스택 구성", "HTTP/2 → TLS → TCP → IP", "HTTP over QUIC → QUIC(TLS 1.3 + TCP-like congestion control, loss recovery) → UDP → IP"],
          ["특징", "TCP 기반", "UDP와 TLS1.3 통해 성능과 보안성 향상. QUIC 기반 연결 및 전송 지연 최소화"],
        ],
      },
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["0-RTT/1-RTT 연결", "UDP 기반 이전 연결의 캐시된 자격 증명 사용"],
          ["HOL 블로킹 해결", "다중 Stream 제공 및 개별 Stream 내에서 흐름 제어 제공"],
          ["멀티 스트리밍 전송", "멀티 플렉싱된 스트림 통해 트래픽 손실 최소화"],
          ["Selective ACK(SACK)", "오류 발생시 재전송 통해 에러 복구"],
          ["Seamless Connection", "Connection ID 사용, IP·Port 변경 시에도 지속적 연결 유지"],
          ["보안성 강화", "두 번째 패킷부터 0-RTT, 1개의 패킷 전달을 통해 암호화된 연결 설정함"],
        ],
      },
      {
        caption: "동작 과정",
        headers: ["구분", "동작 과정", "설명"],
        rows: [
          ["Initial 1-RTT Handshake", "Inchoate CHLO(Client Hello)", "시작을 알리는 Inchoate(시작 단계). 암호화되지 않은 CHLO 패킷을 전송"],
          ["Initial 1-RTT Handshake", "Rejection", "서버 설정과 암호화된 토큰을 포함한 패킷 전송"],
          ["Initial 1-RTT Handshake", "Complete CHLO", "연결 완료, 이후부터 암호화된 통신 가능"],
          ["Successful 0-RTT Handshake", "Complete CHLO", "이전 연결 시 캐싱된 자격증명을 사용해서 Encrypted Request를 서버로 바로 전송 가능"],
          ["Rejected 0-RTT Handshake", "1-RTT Handshake 재 수행", "캐싱된 정보가 오래된 경우에 수행하는 동작, 이때에는 1-RTT 재 수행"],
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
    defShort: "TCP 세션의 수립(3-way)과 종료(4-way)를 위한 절차",
    keywords: ["3-way handshake와 4-way handshake", "신뢰성", "연결지향적", "SYN", "ACK", "FIN", "데이터그램"],
    tables: [
      {
        caption: "3-way handshake (TCP 세션 수립)",
        headers: ["단계", "설명"],
        rows: [
          ["초기연결시도", "Client는 접속하고자 하는 서버의 포트번호와 클라이언트의 초기순서번호(Init Sequence Number)를 지정한 SYN 세그먼트를 전송"],
          ["서버응답", "서버의 초기순서번호(ISN)를 포함한 자신의 SYN세그먼트로 응답. 클라이언트의 ISN + 1 ACK를 보냄으로써 클라이언트의 SYN에 확인 응답"],
          ["클라이언트 응답", "클라이언트는 서버로부터 보내온 SYN에 대하여 서버의 ISN + 1 ACK로 확인응답을 전송"],
        ],
      },
      {
        caption: "3-way handshake 상태 전이",
        headers: ["Client state", "동작", "Server state"],
        rows: [
          ["Closed → SYN-SENT", "Connect() → SYN(a)", "LISTEN → SYN-RECVED"],
          ["SYN-SENT", "← SYN(b) + ACK(a+1)", "SYN-RECVED"],
          ["→ ESTABLISHED", "ACK(b+1) →", "→ ESTABLISHED (accept() return)"],
        ],
      },
      {
        caption: "4-way handshake (TCP 세션 종료)",
        headers: ["단계", "설명"],
        rows: [
          ["연결종료 요청", "client가 Server에게 연결 종료를 요청 (FIN 전송, FIN_WAIT_1)"],
          ["서버 ACK 신호", "서버는 바로 종료하지 않고 ACK를 전송해 CLOSE_WAIT 상태로 넘어감 (Client는 FIN_WAIT_2)"],
          ["서버 FIN 신호", "잔여 작업 종료후 서버는 FIN 신호를 보내고 연결 종료 시도 (LAST_ACK)"],
          ["클라이언트 ACK", "클라이언트는 서버의 FIN을 잘 받았다는 ACK를 서버에게 보내고, 클라이언트의 ACK를 받으면 서버는 종료 (Client는 TIME_WAIT → CLOSED, Server는 CLOSED)"],
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
    defShort: "트래픽 양이 네트워크 용량을 넘지 않게 유지하는 메커니즘",
    keywords: ["Slow Start", "Congestion Avoidance", "Fast Retransmission", "Fast Recovery"],
    tables: [
      {
        caption: "메커니즘 4단계",
        headers: ["구성", "설명"],
        rows: [
          ["느린 출발(Slow Start)", "네트워크 연결 초기에는 CWND 크기를 전송시마다 2배씩 증가, ACK 수신 실패 시 감소시키는 전송방식"],
          ["혼잡회피(Congestion Avoidance)", "ACK 수신 시 마다 CWND 크기를 선형적으로 증가시키는 전송방식"],
          ["빠른 전송(Fast Retransmission)", "송신자에게 다음 수신할 Sequence Number를 알려주고 그 이후에는 Slow Start 로 전송하는 방식"],
          ["빠른 회복(Fast Recovery)", "Fast Retransmission 통해 손실 세그먼트를 전송한 후 Congestion Avoidance를 수행하는 전송방식"],
        ],
      },
      {
        caption: "알고리즘 유형",
        headers: ["유형", "단계", "설명"],
        rows: [
          ["Tahoe 알고리즘", "1 Slow start", "임계치 도달까지 윈도우 크기를 지수적으로 증가"],
          ["Tahoe 알고리즘", "2 Congestion Avoidance", "임계치 도달 후, 윈도우 크기를 1씩 증가"],
          ["Tahoe 알고리즘", "3 Time out", "임계치를 줄이고 재시작"],
          ["Reno 알고리즘", "1 Slow Start", "임계치 도달까지 윈도우 크기를 지수적으로 증가"],
          ["Reno 알고리즘", "2 Congestion Avoidance", "임계치 도달 후, 윈도우 크기를 1씩 증가"],
          ["Reno 알고리즘", "3 Fast Recovery", "Congestion Avoidance 수행"],
          ["New Reno 알고리즘", "Partial ACK 도입", "한 윈도우 내에 다수의 패킷 손실 발생 시 RTO 때까지 대기해야 하는 문제를 해결하기 위해 손실된 하나의 패킷 복구에 한번의 RTT 소요하는 기법"],
        ],
      },
    ],
    notes: ["메커니즘 그래프: Slow Start(지수 증가) → ssthresh 도달 → 혼잡회피(선형 증가) → 손실 발생 → Fast Retransmit → Fast Recovery(사이즈 절반에서 다시 선형적으로 증가). 초기버전이 Taho(e) TCP, 이후 버전이 Reno TCP", "위 4단계를 통해 처리하는 과정을 TCP 혼잡제어(Congestion Control)라고 함"],
  },
  {
    title: "TCP 와 UDP 비교",
    course: "NW",
    definition: "연결 지향형인 TCP와 비 연결 지향형인 UDP 비교",
    defShort: "연결 지향 TCP와 비연결 지향 UDP의 특성 비교",
    keywords: ["연결지향", "순서제어", "흐름제어", "혼잡제어", "오류제어", "제어 플래그"],
    tables: [
      {
        caption: "TCP와 UDP 비교",
        headers: ["구분", "TCP", "UDP"],
        rows: [
          ["정의", "4계층의 통신 프로토콜", "제어용 메시지 처리나 빠른 응답을 요구하는 응용 서비스를 위하여 비연결형 설정을 제공하는 프로토콜"],
          ["주요 기능", "연결제어, 순서제어, 흐름제어, 혼잡제어, 오류제어", "Connectionless(비신뢰성), 빠른 전송 속도, 오류 검출"],
          ["데이터 순서", "순서 유지함", "순서 유지하지 않음"],
          ["데이터 중복", "데이터 중복, 손실 없음", "데이터 중복, 손실 가능"],
          ["연결지향", "연결지향", "비 연결 지향"],
          ["전송속도", "UDP에 비해 느림", "TCP에 비해 빠름"],
          ["에러체크", "에러검사 후 에러시 재전송", "에러 검사 후 에러 시 재전송하지 않음"],
          ["헤더크기", "20바이트", "8바이트"],
          ["흐름제어", "슬라이딩 윈도우(패킷 흐름 제어) 사용", "흐름제어 없음"],
          ["사용 프로토콜", "HTTP, FTP, SMTP등", "DNS, SNMP, RIP등"],
        ],
      },
      {
        caption: "TCP 제어 플래그 (6종)",
        headers: ["플래그", "설명"],
        rows: [
          ["① URG (Urgent)", "송신측 상위 계층이 긴급 데이터라고 알려주면, 긴급 비트 URG를 1 로 설정하고 순서에 상관없이 먼저 송신"],
          ["② ACK (Acknowledgement)", "확인 응답 필드에 확인응답번호(Acknowledgement Number) 값이 셋팅 되었음을 알림"],
          ["③ PSH (Push)", "수신 측은 버퍼가 찰 때까지 기다리지 않고, 수신 즉시 버퍼링 된 데이터를 응용프로그램에 전달"],
          ["④ RST (Reset)", "연결확립(ESTABLISHED)된 회선에 강제 리셋 요청"],
          ["⑤ SYN (Synchronize)", "TCP 연결설정 초기화를 위한 순서번호의 동기화"],
          ["⑥ FIN (Finish)", "송신기가 데이터 보내기를 끝마침"],
        ],
      },
      {
        caption: "헤더 구조",
        headers: ["구분", "구성"],
        rows: [
          ["TCP 헤더 (20 byte, 무옵션시)", "발신지 포트 주소 / 목적지 포트 주소 / Sequence number / Acknowledgement number / HLEN(4bits) · 예약(6bits) · 제어플래그(URG ACK PSH RST SYN FIN) / Window size / Checksum / Urgent pointer / Options and Padding"],
          ["UDP 헤더 (8 byte)", "송신지 포트 번호(16비트) / 수신지 포트 번호(16비트) / 전체 길이(16비트) / 검사합(16비트)"],
        ],
      },
    ],
  },
  {
    title: "IPv4와 IPv6 터널링",
    course: "NW",
    definition:
      "IPv6/IPv4 호스트와 라우터에서 IPv6 데이터 그램을 IPv4 패킷에 캡슐화하여 IPv4 라우팅 토폴로지 영역을 통해 전송하는 방법",
    defShort: "IPv6 데이터그램을 IPv4 패킷에 캡슐화해 전송하는 전환 방법",
    keywords: ["듀얼 스택", "터널링", "주소 변환"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["듀얼 스택(Dual Stack, 라우팅 관점)", "IP계층에서 IPv4와 IPv6의 기능 모두 설치(IPv4/IPv6 라우터에 장착). DNS 주소 해석라이브러리(DNS Resolver Library)가 두가지 유형 모두 지원 필요. 프로토콜 스택 수정으로 인한 과다한 비용"],
          ["터널링(Tunneling, 네트워크)", "트래픽이 IPv6망에서 인접한 IPv4망을 거쳐서 건너편 IPv6망으로 통과할 때 IPv4망에 터널을 만들어 IPv6 패킷을 통과시키는 개념. IPv6 노드 간에 IPv6 패킷을 IPv4 패킷 속에 포함시켜서 IPv4망으로 전달"],
          ["주소 변환(Address Translation, G/W 방식)", "IPv4망과 IPv6망 사이 주소변환기를 사용하여 상호 연동하는 기술. IPv4/IPv6 호스트의 프로토콜 스택에 대한 수정 불필요. 구현이 용이(변환방식 투명, 변환 절차 간단)"],
        ],
      },
      {
        caption: "주소 변환 방식",
        headers: ["방식", "설명"],
        rows: [
          ["헤더변환(Header Conversion)방식", "IPv6 헤더를 IPv4 헤더로(또는 그 반대로) 직접 변환"],
          ["수송계층 릴레이(Transport Relay)방식", "전송 계층에서 양쪽 연결을 중계"],
          ["응용계층 게이트웨이(ALG: Application-Level Gateway) 방식", "응용 프락시 서버가 HTTP 등 응용 계층에서 중계 — IPv6측 HTTP/TCP/IPv6 ↔ IPv4측 HTTP/TCP/IPv4"],
        ],
      },
    ],
    notes: ["터널링 개념도: Node A(IPv6/IPv4) → IPv4 Infrastructure 구간에 IPv6 Over IPv4 Tunnel 생성 → IPv4/IPv6 Router → IPv4 or IPv6 Infrastructure → Node B(IPv6)"],
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
    // 4글자 이상일 때만 허용한다.
    (t.length >= 4
      ? SUBNOTES.find((s) => {
          const n = norm(s.title);
          return n.includes(t) || t.includes(n);
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
