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
  /** 교재 분류 (CA=컴퓨터구조, OS=운영체제, PM=프로젝트관리, SE=소프트웨어공학) */
  course: "CA" | "OS" | "PM" | "SE";
  /** 교재 '■ 정의' 그대로 */
  definition: string;
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
