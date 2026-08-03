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
  /** 교재 분류 (CA=컴퓨터구조, OS=운영체제) */
  course: "CA" | "OS";
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
    topicId: "ca-58",
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
    topicId: "ca-78",
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
];

/** topicId 로 교재 서브노트를 찾는다. */
export function subnoteByTopicId(topicId?: string): TextbookSubnote | undefined {
  if (!topicId) return undefined;
  return SUBNOTES.find((s) => s.topicId === topicId);
}

/** 제목으로 교재 서브노트를 찾는다(느슨한 일치). */
export function subnoteByTitle(title?: string): TextbookSubnote | undefined {
  const t = (title || "").trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
  if (!t) return undefined;
  return SUBNOTES.find((s) => {
    const n = s.title.toLowerCase().replace(/[\s()·,\-_/]/g, "");
    return n === t || n.includes(t) || t.includes(n);
  });
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
