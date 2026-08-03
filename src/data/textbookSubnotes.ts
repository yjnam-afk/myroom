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
