/**
 * 토픽 지도 「레벨 맵」 — 과목마다 두 축이 교차하는 매트릭스 맵 여러 장.
 *
 * 2026-10-11 "토픽 지도는 이 레벨까지 내려가야 하는데" — 사용자가 「계층별 보안 맵(공격 ↔ 대응)」
 * 한 장(보호 계층 × 위협·기술적 대응·관리적 대응, 칸마다 키워드 칩)을 보여 줬다. 지도가 과목 → 영역 →
 * 토픽 칩에서 멈춰 토픽끼리의 관계가 키워드 수준까지 안 보였다.
 *
 * - 칩 글자는 교재(서브노트 제목·정의·키워드·표 항목)에 있는 말만 쓴다. 행·열 이름은 길잡이 말이라
 *   교재 용어가 아닐 수 있다 — 답안·서브노트에 옮겨 쓰지 않는다(topicTree 의 영역·분류 이름과 같은 성격).
 * - `t` 가 있는 칩은 그 토픽을 가리킨다(누르면 지도 오른쪽에 토픽 정보). 제목이 바뀌면 같이 고친다.
 * - 진한 칩(출제 핵심)은 데이터로 정하지 않는다 — 지도 화면이 기출·NS·모의 출제 횟수로 맵마다 상위 칩을 칠한다.
 */
export type LmTone =
  | "red"
  | "amber"
  | "blue"
  | "green"
  | "violet"
  | "teal"
  | "slate"
  | "rose"
  | "sky"
  | "orange";
export type LmChip = string | { k: string; t?: string };
export type LevelMap = {
  no: number;
  title: string;
  sub: string;
  rowHead: string;
  cols: { name: string; tone: LmTone }[];
  rows: { name: string; en?: string; cells: LmChip[][] }[];
  all?: { name: string; chips: LmChip[] };
  /** 엮은 교재 토픽·표 */
  basis: string;
};

export const chipKey = (c: LmChip) => (typeof c === "string" ? c : c.k);
export const chipTopic = (c: LmChip) =>
  typeof c === "string" ? undefined : c.t;

/** 과목 코드 → 맵 */
export const LEVEL_MAPS: Record<string, LevelMap[]> = {
  CA: [
    {
      no: 1,
      title: "CPU·메모리 성능 맵 (병목 ↔ 해결 기법)",
      sub: "구성요소마다 성능을 깎는 병목과 이를 푸는 기법·유형을 짝지음",
      rowHead: "구성요소",
      cols: [
        { name: "병목·문제", tone: "red" },
        { name: "해결 기법", tone: "amber" },
        { name: "유형·지표", tone: "blue" },
      ],
      rows: [
        {
          name: "명령어 처리",
          en: "Instruction",
          cells: [
            ["다중 사이클", "복잡 명령어", "회로 구성 복잡"],
            [
              { k: "RISC", t: "CISC vs RISC" },
              "하드와이어 제어",
              "단일 사이클",
              "고정형식 명령어",
            ],
            [
              { k: "인출 사이클", t: "CPU 처리과정" },
              "실행 사이클",
              "MAR·MBR",
              "PC·IR·AC",
            ],
          ],
        },
        {
          name: "파이프라인",
          en: "Pipeline",
          cells: [
            [
              { k: "구조적 해저드", t: "Pipeline Hazard" },
              "데이터 해저드",
              "제어 해저드",
              "RAW·WAR·WAW",
            ],
            [
              "Operand Forwarding",
              "Register Renaming",
              "Predict Branch",
              "지연분기",
              "Stall",
            ],
            [
              { k: "슈퍼 파이프라인", t: "Pipeline(파이프라인)" },
              "슈퍼 스칼라",
              "VLIW",
              "단일 파이프라인",
            ],
          ],
        },
        {
          name: "캐시 접근",
          en: "Cache Access",
          cells: [
            ["캐시 미스", "버스 트래픽 증가", "쓰기 시간 증가"],
            [
              {
                k: "집합 연관 사상",
                t: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)",
              },
              "직접 사상",
              "완전 연관 사상",
              { k: "Write Back", t: "캐시메모리의 쓰기정책(Write Policy)" },
              "Write Through",
            ],
            [
              "태그 비교",
              "Valid Bit",
              "Dirty Bit",
              { k: "Cache Flush", t: "캐시 플러시(Cache Flush)" },
            ],
          ],
        },
        {
          name: "캐시 일관성",
          en: "Coherence",
          cells: [
            [
              { k: "캐시 불일치", t: "캐시 일관성(Cache Coherence)" },
              "멀티 프로세서 환경",
              "변경 가능한 데이터",
              "입출력 동작",
            ],
            [
              "스누피 프로토콜",
              "디렉토리 프로토콜",
              "공유 캐시 사용",
              "쓰기 무효·쓰기 갱신",
            ],
            [
              { k: "MESI", t: "MESI" },
              "Modify·Exclusive",
              "Shared·Invalid",
              "MOESI·MESIF",
            ],
          ],
        },
        {
          name: "주기억장치",
          en: "Main Memory",
          cells: [
            [
              { k: "내부 단편화", t: "메모리 단편화(Fragmentation)" },
              "외부 단편화",
              "가상 주소",
              "액세스 시간",
            ],
            [
              "통합·압축",
              "Buddy System",
              "Slab Allocator",
              { k: "하위 인터리빙", t: "메모리 인터리빙(Interleaving)" },
              "혼합 인터리빙",
            ],
            [
              { k: "MMU", t: "MMU(Memory Management Unit)" },
              "TTB",
              "C-Access·S-Access",
              "T=Ta+(M*tb)",
            ],
          ],
        },
        {
          name: "입출력·버스",
          en: "I/O·Bus",
          cells: [
            ["버스 경합", "버스 2회 사용", "버스 사이클 독점"],
            [
              { k: "DMA", t: "DMA(Direct Memory Access)" },
              "Cycle Stealing",
              "Burst Mode",
              "Interleaved DMA",
            ],
            [
              "입출력 버스 방식",
              "단일버스 통합방식",
              {
                k: "I2C·SPI",
                t: "I2C(Inter Integrated Circuit)와 SPI(Serial Peripheral Interface)",
              },
              "SCL·SDA",
              "MOSI·MISO",
            ],
          ],
        },
        {
          name: "AI 가속",
          en: "Accelerator",
          cells: [
            ["연산 병목", "데이터 병목", "데이터 이동"],
            [
              { k: "TPU", t: "TPU (Tensor Processing Unit)" },
              "시스톨릭 배열",
              "HBM",
              { k: "Memory Pooling", t: "CXL(Compute Express Link) 3.0" },
              { k: "뉴로모픽", t: "지능형 반도체" },
            ],
            ["MXU", "TPU Pod", "PCIe 6.0", "CXL.cache", "지능형메모리"],
          ],
        },
      ],
      basis:
        "CPU 처리과정 인출·실행 사이클 표, CISC vs RISC 표, 파이프라인 유형·해저드 해결 표, 캐시 사상 방식·쓰기정책·일관성(HW 기법)·MESI 표, 메모리 단편화·인터리빙·MMU 주소 변환 표, DMA 연결·전송 모드 표, I2C vs SPI 표, TPU 구성요소·CXL 특징·지능형 반도체 핵심 기술 표",
    },
    {
      no: 2,
      title: "결함허용·가용성 맵 (감지·진단 → 통제 → 복구)",
      sub: "결함허용 단계(감진통복)를 계층마다 펼쳐 기법을 짝지음",
      rowHead: "보호 계층",
      cols: [
        { name: "결함 감지·진단", tone: "red" },
        { name: "결함 통제·다중화", tone: "amber" },
        { name: "결함 복구", tone: "green" },
      ],
      rows: [
        {
          name: "프로세서·MCU",
          en: "Processor",
          cells: [
            [
              { k: "Watchdog Timer", t: "워치독 타이머(WDT, Watchdog timer)" },
              "Kick",
              "Timeout",
              "Task Runaway",
            ],
            ["TMR", "Duplication", "Self-Purging"],
            ["Reset MCU", "Stand by Sparing", "다단계 워치독 타이머"],
          ],
        },
        {
          name: "캐시·메모리",
          en: "Cache·Memory",
          cells: [
            ["Valid Bit", "Dirty Bit", "스누피 제어기"],
            [
              { k: "MESI", t: "MESI" },
              { k: "Write Through", t: "캐시메모리의 쓰기정책(Write Policy)" },
              "Invalid 브로드캐스팅",
            ],
            [
              { k: "Cache Clean", t: "캐시 플러시(Cache Flush)" },
              "Cache Flush",
              "invalidate",
            ],
          ],
        },
        {
          name: "디스크·저장장치",
          en: "Storage",
          cells: [
            ["패리티", "해밍 코드", "ECC"],
            [
              { k: "RAID 1", t: "RAID (Redundant Array of Independent Disks)" },
              "RAID 5",
              "RAID 10",
              "미러링",
              "분산 패리티",
            ],
            [
              { k: "이레이저 코딩", t: "이레이저 코딩(erasure coding)" },
              "Reed-Solomon Code",
              "Weaver Code",
              "디코딩",
            ],
          ],
        },
        {
          name: "시스템·클러스터",
          en: "Cluster",
          cells: [
            [{ k: "Heart-beat", t: "HA(High Availability)" }, "장애 발생"],
            ["Hot Standby", "Mutual Takeover", "Concurrent Access"],
            ["Fail-Over", "Take-over", "Reconfiguration"],
          ],
        },
        {
          name: "소프트웨어",
          en: "Software",
          cells: [
            [{ k: "결함 진단", t: "결함허용 컴퓨터(FTS)" }, "N self-checking"],
            ["N version", "Recovery Block"],
            ["Check point", "Distributed Recovery", "Conversation"],
          ],
        },
        {
          name: "데이터베이스",
          en: "DBMS",
          cells: [
            ["Log File", "트랜잭션 ACID"],
            ["Shadow Paging", "Check Point"],
            ["Rollback", "Undo"],
          ],
        },
      ],
      all: {
        name: "결함허용 (전 계층)",
        chips: [
          { k: "FTS", t: "결함허용 컴퓨터(FTS)" },
          "Graceful Degradation",
          "Fault Detection",
          "Fault Isolation",
          "Fault Recovery",
          { k: "HA", t: "HA(High Availability)" },
        ],
      },
      basis:
        "결함허용 컴퓨터 단계별 특성(감진통복)·관점별 기법(Hardware·Software·DBMS) 표, 워치독 타이머 구성요소·동작 과정·구현 방법 표, RAID 종류 표, 이레이저 코딩 동작 방식·알고리즘 표, HA 구성 유형 표, 캐시 플러시 상태·Flush와 Clean 표, 캐시 일관성 HW 기법 표",
    },
  ],
  OS: [
    {
      no: 1,
      title: "기억장치 계층별 관리 맵 (문제 ↔ 관리 기법)",
      sub: "캐시부터 디스크까지 계층마다 생기는 문제와 관리 기법·자료구조를 짝지음",
      rowHead: "기억장치 계층",
      cols: [
        { name: "문제·현상", tone: "red" },
        { name: "관리 기법", tone: "amber" },
        { name: "기준·자료구조", tone: "blue" },
      ],
      rows: [
        {
          name: "캐시 기억장치",
          en: "Cache",
          cells: [
            ["접근 시간 증가", "비트당 비용", "Cache Access 시간"],
            [
              { k: "지역성", t: "지역성(Locality)" },
              "LRU 블록 교체",
              "Prefetch",
              "미리 인출",
            ],
            [
              {
                k: "기억장치 계층 구조",
                t: "기억장치 계층 구조 (Memory Hierarchy)",
              },
              "Cache 적중률",
              "시간적·공간적·순차적",
            ],
          ],
        },
        {
          name: "주기억장치 할당",
          en: "Allocation",
          cells: [
            [
              { k: "내부 단편화", t: "단편화(Fragmentation)" },
              "외부 단편화",
              "낭비 공간",
            ],
            [
              "통합·집약",
              "Buddy System",
              "슬랩 할당자",
              { k: "First·Best Fit", t: "가상메모리 관리기법" },
            ],
            ["고정 분할", "가변 분할", "공간 합은 충분"],
          ],
        },
        {
          name: "주소 변환",
          en: "Paging·Segment",
          cells: [
            ["맵핑 테이블 필요", "기억 장소 낭비", "기억장치 보호키"],
            [
              { k: "페이징", t: "가상메모리의 페이징과 세그멘테이션" },
              "세그멘테이션",
              { k: "직접 사상", t: "직접 사상과 연관 사상 페이징 기법" },
              "연관 사상",
              "TLB",
            ],
            ["페이지 사상표", "변위", "Page 존재 bit", "역 페이지 테이블"],
          ],
        },
        {
          name: "페이지 교체",
          en: "Replacement",
          cells: [
            [
              { k: "Belady's Anomaly", t: "Belady's Anomaly(FIFO 이상현상)" },
              "page fault 증가",
              "Locality 미고려",
            ],
            [
              {
                k: "LRU",
                t: "페이지 교체 알고리즘(Paging Replacement Algorithm)",
              },
              "OPT",
              "FIFO",
              "NUR·SCR",
              "Clock",
            ],
            ["참조 bit", "수정비트", "최적화의 원칙", "교체 제외 페이지"],
          ],
        },
        {
          name: "다중 프로그래밍",
          en: "Multiprogramming",
          cells: [
            [
              { k: "스레싱", t: "스레싱(Thrashing)" },
              "과도한 다중 프로그래밍",
              "CPU 사용율 감소",
              "페이지 부재율 증가",
            ],
            ["Working Set", "PFF", "Load Control", "페이지 Lock"],
            ["Working Set Window", "Page Fault Frequency", "Residence Set"],
          ],
        },
        {
          name: "보조기억장치",
          en: "Disk·File",
          cells: [
            ["Seek Time", "회전 지연", "스와핑 비용"],
            [
              { k: "SSTF", t: "디스크 스케줄링(Disk Scheduling)" },
              "SCAN·C-SCAN",
              "LOOK·C-LOOK",
              "SLTF",
            ],
            [
              { k: "i-node", t: "유닉스의 inode" },
              { k: "슈퍼 블록", t: "파일 시스템(유닉스 파일시스템)" },
              "Direct Block",
              "데이터 블록",
            ],
          ],
        },
      ],
      all: {
        name: "가상메모리 관리기법 (전 계층)",
        chips: [
          { k: "할당 기법", t: "가상메모리 관리기법" },
          "배치 기법",
          "호출 기법",
          "교체 기법",
          "Demand·Pre Fetch",
          "스와핑",
        ],
      },
      basis:
        "기억장치 계층 구조 특징 표, 지역성 유형·사례·필요성 표, 단편화 유형·해결 방법·커널 메모리 할당자 표, 가상메모리 관리기법 할당·배치·호출·교체·스와핑 표, 페이징·세그멘테이션 특징·단편화 대응 표, 직접·연관 사상 동작 표, 페이지 교체 알고리즘 종류·교체 대상 선택 표, Belady's Anomaly 원인·극복 표, 스레싱 원인·해결·워킹셋·예방 표, 디스크 스케줄링 유형 표, 유닉스 파일시스템 구조·i-node 구성 표",
    },
    {
      no: 2,
      title: "프로세스 상태 전이 맵 (전이 ↔ 담당 ↔ 기법·정보)",
      sub: "상태 전이마다 누가 일으키고 어떤 알고리즘·문맥 정보가 쓰이는지 정리",
      rowHead: "상태 전이",
      cols: [
        { name: "계기·이벤트", tone: "red" },
        { name: "담당 주체", tone: "amber" },
        { name: "기법·알고리즘", tone: "blue" },
        { name: "저장·관리 정보", tone: "green" },
      ],
      rows: [
        {
          name: "생성 → 준비",
          en: "Admit",
          cells: [
            ["Admit", "작업 풀"],
            [{ k: "장기 스케줄러", t: "스케줄러(Scheduler)" }, "Job Scheduler"],
            ["멀티프로그래밍 정도", "최대 처리량"],
            [{ k: "PCB", t: "PCB(Process Control Block)" }, "PID"],
          ],
        },
        {
          name: "준비 → 실행",
          en: "Dispatch",
          cells: [
            [{ k: "Dispatch", t: "프로세스 상태 전이도" }, "CPU 제어권"],
            ["단기 스케줄러", "디스패처"],
            [
              { k: "FCFS", t: "CPU 스케줄링(CPU Scheduling)" },
              "SJF",
              "HRN",
              "Priority",
            ],
            ["프로그램 카운터", "PCB에서 복구"],
          ],
        },
        {
          name: "실행 → 준비",
          en: "Timeout",
          cells: [
            ["Timeout", "Time Slice", "선점"],
            ["단기 스케줄러", "Timer"],
            [
              "RR",
              "SRT",
              "MLFQ",
              { k: "EDF·RM", t: "기한부(Deadline) 스케줄링" },
            ],
            ["응답시간", "반환시간", "간트 차트"],
          ],
        },
        {
          name: "실행 → 대기",
          en: "Block",
          cells: [
            [
              { k: "인터럽트", t: "인터럽트(Interrupt)" },
              { k: "시스템 콜", t: "시스템 콜(System Call)" },
              "Block I/O",
            ],
            [
              "인터럽트 서비스 루틴",
              { k: "커널 모드", t: "커널(Kernel)" },
              { k: "Ring 0", t: "CPU Ring Level" },
            ],
            ["인터럽트 벡터", "Priority-based Preemption", "Interrupt Pending"],
            [{ k: "하드웨어 문맥", t: "문맥(Context)" }, "PCB 상태 저장"],
          ],
        },
        {
          name: "대기 → 준비",
          en: "Wake-up",
          cells: [
            ["Wake up", "I/O 완료 신호"],
            ["I/O 관리자", "Page Interrupt handler"],
            ["입출력 인터럽트", "준비 Queue"],
            ["입출력 상태 정보", "개방 파일 목록"],
          ],
        },
        {
          name: "준비·대기 ↔ 보류",
          en: "Swap",
          cells: [
            ["Swap out", "Swap in"],
            ["중기 스케줄러", "스와퍼"],
            ["스와핑", "보류 큐"],
            ["메모리 문맥", "Swap 공간", "메모리 관리 정보"],
          ],
        },
        {
          name: "스레드 전환",
          en: "Thread",
          cells: [
            ["클록마다 교대", "블록 시 타 쓰레드"],
            [
              { k: "스레드", t: "프로세스(Process)와 스레드(Thread) 비교" },
              "라이브러리 콜",
            ],
            [
              { k: "SMT", t: "멀티 쓰레드(Multi-Thread)" },
              "IMT·BMT",
              "CMP",
              "Hyper-Threading",
            ],
            ["TCB", "PC·SP", "스택 포인터"],
          ],
        },
      ],
      all: {
        name: "문맥교환 (전 전이 공통)",
        chips: [
          { k: "문맥교환", t: "문맥교환(Context Switching)" },
          { k: "시스템 문맥", t: "문맥(Context)" },
          "메모리 문맥",
          "하드웨어 문맥",
          "save/reload PCB",
          "오버헤드",
        ],
      },
      basis:
        "프로세스 상태·상태 전이별 담당 스케줄러·전이 이벤트·문맥교환 발생 시점 표, 스케줄러 종류·정책 요구 사항·디스패처 비교 표, 선점·비선점 스케줄링·간트 차트 표, RM과 EDF 비교 표, 인터럽트 처리 절차·중첩 표, 시스템 콜 동작·커널 모드와 유저 모드 표, CPU Ring Level 구조 표, PCB 구성 정보·PCB와 TCB 표, 멀티 쓰레드 종류 표, 문맥의 세 유형 표",
    },
    {
      no: 3,
      title: "동기화·교착상태 맵 (원인 ↔ 해결 ↔ 판단 기준)",
      sub: "공유 자원 경쟁에서 생기는 문제별 발생 조건과 해결 기법을 짝지음",
      rowHead: "문제 상황",
      cols: [
        { name: "발생 원인·조건", tone: "red" },
        { name: "해결 기법", tone: "amber" },
        { name: "판단 기준·자료구조", tone: "blue" },
      ],
      rows: [
        {
          name: "경쟁조건",
          en: "Race Condition",
          cells: [
            ["공유 자원", "비동기적 실행", "Critical Section 미보호"],
            [
              { k: "피터슨", t: "경쟁조건(Race Condition) 해결 방안" },
              "데커",
              "램포트",
              "Test & Set",
              "Compare & Swap",
            ],
            ["상호 배제", "진행", "한계 대기"],
          ],
        },
        {
          name: "상호배제·동기화",
          en: "Synchronization",
          cells: [
            ["자원 경쟁", "다중프로세스", "타이밍 오류"],
            [
              { k: "세마포어", t: "세마포어(Semaphore)" },
              "모니터",
              "Mutex",
              "Spin Lock",
            ],
            ["P·V 연산", "이진 세마포어", "계수형 세마포어", "원자적 실행"],
          ],
        },
        {
          name: "프로세스 간 통신",
          en: "IPC",
          cells: [
            ["데이터 교환", "동기화 문제"],
            [
              { k: "공유 메모리", t: "프로세스간 통신(IPC)" },
              "mmap",
              "파이프",
              "메시지 큐",
              "소켓",
            ],
            ["커널 배제", "매번 커널 관여", "시그널"],
          ],
        },
        {
          name: "우선순위 역전",
          en: "Priority Inversion",
          cells: [
            ["선점 스케줄링", "임계영역", "세마포어"],
            [
              {
                k: "우선순위 상속",
                t: "우선순위 역전(Priority Inversion) 현상",
              },
              "우선순위 올림",
              "재귀적 우선순위 상속",
            ],
            ["BPI·PCE·RPI", "자원 동시 소유"],
          ],
        },
        {
          name: "기아",
          en: "Starvation",
          cells: [
            ["비선점", "우선순위", "자원 할당의 불공평성", "호위효과"],
            [
              { k: "Aging 기법", t: "기아(Starvation)" },
              "HRN 스케줄링",
              "MLFQ 스케줄링",
              "타임 퀀텀 설정",
            ],
            ["대기 시간 반영", "지분 비례 CPU"],
          ],
        },
        {
          name: "교착상태 예방·회피",
          en: "Prevention·Avoidance",
          cells: [
            [
              { k: "상호 배제", t: "교착상태(Deadlock)" },
              "점유 대기",
              "비선점",
              "환형 대기",
            ],
            ["예방", "회피", "Wait-die·wound-wait"],
            [
              { k: "은행가 알고리즘", t: "Banker's 알고리즘(은행가 알고리즘)" },
              "안정상태",
              "Need·Max",
              "Available·Allocation",
            ],
          ],
        },
        {
          name: "교착상태 발견·회복",
          en: "Detection·Recovery",
          cells: [
            ["사이클", "요청 간선", "할당 간선"],
            ["발견", "회복", "프로세스 순차 Kill"],
            [
              {
                k: "자원할당 그래프",
                t: "자원할당 그래프(Resource Allocation Graph)",
              },
              "Wait for Graph",
              "필요충분조건",
            ],
          ],
        },
      ],
      all: {
        name: "교착상태 vs 기아",
        chips: [
          { k: "교착상태", t: "교착상태(Deadlock)" },
          { k: "기아상태", t: "기아(Starvation)" },
          "Coffman 4조건",
          "RAG",
          "HRRN",
        ],
      },
      basis:
        "경쟁조건 발생 원인·소프트웨어/하드웨어/동기화 방식 해결 방안·임계영역 세가지 요건 표, 세마포어 연산·이진/계수형·모니터 비교 표, IPC 공유 메모리·메시지 전달 방식 비교 표, 우선순위 역전 메커니즘·해결 방안·BPI/PCE/RPI 비교 표, 기아 발생 원인·조건·방지 기법 표, 교착상태 발생 조건·해결 방안·기아 비교 표, 자원할당 그래프 구성·탐지 방법 표, 은행가 알고리즘 자료 구조·안정상태 표",
    },
  ],
  SE: [
    {
      no: 1,
      title: "SW 개발 방법론 맵 (중심 관점 ↔ 기법 ↔ 재사용)",
      sub: "방법론 유형별로 개발 원리·핵심 기법·산출물과 재사용 방식을 정리",
      rowHead: "방법론 유형",
      cols: [
        { name: "핵심 원리", tone: "blue" },
        { name: "기법·구성요소", tone: "amber" },
        { name: "산출물·재사용", tone: "green" },
      ],
      rows: [
        {
          name: "구조적",
          cells: [
            [
              { k: "개발 방법론", t: "소프트웨어 개발 방법론" },
              "분할과 정복",
              "하향식 기능분해",
              "단계적 분해",
            ],
            [
              { k: "설계 원리", t: "소프트웨어 설계의 원리" },
              "DFD",
              "모듈화",
              "정보은닉",
            ],
            ["상위 설계", "모듈설계", "알고리즘 설계"],
          ],
          en: "절차 중심",
        },
        {
          name: "정보공학",
          cells: [
            ["데이터모델 중심", "데이터와 프로세스 균형"],
            ["ERD", "CASE", "데이터 설계"],
            ["기업정보시스템", "자료구조설계"],
          ],
          en: "데이터 중심",
        },
        {
          name: "객체지향",
          cells: [
            [
              { k: "객체지향 특징", t: "객체지향 프로그래밍 특징" },
              { k: "SOLID", t: "객체지향 설계 원리" },
              { k: "데메테르의 법칙", t: "데메테르의 법칙 (Law of Demeter)" },
            ],
            [
              { k: "UML", t: "UML (정적, 동적 다이어그램)" },
              { k: "디자인 패턴", t: "디자인 패턴 (Design Pattern)" },
              { k: "AOP", t: "AOP (Aspect Oriented Programming)" },
              { k: "다형성", t: "다형성 (Polymorphism)" },
            ],
            ["White Box Reuse", "객체·클래스·메시지"],
          ],
          en: "객체 중심",
        },
        {
          name: "CBD·Product Line",
          cells: [
            [
              "컴포넌트 조합",
              "Black Box Reuse",
              { k: "Product Line", t: "Product Line" },
            ],
            [
              "Domain Engineering",
              "Application Engineering",
              { k: "3R", t: "3R" },
            ],
            ["Core Asset", "레파지토리", "재사용"],
          ],
          en: "자산 중심",
        },
        {
          name: "Agile",
          cells: [
            ["즉시 피드백", "고객 요구 변화"],
            [
              "XP·Scrum·Kanban",
              { k: "TDD", t: "TDD (Test Driven Development)" },
              "Red-Green-Refactor",
            ],
            ["사용자 스토리", "리팩토링", "체크인"],
          ],
          en: "변화 중심",
        },
        {
          name: "AI 주도",
          cells: [
            [
              { k: "AI-DLC", t: "AI-DLC(AI-Driven SDLC)" },
              { k: "SDD", t: "SDD(Spec-Driven Development)" },
              "Spec First",
            ],
            ["Intent·Unit·Bolt", "실행 가능한 명세", "Failing Test"],
            ["승인된 결과물", "SSoT", "명세 갱신"],
          ],
          en: "AI-Driven",
        },
      ],
      all: {
        name: "공통 — 테일러링",
        chips: [
          { k: "테일러링", t: "테일러링 (Tailoring)" },
          "프로젝트 특징 정의",
          "표준 프로세스 선정 및 검증",
          "상위 Level Customizing",
          "세부 Customizing",
          "결정사항 문서화",
        ],
      },
      basis:
        "개발 방법론 유형(구정객CAP)·구성요소(절방산관기도) 표, 설계 원리·SW 설계 유형 표, 객체지향 특징, Product Line 구성 요소, 3R 재사용 표, TDD 단계, AI-DLC 세부 요소, SDD 핵심원칙, 테일러링 수행 절차",
    },
    {
      no: 2,
      title: "SW 아키텍처 구축 맵 (단계 ↔ 기법 ↔ 산출물)",
      sub: "아키텍처 구축 절차 단계마다 쓰는 기법·모델과 산출물을 정리",
      rowHead: "구축 단계",
      cols: [
        { name: "주요 활동", tone: "blue" },
        { name: "기법·모델", tone: "amber" },
        { name: "산출물·기준", tone: "green" },
      ],
      rows: [
        {
          name: "요구사항 분석",
          cells: [
            [
              { k: "요구공학", t: "요구공학 (Requirements Engineering)" },
              "요구사항 추출",
              "요구사항 명세",
              "요구사항 검증",
            ],
            [
              "인터뷰·프로토타이핑",
              { k: "페르소나", t: "페르소나 (Persona)" },
              { k: "유즈케이스", t: "유즈케이스 다이어그램" },
            ],
            ["요구사항 명세서", "요구사항 기준선", "추적성"],
          ],
          en: "Requirements",
        },
        {
          name: "아키텍처 분석",
          cells: [
            [
              "품질속성 식별",
              {
                k: "아키텍처 드라이버",
                t: "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)",
              },
            ],
            [
              { k: "유틸리티 트리", t: "유틸리티 트리 (Utility Tree)" },
              { k: "품질 속성 시나리오", t: "소프트웨어 품질 속성 시나리오" },
              "브레인 스토밍",
            ],
            ["기능 요구 사항", "품질 요구 사항", "제약 사항", "응답 측정"],
          ],
          en: "Quality Attribute",
        },
        {
          name: "설계 — 관점",
          cells: [
            ["관점 정의", "이해관계자 파악"],
            [
              { k: "4+1 View", t: "UML의 4+1 View Model" },
              { k: "ISO/IEC/IEEE 42010", t: "ISO/IEC/IEEE 42010:2022" },
              "Siemens Four Views",
            ],
            [
              "Architecture Description",
              "Architecture Viewpoint",
              "Architecture Rationale",
            ],
          ],
          en: "View",
        },
        {
          name: "설계 — 스타일",
          cells: [
            ["아키텍처스타일선택", "후보아키텍처도출"],
            [
              { k: "아키텍처 스타일", t: "소프트웨어 아키텍처 스타일" },
              "파이프 필터형",
              "Layered Architecture",
              "Broker",
              { k: "MVVM", t: "MVVM (Model, View, View Model)" },
              { k: "Clean Architecture", t: "Clean Architecture" },
            ],
            ["SW 아키텍처 명세서", "배경도"],
          ],
          en: "Style",
        },
        {
          name: "검증 및 승인",
          cells: [
            ["아키텍처 평가", "아키텍처상세화", "아키텍처 승인"],
            [
              { k: "ATAM", t: "SW Architecture 평가" },
              { k: "CBAM", t: "CBAM(Cost Benefit Analysis Method)" },
              "SAAM",
              "ARID",
              "EATAM",
            ],
            ["Trade-Off", "효용-반응 곡선", "ROI 계산"],
          ],
          en: "Evaluation",
        },
      ],
      all: {
        name: "전 단계 — 구축 절차",
        chips: [
          { k: "SW Architecture 구축 절차", t: "SW Architecture 구축 절차" },
          "Stakeholder",
          "Concern",
          "Correspondence",
        ],
      },
      basis:
        "SW Architecture 구축 절차 표, 요구공학 프로세스, 아키텍처 드라이버 구성 요소, 유틸리티 트리·품질 속성 시나리오 구성, 4+1 View·ISO 42010 구성요소, 아키텍처 스타일 유형, SW 아키텍처 평가모델·CBAM 절차",
    },
    {
      no: 3,
      title: "객체지향 설계·UML 맵 (모델링 관점 ↔ 표기 ↔ 원리·패턴)",
      sub: "UML 다이어그램을 관점별로 놓고 표기 요소와 객체지향 원리·패턴을 연결",
      rowHead: "모델링 관점",
      cols: [
        { name: "다이어그램·대상", tone: "blue" },
        { name: "구성요소·표기", tone: "amber" },
        { name: "설계 원리·패턴", tone: "violet" },
      ],
      rows: [
        {
          name: "구조(정적)",
          cells: [
            [
              {
                k: "클래스 다이어그램",
                t: "클래스 다이어그램 (Class Diagram)",
              },
              "Component",
              "Package",
              "Deployment",
            ],
            [
              "Attribute·Operation",
              "접근 제어자",
              "일반화 관계",
              "실체화 관계",
              "복합연관관계",
            ],
            [
              { k: "객체지향 특징", t: "객체지향 프로그래밍 특징" },
              "캡슐화·정보은닉",
              "상속성",
              { k: "SOLID", t: "객체지향 설계 원리" },
            ],
          ],
          en: "Structure",
        },
        {
          name: "기능",
          cells: [
            [
              { k: "유즈케이스 다이어그램", t: "유즈케이스 다이어그램" },
              "Use Case View",
            ],
            ["Actor", "확장·포함", "일반화", "그룹화"],
            ["사용자 관점", "유스케이스 테스팅"],
          ],
          en: "Use Case",
        },
        {
          name: "상태(행위)",
          cells: [
            [
              { k: "상태 다이어그램", t: "상태 다이어그램 (State Diagram)" },
              "Activity",
            ],
            ["상태·전이", "이벤트", "전이조건"],
            ["상태 전이 테스팅", "임베디드SW"],
          ],
          en: "State",
        },
        {
          name: "상호작용(행위)",
          cells: [
            [
              {
                k: "시퀀스 다이어그램",
                t: "시퀀스 다이어그램 (Sequence Diagram)",
              },
              { k: "Interaction Overview", t: "Interaction overview diagram" },
              "Communication",
              "Timing",
            ],
            ["생명선", "메시지", "제어사각형", "loop·opt·par"],
            [
              { k: "데메테르의 법칙", t: "데메테르의 법칙 (Law of Demeter)" },
              "최소지식의 원칙",
              "loose coupling",
            ],
          ],
          en: "Interaction",
        },
        {
          name: "다형·확장",
          cells: [
            [{ k: "다형성", t: "다형성 (Polymorphism)" }, "동적바인딩"],
            ["오버로딩", "오버라이딩"],
            ["OCP", "LSP", "DIP"],
          ],
          en: "Polymorphism",
        },
        {
          name: "설계 패턴",
          cells: [
            [
              { k: "디자인 패턴", t: "디자인 패턴 (Design Pattern)" },
              "패턴이름·문제·해법·결과",
            ],
            ["생성패턴", "구조패턴", "행위패턴"],
            [
              { k: "싱글턴 패턴", t: "싱글턴 패턴 (Singleton pattern)" },
              "Factory Method",
              "Adapter",
              "Decorator",
            ],
          ],
          en: "Design Pattern",
        },
        {
          name: "구조 개선",
          cells: [
            [{ k: "리팩토링", t: "소프트웨어 리팩토링" }, "코드 스멜"],
            ["중복된 코드", "큰 클래스", "산탄총 수술"],
            ["Move·Extract", "Pull Up·Push Down", "Encapsulate Field"],
          ],
          en: "Refactoring",
        },
      ],
      all: {
        name: "UML 공통",
        chips: [
          { k: "UML", t: "UML (정적, 동적 다이어그램)" },
          "가시화",
          "구체화",
          "명세화",
          "문서화",
          "스테레오 타입",
        ],
      },
      basis:
        "UML 정적·동적 다이어그램 표, 클래스·유즈케이스·상태·시퀀스·Interaction overview 구성 요소, 객체지향 특징(캡추다정상), SOLID, 데메테르 법칙, 오버로딩·오버라이딩 비교, 디자인 패턴 분류(생구행), 리팩토링 대상·기법",
    },
    {
      no: 4,
      title: "MSA·DevOps 맵 (아키텍처 계층 ↔ 패턴 ↔ 운영)",
      sub: "마이크로 서비스 계층마다 생기는 문제와 해결 패턴, 배포·운영 기법을 정리",
      rowHead: "아키텍처 계층",
      cols: [
        { name: "문제·요구", tone: "red" },
        { name: "해결 패턴·기술", tone: "amber" },
        { name: "운영·관리", tone: "blue" },
      ],
      rows: [
        {
          name: "진입·연계",
          cells: [
            ["엔드포인트 통합", "비인가자 접근", "프로토콜 변환"],
            [
              { k: "API Gateway", t: "API Gateway" },
              "인증 및 인가",
              "로드 밸런싱",
              "서비스디스커버리",
            ],
            ["로깅 및 모니터링", "서비스 통계", "API Policy Management"],
          ],
          en: "Gateway",
        },
        {
          name: "서비스 분해",
          cells: [
            ["모델링과 개발 불일치", "비즈 기능 분리"],
            [
              { k: "DDD", t: "DDD (Domain Driven Design)" },
              "바운디드 컨텍스트",
              "유비쿼터스 언어",
              {
                k: "이벤트 스토밍",
                t: "이벤트 스토밍(Event Storming)과 헥사고날(Hexagonal) 아키텍처",
              },
            ],
            ["컨텍스트 맵", "Aggregate", "도메인 이벤트"],
          ],
          en: "Domain",
        },
        {
          name: "서비스 내부",
          cells: [
            ["관심사 분리", "외부 의존 없음"],
            [
              {
                k: "헥사고날 아키텍처",
                t: "이벤트 스토밍(Event Storming)과 헥사고날(Hexagonal) 아키텍처",
              },
              { k: "Clean Architecture", t: "Clean Architecture" },
              { k: "MVVM", t: "MVVM (Model, View, View Model)" },
            ],
            ["Port·Adapter", "Entity·Use Case", "Data Binding"],
          ],
          en: "Inner Architecture",
        },
        {
          name: "서비스 간 통신",
          cells: [
            ["상태변화", "비동기식", "병렬 처리"],
            [
              {
                k: "Event Driven Architecture",
                t: "Event Driven Architecture",
              },
              "Event-bus Pattern",
              "Broker",
              "REST API",
            ],
            ["이벤트 채널", "이벤트 처리 엔진", "Orchestration"],
          ],
          en: "Messaging",
        },
        {
          name: "데이터·트랜잭션",
          cells: [
            ["데이터 정합성 보장", "원자성"],
            [
              { k: "SAGA 패턴", t: "SAGA패턴" },
              "Choreography",
              "Orchestration Based SAGA",
            ],
            ["Polyglot Persistence", "RDB·NoSQL·New SQL", "보상 이벤트"],
          ],
          en: "Data",
        },
        {
          name: "통합·배포",
          cells: [
            ["사이클타임 축소", "릴리즈 배포 분리"],
            [
              { k: "DevOps", t: "데브옵스 (DevOps)" },
              "CI/CD",
              { k: "무중단 배포", t: "무중단 배포" },
              "Blue/Green",
              "Canary Release",
              "Rolling Update",
            ],
            [
              { k: "릴리즈 엔지니어링", t: "릴리즈 엔지니어링" },
              "코드형 인프라",
              "프로비저닝",
              "기능 토글",
            ],
          ],
          en: "CI/CD",
        },
        {
          name: "운영·복원력",
          cells: [
            ["운영 오류 최소화", "시스템 취약 부분"],
            [
              { k: "SRE", t: "SRE (Site Reliability Engineering)" },
              {
                k: "카오스 엔지니어링",
                t: "카오스 엔지니어링 (Chaos Engineering)",
              },
              "Fault Injection",
              { k: "카오스 테스트", t: "카오스 테스트 (Chaos Test)" },
            ],
            ["SLI·SLO", "Error Budget", "Toil 관리", "Postmortem"],
          ],
          en: "Reliability",
        },
      ],
      all: {
        name: "MSA 구성 요소",
        chips: [
          { k: "MSA", t: "MSA (Micro Service Architecture)" },
          "API Server",
          "Persistence",
          "User/Client",
          "Polyglot",
        ],
      },
      basis:
        "MSA 구성 요소 표, API Gateway 역할·주요 기능, DDD 설계 유형·구성 요소, 이벤트 스토밍·헥사고날 구성, Event Driven Architecture 구성, SAGA 비교, DevOps 구성 요소, 무중단 배포 기법, 릴리즈 엔지니어링 파이프라인, SRE 구성·CSF, 카오스 엔지니어링·카오스 테스트 절차",
    },
    {
      no: 5,
      title: "SW 테스트 기법 맵 (테스트 기반 ↔ 기법 ↔ 판정)",
      sub: "무엇을 근거로 테스트하는지에 따라 대표 기법과 판정·커버리지 기준을 정리",
      rowHead: "테스트 기반",
      cols: [
        { name: "원리·목적", tone: "blue" },
        { name: "대표 기법", tone: "amber" },
        { name: "판정·커버리지", tone: "green" },
      ],
      rows: [
        {
          name: "명세 기반",
          cells: [
            [
              { k: "블랙박스 테스트", t: "블랙박스 테스트" },
              "요구명세서",
              "기능중심",
            ],
            [
              "동등분할",
              "경계값 분석",
              "의사결정 테이블",
              "상태 전이 테스팅",
              "페어와이즈 테스팅",
              "원인-결과 그래프",
            ],
            ["예상 출력값과 일치", "분류 트리"],
          ],
          en: "Black-box",
        },
        {
          name: "구조 기반",
          cells: [
            [
              { k: "화이트박스 테스트", t: "화이트박스 테스트" },
              "논리 흐름",
              "제어 구조 테스트",
            ],
            [
              "루프 테스트",
              "기본 경로",
              { k: "McCabe 회전 복잡도", t: "McCabe 회전 복잡도" },
            ],
            [
              { k: "코드 커버리지", t: "코드 커버리지(Code Coverage)" },
              "구문 커버리지",
              "결정 커버리지",
              "MC/DC",
            ],
          ],
          en: "White-box",
        },
        {
          name: "경험 기반",
          cells: [
            [
              { k: "경험 기반 테스트", t: "경험 기반 테스트" },
              "Heuristic 기반",
            ],
            [
              { k: "탐색적 테스트", t: "탐색적 테스트" },
              "오류추정",
              "체크리스트",
            ],
            ["테스트 차터", "Time-boxing", "PROOF"],
          ],
          en: "Experience",
        },
        {
          name: "위험 기반",
          cells: [
            [
              { k: "위험 기반 테스트", t: "위험 기반 테스트" },
              "테스트 자원 한정",
            ],
            ["위험 식별", "위험 분석", "발생 가능성"],
            ["STA·STTA", "ITA·FTA"],
          ],
          en: "Risk",
        },
        {
          name: "결함 주입",
          cells: [
            [
              "결함 기반",
              { k: "뮤테이션 테스트", t: "뮤테이션 테스트 (Mutation Test)" },
              { k: "퍼징 테스트", t: "퍼징 테스트 (Fuzzing Test)" },
            ],
            [
              "뮤턴트 연산자",
              "Mutation based Fuzzing",
              "Smart Fuzzing",
              "Dumb Fuzzing",
            ],
            ["뮤턴트 스코어", "Crash call stack", "보안취약점"],
          ],
          en: "Fault-based",
        },
        {
          name: "비교·판정",
          cells: [
            [
              { k: "회귀 테스트", t: "리그레이션(회귀, Regression) 테스트" },
              { k: "Back to Back", t: "Back to Back 테스트" },
            ],
            ["Reset All", "Selective", "Priority 기법", "결과값 비교"],
            [
              { k: "테스트 오라클", t: "테스트 오라클" },
              "일관성 검사",
              "Ripple Effect",
              "Side Effect",
            ],
          ],
          en: "Oracle",
        },
        {
          name: "AI·지능",
          cells: [
            [
              { k: "ISO 29119-11", t: "ISO 29119-11" },
              { k: "튜링 테스트", t: "튜링 테스트" },
              "AI 기반 시스템",
            ],
            ["변성 테스트", "백투백 테스트", "A/B testing", "조합테스트"],
            ["휴리스틱 오라클", "확률적·비결정적", "imitation game"],
          ],
          en: "AI-based",
        },
      ],
      basis:
        "블랙박스 테스트 기법, 화이트박스 테스트 종류·비교, 코드 커버리지 종류, 경험 기반 주요 기법, 위험 기반 테스팅 영역, 뮤테이션 연산자, 퍼징 유형, 회귀 테스트 종류·검출 오류, Back to Back 절차, 테스트 오라클 유형, ISO 29119-11 블랙박스 기법",
    },
    {
      no: 6,
      title: "테스트 프로세스 맵 (단계 ↔ 기법·표준 ↔ 산출물)",
      sub: "테스트 계획부터 종료까지 단계별 활동과 적용 기법·표준, 산출물을 정리",
      rowHead: "프로세스 단계",
      cols: [
        { name: "주요 활동", tone: "blue" },
        { name: "기법·표준", tone: "amber" },
        { name: "산출물·기준", tone: "green" },
      ],
      rows: [
        {
          name: "테스트 계획",
          cells: [
            ["목표·범위 선정", "전략·일정·보고"],
            [
              { k: "Test Process", t: "Test Process" },
              { k: "ISO 29119", t: "ISO 29119" },
              "IEEE 829",
              "위험 기반 테스팅",
            ],
            ["테스트 계획서", "Test Entry Criteria"],
          ],
          en: "Planning",
        },
        {
          name: "테스트 설계",
          cells: [
            ["설계기법 정의", "케이스 도출", "원시 데이터 수집"],
            [
              "명세 기반 기법",
              "구조 기반 기법",
              "경험 기반 기법",
              { k: "Keyword Driven Testing", t: "Keyword Driven Testing" },
            ],
            ["테스트 케이스", "테스트 시나리오", "키워드 테스트 케이스"],
          ],
          en: "Design",
        },
        {
          name: "실행 및 측정",
          cells: [
            ["환경 구축", "케이스 실행"],
            [
              "실행엔진",
              "툴 브릿지",
              { k: "성능 테스트", t: "성능 테스트" },
              "Load Test",
              "Stress Test",
            ],
            ["응답시간", "시간당 처리량", "자원사용량"],
          ],
          en: "Execution",
        },
        {
          name: "결과 분석·보고",
          cells: [
            ["측정결과 분석", "결과 보고"],
            [{ k: "테스트 오라클", t: "테스트 오라클" }, "요약 보고", "PROOF"],
            ["테스트 결과서", "보고서 작성"],
          ],
          en: "Report",
        },
        {
          name: "오류 추적·종료",
          cells: [
            ["원인 분석", "오류 수정", "수정 후 검토"],
            [
              "디버깅 도구",
              { k: "회귀 테스트", t: "리그레이션(회귀, Regression) 테스트" },
            ],
            [
              { k: "Test Exit Criteria", t: "Test Exit Criteria" },
              "테스트 커버리지",
              "테스트 리스크",
              "Bugs의 100% 해결",
            ],
          ],
          en: "Exit",
        },
        {
          name: "정적 테스트",
          cells: [
            ["계획활동", "리뷰 미팅", "Re-Work", "Follow-Up"],
            [
              { k: "리뷰", t: "리뷰(Review)" },
              "워크쓰루",
              "인스펙션",
              "기술적 리뷰",
            ],
            ["상세의견록", "중재자", "종료 기준"],
          ],
          en: "Review",
        },
      ],
      all: {
        name: "테스트 원리",
        chips: [
          { k: "테스트 원리", t: "테스트 원리" },
          "결함 집중",
          "살충제 패러독스",
          "오류 부재의 궤변",
          "초기 시작",
          "정황 의존적",
        ],
      },
      basis:
        "Test Process 5단계(계케실결오), ISO 29119 프레임워크 구성요소, Keyword Driven Testing 구성·절차, 성능 테스트 프로세스·지표·유형, 탐색적 테스트 요약 보고, Test Exit Criteria 완료 조건, 리뷰 Process·형식·참여자, SW 테스트 원리",
    },
    {
      no: 7,
      title: "SW 품질·안전 보증 맵 (품질 대상 ↔ 분석 기법 ↔ 인증·지표)",
      sub: "제품·프로세스·안전·공급망 품질을 관점별로 표준·분석 기법과 인증·지표로 정리",
      rowHead: "품질 대상",
      cols: [
        { name: "품질 관점·위협", tone: "red" },
        { name: "표준·분석 기법", tone: "amber" },
        { name: "인증·지표", tone: "green" },
      ],
      rows: [
        {
          name: "제품 품질",
          cells: [
            ["기능적합성", "성능효율성", "보안성", "안전성"],
            [
              { k: "ISO/IEC 25010", t: "ISO/IEC 25010:2023" },
              "ISO/IEC 25023",
              "ISO/IEC 25051",
            ],
            [
              { k: "GS 인증", t: "GS 인증" },
              { k: "BMT", t: "상용소프트웨어 품질성능 평가 시험" },
              "품질 시험 및 평가",
            ],
          ],
          en: "Product",
        },
        {
          name: "사용 품질",
          cells: [
            ["상호작용 능력", "학습 용이성"],
            [{ k: "사용성 평가", t: "사용성 평가" }, "평가 테스트", "SUS설문"],
            ["오류율", "성공/실패 비율", "만족도"],
          ],
          en: "Usability",
        },
        {
          name: "프로세스 품질",
          cells: [
            ["품질·비용·납기", "지속적 개선"],
            [
              { k: "CMMI 3.0", t: "CMMI 3.0" },
              "Category Area",
              "Capability Area",
              "Practices",
            ],
            [{ k: "SP 인증", t: "SP 인증" }, "성숙도 레벨", "품질보증"],
          ],
          en: "Process",
        },
        {
          name: "고장 원인",
          cells: [
            ["Top-down", "연역적 추론"],
            [
              { k: "FTA", t: "FTA (Fault Tree Analysis)" },
              { k: "ETA", t: "ETA (Event Tree Analysis)" },
              "Event Tree",
            ],
            ["기본사상", "AND 게이트", "발생확률"],
          ],
          en: "Deductive",
        },
        {
          name: "고장 영향",
          cells: [
            ["Bottom-up", "귀납적 추론"],
            [
              { k: "FMEA", t: "FMEA (Failure Mode and Effects Analysis)" },
              "설계 FMEA",
              "공정 FMEA",
            ],
            ["RPN", "심각도·발생도·검출도"],
          ],
          en: "Inductive",
        },
        {
          name: "이탈·상호작용",
          cells: [
            ["탐색적 추론", "요소간 상호작용"],
            [
              { k: "HAZOP", t: "HAZOP (Hazard and Operability Study)" },
              { k: "STPA", t: "STPA (System-Theoretic Process Analysis)" },
              "STAMP",
            ],
            ["가이드워드", "공정변수", "Unsafe Control Action"],
          ],
          en: "Exploratory",
        },
        {
          name: "공급망·오픈소스",
          cells: [
            ["Zero Day 공격", "타이포스쿼팅", "Log4j"],
            [
              { k: "오픈소스 SW 보안위협", t: "오픈소스 SW 보안위협" },
              { k: "오픈소스 거버넌스", t: "오픈소스 거버넌스" },
              { k: "난독화", t: "난독화" },
            ],
            [{ k: "SBOM", t: "SBOM" }, "SPDX·CycloneDX", "Hash값"],
          ],
          en: "Supply Chain",
        },
      ],
      all: {
        name: "SW 안전 확보",
        chips: [
          { k: "소프트웨어 안전 확보", t: "소프트웨어 안전 확보를 위한 지침" },
          "위험원",
          "SW 위험원 분석",
          "SW 안전점검",
          "장애관리",
        ],
      },
      basis:
        "ISO/IEC 25010:2023 품질 특성, GS 인증 품질 평가 모델, 상용SW 품질성능 평가 시험, 사용성 평가 항목, CMMI 3.0 구성 요소·성숙도, SP 인증 기준·등급, FTA·FMEA·HAZOP 비교, ETA 위험관계 분석 기법, STPA 절차, 오픈소스 보안 위협·거버넌스, 난독화 분류, SBOM 기술 요소, SW 안전 확보 지침 조항",
    },
    {
      no: 8,
      title: "공공 SW 사업 생명주기 맵 (사업 단계 ↔ 산정·평가 ↔ 감리·관리)",
      sub: "공공 정보화 사업 기획부터 운영·정비까지 제도·산정 기법·점검 항목을 정리",
      rowHead: "사업 단계",
      cols: [
        { name: "제도·근거", tone: "blue" },
        { name: "산정·평가 기법", tone: "amber" },
        { name: "산출·점검 항목", tone: "teal" },
      ],
      rows: [
        {
          name: "기획·예산",
          cells: [
            [
              { k: "예비타당성", t: "공공기관 정보화사업 예비타당성" },
              "국가재정법",
              { k: "소프트웨어사업 영향평가", t: "소프트웨어사업 영향평가" },
            ],
            [
              { k: "SW 사업대가", t: "SW 사업대가 ('25년 개정판)" },
              "ISP/BPR",
              "EA/ITA",
              "컨설팅 업무량 방식",
            ],
            ["민간 시장 위축 방지", "사업 우선순위", "예산낭비 최소화"],
          ],
          en: "Planning",
        },
        {
          name: "발주·계약",
          cells: [
            [
              { k: "상용SW 직접구매", t: "상용 소프트웨어 직접구매 제도" },
              "소프트웨어 진흥법 제54조",
            ],
            [
              { k: "SW 규모산정", t: "SW 규모산정" },
              "델파이 방식",
              "COCOMO",
              "LOC 기법",
            ],
            [
              { k: "BMT", t: "상용소프트웨어 품질성능 평가 시험" },
              "GS·CC 인증",
              "별도 발주",
            ],
          ],
          en: "Procurement",
        },
        {
          name: "규모·대가 산정",
          cells: [
            ["기능점수 방식", "정통법·간이법"],
            [
              { k: "Function Point", t: "Function Point" },
              "ILF·EIF",
              "EI·EO·EQ",
              "조정인자",
            ],
            ["보정 후 개발원가", "직접경비", "이윤"],
          ],
          en: "Sizing",
        },
        {
          name: "구축 감리",
          cells: [
            [
              {
                k: "감리 의무 대상",
                t: "정보시스템 감리 의무 대상과 관점별 점검 기준",
              },
              "5억 원 이상",
              "대국민 행정민원",
            ],
            [
              { k: "공통감리 절차", t: "공통감리 절차" },
              "예비조사",
              "현장감리",
              "조치 확인",
            ],
            [
              {
                k: "감리결과보고서",
                t: "정보시스템 감리결과보고서 (구성, 보고사항)",
              },
              "감리계획서",
              "필수·협의·권고",
              "성과·산출물·절차",
            ],
          ],
          en: "Audit",
        },
        {
          name: "신기술 사업 감리",
          cells: [
            [
              {
                k: "클라우드 감리",
                t: "지능정보기술 감리 실무 가이드 - 클라우드 감리",
              },
              {
                k: "빅데이터 감리",
                t: "지능정보기술 감리 실무 가이드 - 빅데이터 감리",
              },
            ],
            ["클라우드 전환사업", "데이터 표준화"],
            ["클라우드 서비스 제공자 위험", "데이터 분석모델 설계"],
          ],
          en: "Cloud·BigData",
        },
        {
          name: "운영·유지보수",
          cells: [
            [
              { k: "ISO/IEC/IEEE 14764", t: "ISO/IEC/IEEE 14764" },
              { k: "운영/유지보수 감리", t: "정보시스템 운영/유지보수 감리" },
            ],
            [
              { k: "유지보수", t: "유지보수" },
              "수정적 유지보수",
              "적응적 유지보수",
              "예방적 유지보수",
            ],
            ["변경요청서", "릴리즈 및 배포관리", "장애관리"],
          ],
          en: "Maintenance",
        },
        {
          name: "진화·정비",
          cells: [
            [
              { k: "운영 성과관리", t: "정보시스템 운영 성과관리" },
              "전자정부법 제23조",
            ],
            [
              {
                k: "Lehman의 Software 변화의 원리",
                t: "Lehman의 Software 변화의 원리",
              },
              { k: "3R", t: "3R" },
              "역공학·재공학",
            ],
            ["운영의 적정성", "기능 활용도", "통폐합", "기능고도화"],
          ],
          en: "Evolution",
        },
      ],
      basis:
        "예비타당성 조사 기준, SW사업 영향평가 절차, SW 사업대가 기획·구현 단계 산정, 상용SW 직접구매 대상, 규모 산정 방법, Function Point 상세 내역·조정인자, 감리 의무 대상·관점별 점검 기준, 공통감리 절차(예현조), 감리결과보고서 구성, 클라우드·빅데이터 감리 점검단계, 운영/유지보수 감리 점검 분야, 유지보수 유형·ISO 14764, 운영 성과관리 지표·정비 방식, Lehman 원리, 3R",
    },
  ],
  PM: [
    {
      no: 1,
      title: "지식영역별 관리 맵 (이탈 ↔ 계획·통제)",
      sub: "지식영역마다 생기는 이탈과 계획·통제 기법, 판단 지표를 정리",
      rowHead: "지식영역",
      cols: [
        { name: "주요 문제·이탈", tone: "red" },
        { name: "계획·산정 기법", tone: "blue" },
        { name: "감시·통제 기법", tone: "amber" },
        { name: "지표·산출물", tone: "green" },
      ],
      rows: [
        {
          name: "통합",
          en: "Integration",
          cells: [
            ["지속적인 요구사항 변경", "비현실적 일정 및 예산"],
            [
              { k: "경제성 분석", t: "경제성 분석 기법" },
              { k: "관리 계획서", t: "프로젝트 관리 계획서" },
              "Tailoring",
            ],
            [
              "통합 변경관리",
              { k: "형상 통제", t: "형상 관리" },
              "변경 요청 심사",
            ],
            ["NPV·IRR", "BCR", "투자회수기간"],
          ],
        },
        {
          name: "범위",
          en: "Scope",
          cells: [
            [
              { k: "Scope Creep", t: "Scope Creep vs Gold-Plating" },
              "Gold Plating",
              "요구사항 미확인",
            ],
            [
              { k: "요구사항 수집기법", t: "요구사항 수집기법" },
              { k: "SRS", t: "요구사항 명세서 SRS" },
              { k: "WBS", t: "WBS (Work Breakdown Structure)" },
            ],
            [{ k: "범위관리", t: "범위관리" }, "범위 확인", "범위 통제"],
            ["범위 기술서", "WBS Dictionary", "Work Package"],
          ],
        },
        {
          name: "일정",
          en: "Schedule",
          cells: [
            ["일정지연", "SV<0", "재작업 위험 증가"],
            [
              { k: "활동기간 산정기법", t: "활동기간 산정기법" },
              { k: "3점 산정", t: "3점 산정" },
              { k: "CPM", t: "CPM (Critical Path Management)" },
              { k: "CCM", t: "CCM (Critical Chain Management)" },
            ],
            [
              { k: "일정단축 기법", t: "일정단축 기법" },
              "Crashing",
              "Fast Tracking",
              "버퍼 소진율",
            ],
            ["SPI", "Total Float", "Critical Path", "프로젝트 버퍼"],
          ],
        },
        {
          name: "원가",
          en: "Cost",
          cells: [
            ["비용초과", "예산 조기 소모", "CV<0"],
            ["모수 산정", "유사 산정", "상향식 산정"],
            [
              { k: "EVM", t: "EVM(Earned Value Management, 획득 가치 관리)" },
              "Cost Control",
            ],
            ["CPI", "EAC·ETC", "TCPI", "BAC"],
          ],
        },
        {
          name: "품질",
          en: "Quality",
          cells: [
            ["부적합 품질비용", "과도 품질 양산", "결함"],
            [
              { k: "SW 품질비용", t: "SW 품질비용" },
              "예방비용·평가비용",
              "품질활동 계획",
            ],
            [
              { k: "QC 7", t: "품질통제도구, QC 7" },
              "관리도",
              "파레토 차트",
              "특성요인도",
              { k: "형상 감사", t: "형상 관리" },
            ],
            ["내부실패비용·외부실패비용", "기능적 기준선", "제품 기준선"],
          ],
        },
        {
          name: "자원",
          en: "Resource",
          cells: [
            ["인력부족", "자원 불균형", "확보 경쟁"],
            [{ k: "RACI", t: "RACI 매트릭스" }, "RAM", "작업 패키지별 담당자"],
            [
              { k: "자원 최적화", t: "자원 최적화" },
              "자원 평준화",
              "자원 평활화",
            ],
            ["자원 버퍼", "법정 근무시간", "자원 최대한계"],
          ],
        },
        {
          name: "위험",
          en: "Risk",
          cells: [
            ["보헴의 10대 위험 요소", "불확실성"],
            [
              { k: "위험관리", t: "프로젝트 위험관리" },
              { k: "정성적 위험 분석", t: "정성적 위험 분석" },
              { k: "정량적 위험 분석", t: "정량적 위험 분석" },
            ],
            [
              { k: "위험 대응", t: "위험 대응" },
              { k: "몬테카를로", t: "몬테카를로 시뮬레이션" },
              "위험 감시 및 통제",
            ],
            ["P-I Matrix", "EMV", "RBS"],
          ],
        },
      ],
      all: {
        name: "관리 체계 (전 영역)",
        chips: [
          { k: "감리", t: "감리/PMO 비교표" },
          { k: "PMO", t: "감리/PMO 비교표" },
          {
            k: "PMBOK 7판",
            t: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)",
          },
          { k: "형상 관리", t: "형상 관리" },
          "시정조치확인보고서",
        ],
      },
      basis:
        "범위관리 세부 프로세스 표, Scope Creep·Gold Plating 비교표, 활동기간 산정기법·3점 산정 표, CPM 절차·CCM 버퍼 표, Crashing·Fast Tracking 비교, EVM 획득가치·차이·추세 분석 표와 통제 방안, 품질 비용·QC 7 표, 형상관리 절차·기준선 표, RACI 구성 요소, 자원 평준화·평활화 비교, 위험관리 절차·보헴 10대 위험, 경제성 분석 기법 표, 감리/PMO 비교표",
    },
    {
      no: 2,
      title: "위험관리 프로세스 맵 (절차 ↔ 기법 ↔ 대응)",
      sub: "위험관리 절차마다 쓰는 기법·도구와 나오는 결과·대응 수단을 연결",
      rowHead: "위험관리 절차",
      cols: [
        { name: "목적·활동", tone: "slate" },
        { name: "기법·도구", tone: "amber" },
        { name: "결과·대응 수단", tone: "blue" },
      ],
      rows: [
        {
          name: "위험관리계획수립",
          en: "Plan",
          cells: [
            ["기준·활동 정의", "계획 수립"],
            [
              { k: "위험관리 절차", t: "프로젝트 위험관리" },
              "위험 유형 분류",
              "전문가 판단",
            ],
            ["RBS", "위험 워크샵"],
          ],
        },
        {
          name: "위험식별",
          en: "Identify",
          cells: [
            ["영향 위험 식별", "특성 문서화"],
            ["인터뷰", { k: "보헴의 10대 위험 요소", t: "프로젝트 위험관리" }],
            [
              "관리적 위험",
              "기술적 위험",
              "인력부족",
              "지속적인 요구사항 변경",
            ],
          ],
        },
        {
          name: "정성적 위험 분석",
          en: "Qualitative",
          cells: [
            ["확률·영향 평가", "우선순위 결정"],
            [
              { k: "정성적 위험 분석", t: "정성적 위험 분석" },
              "위험 데이터 품질 평가",
              "기타 위험 모수 평가",
              "촉진",
            ],
            ["P-I Matrix", "계층적인 차트", "버블차트"],
          ],
        },
        {
          name: "정량적 위험 분석",
          en: "Quantitative",
          cells: [
            ["수치적 분석", "불확실성 표현"],
            [
              { k: "정량적 위험 분석", t: "정량적 위험 분석" },
              "민감도 분석",
              "의사결정 분석",
              { k: "몬테카를로", t: "몬테카를로 시뮬레이션" },
            ],
            ["토네이도 다이어그램", "EMV", "신뢰구간", "평균·표준편차"],
          ],
        },
        {
          name: "부정적 위험 대응",
          en: "Threat",
          cells: [
            ["부정 위험 최소화", "PM 권한 밖 사항"],
            [
              { k: "위험 대응", t: "위험 대응" },
              "회피·전가",
              "완화·수용",
              "에스컬레이션",
            ],
            ["보험 활용", "이행 보증", "범위 축소", "우발사태 예비"],
          ],
        },
        {
          name: "긍정적 위험 대응",
          en: "Opportunity",
          cells: [
            ["긍정 위험 증대", "기회 실현"],
            ["활용·공유", "증대·수용", "에스컬레이션"],
            ["합작 투자", "성과급", "자원 보충"],
          ],
        },
        {
          name: "위험 감시 및 통제",
          en: "Monitor",
          cells: [
            ["효율성 평가", "Risk 사전 조치"],
            [
              { k: "EVM", t: "EVM(Earned Value Management, 획득 가치 관리)" },
              { k: "버퍼 소진율", t: "CCM (Critical Chain Management)" },
              "이슈관리",
            ],
            [{ k: "Crashing·Fast Tracking", t: "일정단축 기법" }, "PMO조직"],
          ],
        },
      ],
      all: {
        name: "PMBOK 7판 연계",
        chips: [
          {
            k: "불확실성 및 모호성 탐색",
            t: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)",
          },
          "위험 (Risk)",
          "적응성과 복원력",
          "비용 효율적",
        ],
      },
      basis:
        "프로젝트 위험관리 절차 상세 설명·보헴의 10대 위험 요소 표, 정성적·정량적 위험 분석 기법 표, 몬테카를로 시뮬레이션 절차, 부정적(EATMA)·긍정적(EESEA) 위험 대응 표, EVM 통제 방안 표, CCM 버퍼 분류, PMBOK 7판 성과영역·12원칙 표",
    },
    {
      no: 3,
      title: "성과영역별 방법론 맵 (전통 ↔ 애자일)",
      sub: "PMBOK 7판 성과 영역마다 전통 기법과 애자일·린 실천을 대응",
      rowHead: "성과 영역",
      cols: [
        { name: "PMBOK 7판 기법", tone: "violet" },
        { name: "전통(계획 주도) 기법", tone: "blue" },
        { name: "애자일·린 실천", tone: "green" },
      ],
      rows: [
        {
          name: "이해관계자",
          en: "Stakeholder",
          cells: [
            ["이해관계자 식별", "의사소통 및 참여"],
            [
              { k: "요구사항 수집기법", t: "요구사항 수집기법" },
              "포커스 그룹",
              { k: "RACI", t: "RACI 매트릭스" },
            ],
            ["고객과의 협력", "On-Site Customer", "Product Owner"],
          ],
        },
        {
          name: "팀",
          en: "Team",
          cells: [
            [{ k: "갈등관리", t: "갈등관리" }, "팀 관리", "리더쉽"],
            [
              { k: "터크만 팀 개발", t: "터크만 팀 개발 5단계" },
              { k: "동기부여 이론", t: "동기부여 이론" },
              "허즈버그 2요인",
              "Problem Solving",
            ],
            [
              "자기 조직적 팀",
              "Scrum Master",
              "팀에 권한 위임",
              "페어 프로그래밍",
            ],
          ],
        },
        {
          name: "개발방식 및 생애주기",
          en: "Life Cycle",
          cells: [
            ["Tailoring", "개발 방법론 조정"],
            ["SDLC", "형상관리 기준선"],
            [
              { k: "Agile 선언문", t: "Agile 선언문과 12개 원칙" },
              { k: "스크럼", t: "스크럼 (SCRUM)" },
              { k: "XP", t: "XP (eXtreme Programming)" },
              { k: "린", t: "린 (Lean) 방법론" },
            ],
          ],
        },
        {
          name: "기획·성과",
          en: "Planning",
          cells: [
            ["프로젝트 관리 계획 및 검토", "프로젝트 실행", "자원 관리"],
            [
              { k: "관리 계획서", t: "프로젝트 관리 계획서" },
              { k: "WBS", t: "WBS (Work Breakdown Structure)" },
              { k: "CPM", t: "CPM (Critical Path Management)" },
            ],
            [
              "Product Backlog",
              "Sprint Planning Meeting",
              "Planning Game",
              "User Story",
            ],
          ],
        },
        {
          name: "인도",
          en: "Delivery",
          cells: [
            ["통합 변경관리", "CI/CD"],
            [{ k: "형상 관리", t: "형상 관리" }, "인수 조건", "범위 확인"],
            ["Small Release", "지속적 통합", "출시 가능 증분", "MVP"],
          ],
        },
        {
          name: "측정",
          en: "Measurement",
          cells: [
            ["비용성과지수", "일정성과지수"],
            [
              { k: "EVM", t: "EVM(Earned Value Management, 획득 가치 관리)" },
              "SPI·CPI",
              { k: "QC 7", t: "품질통제도구, QC 7" },
            ],
            [
              { k: "번다운차트", t: "번다운차트 (Burn Down Chart)" },
              "스토리포인트",
              "Daily Scrum Meeting",
            ],
          ],
        },
        {
          name: "불확실성 및 모호성",
          en: "Uncertainty",
          cells: [
            ["위험관리", "이슈관리"],
            [
              { k: "정량적 위험 분석", t: "정량적 위험 분석" },
              { k: "위험 대응", t: "위험 대응" },
              { k: "3점 산정", t: "3점 산정" },
            ],
            ["스파이크", "짧은 피드백", "Sprint Retrospective", "늦은 결정"],
          ],
        },
      ],
      all: {
        name: "프로젝트 관리 12원칙",
        chips: [
          {
            k: "PMBOK 7판",
            t: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)",
          },
          "스튜어드쉽",
          "가치",
          "시스템 사고",
          "품질",
          "적응성과 복원력",
        ],
      },
      basis:
        "PMBOK 7판 8개 성과 영역·12원칙 표, 요구사항 수집기법 표, RACI 구성 요소, 동기부여 이론·터크만 단계·갈등 해결방안 표, Agile 4대 가치·12원칙, 스크럼 프로세스·구성 요소, XP 핵심 가치·12가지 실천 항목·프로세스 단계, 린 원칙과 낭비요소·방법론 유형, 번다운 차트와 EVM 비교표",
    },
  ],
  AI: [
    {
      no: 1,
      title: "학습 유형별 맵 (데이터 ↔ 알고리즘 ↔ 평가)",
      sub: "학습 데이터·원리마다 대표 알고리즘, 핵심 기법, 평가·한계를 한 줄로 이음",
      rowHead: "학습 유형",
      cols: [
        { name: "데이터·원리", tone: "sky" },
        { name: "대표 알고리즘", tone: "amber" },
        { name: "핵심 기법", tone: "blue" },
        { name: "평가·한계", tone: "rose" },
      ],
      rows: [
        {
          name: "지도 학습",
          cells: [
            ["정답 있는 데이터", "분류", "회귀"],
            [
              { k: "SVM", t: "서포트 벡터 머신 SVM(Support Vector Machine)" },
              { k: "K-NN", t: "K-NN(Nearest Neighbor) Classification" },
              "Decision tree",
              { k: "앙상블", t: "앙상블 학습(Ensemble Learning)" },
            ],
            [
              { k: "손실함수", t: "손실함수(Loss Function)" },
              { k: "오류 역전파", t: "오류 역전파(Backpropagation)" },
              { k: "옵티마이저", t: "머신러닝 옵티마이저(Optimizer)" },
            ],
            [
              { k: "혼동행렬", t: "혼동행렬(Confusion Matrix)" },
              { k: "클래스 불균형", t: "클래스 불균형(Class Imbalance)" },
              "과적합",
            ],
          ],
          en: "Supervised",
        },
        {
          name: "비지도 학습",
          cells: [
            [
              "정답 없는 집합",
              "군집화",
              { k: "차원 축소", t: "차원 축소(Dimensionality Reduction)" },
            ],
            [
              { k: "K-평균", t: "K-평균 알고리즘" },
              { k: "DBSCAN", t: "밀도기반 클러스터링(DBSCAN)" },
              { k: "PCA", t: "PCA(Principal Component Analysis)" },
              "SOM",
            ],
            [
              { k: "거리 공식", t: "거리 공식(Distance Formula)" },
              { k: "유사도", t: "유사도(Similarity)" },
              "공분산",
            ],
            ["실루엣 계수", "Elbow Method", "Dunn Index"],
          ],
          en: "Unsupervised",
        },
        {
          name: "준지도 학습",
          cells: [
            ["지도+비지도", "무라벨 자율학습"],
            ["Self·Co-training", "Label Propagation", "그래프생성모형"],
            [
              { k: "데이터 라벨링", t: "데이터라벨링과 어노테이션" },
              { k: "GAN", t: "GAN(Generative Adversarial Network)" },
            ],
            ["라벨링 부담 완화", "Unlabeled Data"],
          ],
          en: "Semi-supervised",
        },
        {
          name: "강화 학습",
          cells: [
            ["환경과 상호작용", "보상 최대 정책"],
            ["Q-Learning", "DQN", "PPO", "MDP"],
            ["Value Function", "Monte Carlo", "RLHF"],
            [
              { k: "MAS", t: "MAS(Multi Agent System)" },
              "강화학습(RL) 기반 로봇",
            ],
          ],
          en: "Reinforcement",
        },
        {
          name: "자기지도 학습",
          cells: [
            [
              {
                k: "자기지도학습",
                t: "자기지도학습(Self-supervised Learning)",
              },
              "프리텍스트 태스크",
              "다운스트림 태스크",
            ],
            ["SimCLR", "MoCo", "오토인코더"],
            ["대조학습", "파인튜닝 단계"],
            [
              { k: "파운데이션 모델", t: "파운데이션 모델(Foundation Model)" },
              "소량 레이블 데이터",
            ],
          ],
          en: "Self-supervised",
        },
        {
          name: "전이 학습",
          cells: [
            [
              { k: "전이학습", t: "전이학습(Transfer Learning)" },
              "과업(Task) 전이",
              "도메인(Domain) 전이",
            ],
            ["Fine-tuned CNN", "Pre-trained Model", "Domain Adaptation"],
            [
              { k: "파인 튜닝", t: "파인 튜닝(Fine-tuning)" },
              "동결(Freeze)",
              "Layer Re-use",
            ],
            ["Multi-task Learning", "Self-taught Learning"],
          ],
          en: "Transfer",
        },
        {
          name: "분산·망각 학습",
          cells: [
            [
              { k: "연합학습", t: "연합학습(Federated Learning)" },
              { k: "머신 언러닝", t: "머신 언러닝(Machine Unlearning)" },
            ],
            ["FedSGD", "FedAVG", "SISA"],
            ["전역모델", "지역모델", "Impair & Repair"],
            ["잊혀질 권리", "망각 품질", "개인정보 보호"],
          ],
          en: "Federated · Unlearning",
        },
      ],
      all: {
        name: "공통 · 학습 자동화",
        chips: [
          { k: "머신러닝 학습방법", t: "머신러닝 학습방법" },
          { k: "AutoML", t: "AutoML" },
          "하이퍼 파라미터 최적화",
          "신경망 구조 탐색",
        ],
      },
      basis:
        "머신러닝 학습방법 「학습방법 유형」 표, 자기지도학습 「유형」·「학습단계」, 전이학습 「학습방법 유형」, 연합학습 「알고리즘」, 머신 언러닝 「기술 요소와 평가」, K-평균 「성능평가 방법」, AutoML 「프로세스」",
    },
    {
      no: 2,
      title: "딥러닝 학습 문제 맵 (원인 ↔ 해결)",
      sub: "신경망 학습에서 생기는 문제마다 원인, 해결 기법, 효과·지표를 정리",
      rowHead: "학습 문제",
      cols: [
        { name: "원인·현상", tone: "red" },
        { name: "해결 기법", tone: "amber" },
        { name: "효과·지표", tone: "green" },
      ],
      rows: [
        {
          name: "기울기 소실·폭주",
          cells: [
            [
              { k: "기울기 소실·폭주", t: "기울기 소실과 기울기 폭주" },
              "시그모이드(Sigmoid)",
              "가중치 폭주",
            ],
            [
              { k: "활성화함수", t: "활성화함수(Activation Function)" },
              "Leaky ReLU",
              "Gradient Clipping",
              "Xavier",
              { k: "배치 정규화", t: "배치 정규화(Batch Normalization)" },
            ],
            ["기울기 소실 방지", "Learning Rate 상승"],
          ],
          en: "Vanishing · Exploding",
        },
        {
          name: "과적합",
          cells: [
            ["과적합", "co-adaption", "학습 데이터 특화"],
            [
              { k: "Dropout", t: "Dropout" },
              "DropConnect",
              { k: "규제화", t: "정규화, 규제화, 표준화" },
              "L1(Lasso)",
              "L2(Ridge)",
            ],
            ["앙상블 효과", "동조현상 회피", "Voting 효과"],
          ],
          en: "Overfitting",
        },
        {
          name: "스케일 차이",
          cells: [
            ["피처 스케일", "이상치"],
            ["정규화·표준화", "Min-Max 스케일링", "Z-score 스케일링"],
            ["학습 속도 향상", "평균 0·분산 1"],
          ],
          en: "Feature Scale",
        },
        {
          name: "오차·가중치 갱신",
          cells: [
            ["오차 계산", "지역 최소점", "오버슈팅"],
            [
              { k: "손실함수", t: "손실함수(Loss Function)" },
              { k: "오류 역전파", t: "오류 역전파(Backpropagation)" },
              { k: "옵티마이저", t: "머신러닝 옵티마이저(Optimizer)" },
              "Adam",
              "Momentum",
            ],
            ["Chain Rule", "Delta Rule", "경사하강법"],
          ],
          en: "Optimization",
        },
        {
          name: "모델 크기·자원 제약",
          cells: [
            ["하드웨어 한계", "모델 성능 제한"],
            [
              { k: "지식 증류", t: "지식 증류(Knowledge Distillation)" },
              "양자화",
              "프루닝",
              "저랭크 분해",
            ],
            [
              { k: "온디바이스 AI", t: "온디바이스 AI" },
              "Student Model",
              "TinyML 모델",
            ],
          ],
          en: "Model Compression",
        },
        {
          name: "라벨·데이터 부족",
          cells: [
            ["데이터 부족", "라벨링 부담"],
            [
              { k: "라벨링·어노테이션", t: "데이터라벨링과 어노테이션" },
              { k: "합성 데이터", t: "합성 데이터(Synthetic Data)" },
              { k: "전이학습", t: "전이학습(Transfer Learning)" },
              {
                k: "자기지도학습",
                t: "자기지도학습(Self-supervised Learning)",
              },
            ],
            ["바운딩박스", "폴리곤", "텍스트 전사"],
          ],
          en: "Data Scarcity",
        },
        {
          name: "클래스 불균형",
          cells: [
            [
              { k: "클래스 불균형", t: "클래스 불균형(Class Imbalance)" },
              "재현율",
              "정확도",
            ],
            ["SMOTE", "ADASYN", "Tomek Links", "임곗값 이동"],
            ["F1 Score", "G-Mean", "PR AUC"],
          ],
          en: "Class Imbalance",
        },
      ],
      all: {
        name: "학습 하이퍼파라미터",
        chips: ["에포크", "러닝레이트", "dropout rate", "mini-batch"],
      },
      basis:
        "기울기 소실과 기울기 폭주 「발생원인」·「해결방안」, 활성화함수 「문제점」, Dropout 「동작원리」·「효과」, 정규화·규제화·표준화 「비교」, 옵티마이저 「유형」, 지식 증류 「구성요소 및 동작절차」, 온디바이스 AI 「성능 최적화」, 클래스 불균형 「해결방법」·「모델 성능 지표 선택」",
    },
    {
      no: 3,
      title: "머신러닝 알고리즘 맵 (원리 ↔ 절차 ↔ 척도)",
      sub: "분류·군집·차원 축소·앙상블·진화 계열의 원리, 구성·절차, 척도·평가",
      rowHead: "알고리즘 계열",
      cols: [
        { name: "핵심 원리", tone: "blue" },
        { name: "구성·절차", tone: "amber" },
        { name: "척도·평가", tone: "green" },
      ],
      rows: [
        {
          name: "분류 · 마진",
          cells: [
            [
              { k: "SVM", t: "서포트 벡터 머신 SVM(Support Vector Machine)" },
              "최대 마진 초평면",
            ],
            ["Support Vector", "Margin", "커널기법(Kernel trick)"],
            ["하드마진", "소프트마진", "차원의 저주 회피"],
          ],
          en: "SVM",
        },
        {
          name: "분류 · 이웃",
          cells: [
            [
              { k: "K-NN", t: "K-NN(Nearest Neighbor) Classification" },
              "다수결 결정",
              "거리기반",
            ],
            ["숫자 K값 설정", "거리 측정방법 설정", "K개의 최근접 이웃 탐색"],
            [
              { k: "거리 공식", t: "거리 공식(Distance Formula)" },
              "맨하탄 거리",
              "민코프스키 거리",
              { k: "유사도", t: "유사도(Similarity)" },
              "자카드 인덱스",
            ],
          ],
          en: "K-NN",
        },
        {
          name: "군집 · 거리",
          cells: [
            [{ k: "K-평균", t: "K-평균 알고리즘" }, "Clustering"],
            ["Cluster K개 지정", "초기 평균값 선정", "평균값 재조정"],
            ["실루엣 계수", "Elbow Method", "Dunn Index"],
          ],
          en: "K-Means",
        },
        {
          name: "군집 · 밀도",
          cells: [
            [{ k: "DBSCAN", t: "밀도기반 클러스터링(DBSCAN)" }, "밀도"],
            ["Core Point", "Border Point", "Noise Point"],
            ["Epsilon", "minPts"],
          ],
          en: "DBSCAN",
        },
        {
          name: "차원 축소",
          cells: [
            [
              { k: "차원 축소", t: "차원 축소(Dimensionality Reduction)" },
              "차원의 저주",
              "공분산",
            ],
            [
              { k: "PCA", t: "PCA(Principal Component Analysis)" },
              { k: "LDA", t: "LDA(Linear Discriminant Analysis)" },
              { k: "SVD", t: "SVD(Singular Value Decomposition)" },
              "ISOMAP",
              "AutoEncoder",
            ],
            ["Eigen Value", "특이값", "산포행렬"],
          ],
          en: "Dimensionality Reduction",
        },
        {
          name: "앙상블",
          cells: [
            [
              { k: "앙상블 학습", t: "앙상블 학습(Ensemble Learning)" },
              "결합",
              "과적합",
            ],
            [
              "보팅(Voting)",
              "배깅(Bagging)",
              "부스팅(Boosting)",
              "스태킹(Stacking)",
            ],
            ["부트스트랩", "메타 학습기"],
          ],
          en: "Ensemble",
        },
        {
          name: "진화 · 최적화",
          cells: [
            [
              { k: "유전 알고리즘", t: "유전 알고리즘(Genetic Algorithm)" },
              "최적화 알고리즘",
            ],
            [
              "선택(Selection)",
              "교차(Crossover)",
              "변이(Mutation)",
              "대체(Replace)",
            ],
            ["룰렛 휠", "토너먼트", "균등 교차"],
          ],
          en: "Genetic",
        },
      ],
      all: {
        name: "평가 공통",
        chips: [
          { k: "혼동행렬", t: "혼동행렬(Confusion Matrix)" },
          "ROC",
          "AUC",
          "F1 Score",
        ],
      },
      basis:
        "SVM 「구성요소」, K-NN 「동작과정」·「거리」, 거리 공식 표, 유사도 「유사도 측정법」, K-평균 「수행절차」·「성능평가 방법」, DBSCAN 「구성요소」·「동작방식」, 차원 축소 「유형」, PCA·LDA·SVD 비교표, 앙상블 「4대 기법」, 유전 알고리즘 「절차」·「기법」",
    },
    {
      no: 4,
      title: "생성·파운데이션 모델 맵 (구조 ↔ 기법 ↔ 활용)",
      sub: "생성 모델과 파운데이션·멀티모달·피지컬 AI의 구조, 핵심 기법, 활용과 한계",
      rowHead: "모델 계열",
      cols: [
        { name: "핵심 구조", tone: "violet" },
        { name: "핵심 기법", tone: "amber" },
        { name: "활용", tone: "green" },
        { name: "한계·비교", tone: "red" },
      ],
      rows: [
        {
          name: "GAN",
          cells: [
            [
              { k: "GAN", t: "GAN(Generative Adversarial Network)" },
              "Generator",
              "Discriminator",
            ],
            ["Min-Max 학습", "Nash균형", "DCGAN"],
            ["SRGAN", "사이클 GAN", { k: "딥페이크", t: "딥페이크(Deepfake)" }],
            ["모드붕괴", "모드진동"],
          ],
          en: "Adversarial",
        },
        {
          name: "VAE",
          cells: [
            [
              { k: "VAE", t: "VAE(Variational Autoencoder)" },
              "인코더(Encoder)",
              "디코더(Decoder)",
              "Latent Space",
            ],
            ["변분추론", "Sample Latent"],
            [
              "데이터 생성",
              { k: "합성 데이터", t: "합성 데이터(Synthetic Data)" },
            ],
            ["AE(Auto Encoder)", "가우시안 확률값"],
          ],
          en: "Variational",
        },
        {
          name: "Diffusion",
          cells: [
            [{ k: "Diffusion 모델", t: "Diffusion 모델" }, "U-Net", "CLIP"],
            ["순방향 디퓨전", "역방향 디퓨전", "가우시안 노이즈"],
            ["텍스트 to 이미지", "latent diffusion model"],
            [
              { k: "생성물 워터마크", t: "인공지능 생성물 워터마크 적용 기술" },
              "Stable Signature",
            ],
          ],
          en: "Diffusion",
        },
        {
          name: "파운데이션 모델",
          cells: [
            [
              { k: "파운데이션 모델", t: "파운데이션 모델(Foundation Model)" },
              "창발성",
              "균일화",
            ],
            ["자기지도학습", "트랜스포머 아키텍처", "FMOps"],
            [
              { k: "버티컬 AI", t: "버티컬 AI(Vertical AI)" },
              {
                k: "도메인 특화 언어 모델",
                t: "도메인 특화 언어 모델(Domain-Specific Language Model)",
              },
            ],
            [
              { k: "오픈웨이트 모델", t: "오픈웨이트(Open-weight) 모델" },
              "수평적 AI(Horizontal AI)",
            ],
          ],
          en: "Foundation",
        },
        {
          name: "경량·온디바이스",
          cells: [
            [{ k: "온디바이스 AI", t: "온디바이스 AI" }, "sLLM", "NPU"],
            ["모델 경량화", "양자화", "프루닝"],
            ["TensorFlow Lite", "MobileNet 계열", "TinyML 모델"],
            ["모델 성능 제한", "업데이트 복잡성"],
          ],
          en: "On-device",
        },
        {
          name: "멀티모달",
          cells: [
            [
              { k: "멀티모달", t: "멀티모달(Multimodal) AI" },
              { k: "VLM", t: "VLM(Vision Language Model)" },
              { k: "옴니모달 AI", t: "옴니모달(Omni-modal) AI" },
            ],
            [
              "Cross Attention",
              "PrefixLM",
              "Contrastive Learning",
              "Shared Latent Space",
            ],
            [
              "이미지 질의응답",
              "캡션 생성",
              { k: "정서 인공지능", t: "정서 인공지능(Affective AI)" },
            ],
            ["연산 복잡도 높음", "모달별 개별 처리"],
          ],
          en: "Multimodal",
        },
        {
          name: "피지컬 AI",
          cells: [
            [
              { k: "Physical AI", t: "Physical AI" },
              { k: "VLA", t: "VLA(Vision-Language-Action) 모델" },
              {
                k: "월드 파운데이션 모델",
                t: "월드 파운데이션 모델(World Foundation Model)",
              },
            ],
            ["LWM", "Tokenizer", "디지털 트윈", "Closed-loop Feedback"],
            [
              "자율주행차",
              "휴머노이드 로봇",
              { k: "BrainBody LLM", t: "BrainBody LLM" },
            ],
            ["방대한 연산량", "물리 감각 없음"],
          ],
          en: "Physical",
        },
      ],
      basis:
        "GAN 「생성방법」·「유형」·「문제점」, VAE 「구성요소」·「VAE와 AE 비교」, Diffusion 「기술요소」, 파운데이션 모델 「특징」·「기반기술」, 버티컬 AI 비교표, 온디바이스 AI 「한계점」·「기술 스택」, VLM 「비전, 언어 통합 기술」, 옴니모달 「동작 메커니즘」, Physical AI 「구성요소」, 월드 파운데이션 모델 「LLM과 비교」",
    },
    {
      no: 5,
      title: "LLM 성능 향상 맵 (한계 ↔ 기법 ↔ 도구)",
      sub: "언어 모델 구조부터 튜닝·프롬프트·검색·추론·서빙까지 한계와 대응 기법",
      rowHead: "향상 단계",
      cols: [
        { name: "해결할 한계", tone: "red" },
        { name: "핵심 기법", tone: "amber" },
        { name: "구성요소·도구", tone: "blue" },
      ],
      rows: [
        {
          name: "언어 모델 구조",
          cells: [
            ["긴 시퀀스", "단어 위치 문제해결"],
            [
              {
                k: "자연어처리",
                t: "자연어처리(NLP, Natural Language Processing)",
              },
              { k: "트랜스포머", t: "트랜스포머(Transformer)" },
              {
                k: "어텐션 메커니즘",
                t: "어텐션 메커니즘(Attention Mechanism)",
              },
            ],
            ["포지셔널 인코딩", "Query·Key·Value", "멀티 헤드 어텐션"],
          ],
          en: "Architecture",
        },
        {
          name: "사전학습 확장",
          cells: [
            ["컴퓨팅 파워", "연산량 급증"],
            [
              {
                k: "초거대 언어 모델",
                t: "초거대 언어 모델(Large Language Model)",
              },
              { k: "MoE", t: "MOE(Mixture of Experts)" },
              {
                k: "대형개념모델",
                t: "대형개념모델(LCM, Large Concept Models)",
              },
            ],
            ["GPU 자원", "Router", "Sparse Computation", "SONAR 임베딩"],
          ],
          en: "Pre-training",
        },
        {
          name: "튜닝",
          cells: [
            ["Fully Fine-Tuning", "GPU vram"],
            [
              { k: "파인 튜닝", t: "파인 튜닝(Fine-tuning)" },
              { k: "PEFT", t: "PEFT(Parameter-Efficient Fine-Tuning)" },
              { k: "LoRA", t: "LoRA(Low-rank adaptation)" },
              { k: "프롬프트 튜닝", t: "프롬프트 튜닝(Prompt Tuning)" },
            ],
            ["Adapter", "Prefix Tuning", "저랭크 행렬", "소프트 프롬프트"],
          ],
          en: "Fine-tuning",
        },
        {
          name: "프롬프트·컨텍스트",
          cells: [
            ["맥락이해 부족", "토큰 최적화"],
            [
              {
                k: "프롬프트 엔지니어링",
                t: "프롬프트 엔지니어링(Prompt Engineering)",
              },
              {
                k: "컨텍스트 엔지니어링",
                t: "컨텍스트 엔지니어링(Context Engineering)",
              },
              { k: "하네스 엔지니어링", t: "하네스 엔지니어링" },
            ],
            ["Few-Shot Prompting", "컨텍스트 압축", "가드레일"],
          ],
          en: "Prompt · Context",
        },
        {
          name: "외부 지식 검색",
          cells: [
            [
              { k: "할루시네이션", t: "할루시네이션(Hallucination)" },
              "지식단절",
            ],
            [
              {
                k: "RAG",
                t: "검색 증강 생성(RAG, Retrieval Augmented Generation)",
              },
              {
                k: "RIG",
                t: "검색 삽입 생성(RIG, Retrieval Interleaved Generation)",
              },
            ],
            ["Vector DB", "임베딩", "청크", "프롬프트 증강"],
          ],
          en: "Retrieval",
        },
        {
          name: "추론 강화",
          cells: [
            ["직관적 오류 취약", "System 2(느린 사고)"],
            [
              { k: "CoT", t: "COT(Chain of Thought)" },
              {
                k: "테스트 타임 컴퓨팅",
                t: "테스트 타임 컴퓨팅(Test-Time Compute)",
              },
              {
                k: "테스트 타임 스케일링",
                t: "테스트 타임 스케일링(Test-Time Scaling, TTS)",
              },
              {
                k: "LLM 성능 향상 기술",
                t: "대규모 언어 모델(LLM) 성능 향상 기술",
              },
            ],
            ["ToT", "Self-Consistency", "Best-of-N", "MCTS"],
          ],
          en: "Reasoning",
        },
        {
          name: "서빙·메모리",
          cells: [
            ["KV Cache 크기 증가", "단편화", "연속 할당"],
            [
              { k: "페이지드 어텐션", t: "페이지드 어텐션(Paged Attention)" },
              "양자화",
            ],
            ["Block Table", "Copy-on-Write", "Dynamic Allocation"],
          ],
          en: "Serving",
        },
      ],
      all: {
        name: "운영",
        chips: [
          { k: "LLMOps", t: "LLMOps" },
          "FMOps",
          "프롬프트 체이닝",
          "프롬프트 모니터링",
        ],
      },
      basis:
        "LLM 성능 향상 기술 「주요기법」·「Reasoning 기술 상세」, 트랜스포머 「구성요소」, 초거대 언어 모델 「기술요소」·「문제점 및 대응방안」, PEFT 「PEFT 기법」, LoRA 「원리」, RAG 「필요성」·「처리 단계」, 테스트 타임 컴퓨팅 「유형」, 페이지드 어텐션 「기존 방식의 한계점」·「구성요소」",
    },
    {
      no: 6,
      title: "AI 에이전트 계층 맵 (구성 ↔ 기술 ↔ 통제)",
      sub: "인식·추론에서 도구 연결·협업·개발 플랫폼까지 계층별 구성요소와 보안 통제",
      rowHead: "에이전트 계층",
      cols: [
        { name: "구성요소", tone: "blue" },
        { name: "핵심 기술·프로토콜", tone: "amber" },
        { name: "위협·통제", tone: "red" },
      ],
      rows: [
        {
          name: "인식·추론",
          cells: [
            [
              { k: "AI Agent", t: "AI Agent" },
              { k: "에이전틱 AI", t: "에이전틱 AI(Agentic AI)" },
              "Knowledge Base",
            ],
            ["LLM 기반 추론", "계층적 작업분해", "의도 분류"],
            ["Agent 오동작 유도", "데이터 플라이휠"],
          ],
          en: "Perceive · Reason",
        },
        {
          name: "행동·실행",
          cells: [
            [
              { k: "LAM", t: "LAM(Large Action Model)" },
              "Actuator",
              "목표 기반 에이전트",
            ],
            ["API 오케스트레이션", "원자적 액션 실행", "동적 계획 수립"],
            ["권한 탈취", "최소권한"],
          ],
          en: "Act",
        },
        {
          name: "도구·맥락 연결",
          cells: [
            [
              { k: "MCP", t: "MCP(Model Context Protocol)" },
              "MCP Host",
              "MCP Client",
              "MCP 서버",
            ],
            ["JSON-RPC", "Resources", "Tools", "Prompts"],
            [
              { k: "Tool Poisoning", t: "MCP 보안취약점 및 대응방안" },
              "Rug Pulls",
              "토큰 바인딩",
            ],
          ],
          en: "MCP",
        },
        {
          name: "에이전트 협업",
          cells: [
            [
              { k: "MAS", t: "MAS(Multi Agent System)" },
              { k: "A2A", t: "A2A(Agent2Agent) 프로토콜" },
              { k: "UCP와 ACP", t: "UCP와 ACP" },
            ],
            ["에이전트 카드", "Pub-Sub", "Crew AI"],
            ["Cross-Server Attacks", "서버 간 격리"],
          ],
          en: "Multi-Agent",
        },
        {
          name: "워크플로우",
          cells: [
            [
              { k: "랭체인", t: "랭체인(LangChain)" },
              { k: "LangGraph", t: "LangGraph" },
            ],
            ["Chains", "Memory", "노드", "엣지"],
            ["Callbacks", "로깅·모니터링"],
          ],
          en: "Framework",
        },
        {
          name: "하네스·제어",
          cells: [
            [{ k: "하네스 엔지니어링", t: "하네스 엔지니어링" }, "지침 파일"],
            ["가드레일", "피드백 루프", "CI/CD·린터"],
            ["제어(Control)", "감시(Monitoring)", "개선(Feedback)"],
          ],
          en: "Harness",
        },
        {
          name: "개발 플랫폼",
          cells: [
            [
              { k: "바이브코딩", t: "바이브코딩(Vibe Coding)" },
              {
                k: "AI 네이티브 개발 플랫폼",
                t: "AI 네이티브 개발 플랫폼(AI-Native Development Platform)",
              },
              "GitHub Copilot",
            ],
            ["AI Gateway", "Model Studio", "Cursor"],
            ["AI 의존성", "코드 최적화 문제"],
          ],
          en: "AI-Native Dev",
        },
      ],
      all: {
        name: "에이전트 보안 공통",
        chips: [
          { k: "AI 레드팀", t: "AI 레드팀(Red team) 테스트" },
          "HITL",
          "최소권한 승인",
          "감사로그",
        ],
      },
      basis:
        "AI Agent 「기술요소 및 유형」, 에이전틱 AI 「프로세스」, LAM 「핵심기술」, MCP 「개념도 구성요소」·「맥락」, MCP 보안취약점 「보안취약점」·「대응방안」, MAS 「활용분야」, A2A 「구성요소」, 랭체인 「구성요소」, LangGraph 「구성」, 하네스 엔지니어링 「구성 요소」·「역할」, AI 네이티브 개발 플랫폼 「구성요소」",
    },
    {
      no: 7,
      title: "AI 보안·신뢰 맵 (위협 ↔ 대응)",
      sub: "데이터·모델·입력·생성물·판단·운영·공급망 별 위협과 기술적·관리적 대응",
      rowHead: "보호 대상",
      cols: [
        { name: "주요 위협·공격", tone: "red" },
        { name: "기술적 대응", tone: "amber" },
        { name: "관리·검증", tone: "blue" },
      ],
      rows: [
        {
          name: "학습 데이터",
          cells: [
            ["Poisoning attack", { k: "편향", t: "편향" }, "숨겨진 편향"],
            [
              { k: "합성 데이터", t: "합성 데이터(Synthetic Data)" },
              "차등정보보호",
              { k: "머신 언러닝", t: "머신 언러닝(Machine Unlearning)" },
            ],
            ["데이터시트", "편향 신고 시스템"],
          ],
          en: "Data",
        },
        {
          name: "모델",
          cells: [
            [
              { k: "적대적 공격", t: "인공지능 적대적 공격" },
              "Evasion attack",
              "Inversion attack",
              "Model extraction",
            ],
            ["적대적 훈련", "Defense-GAN", "쿼리 횟수 제한"],
            [
              { k: "AI 레드팀", t: "AI 레드팀(Red team) 테스트" },
              "견고성 테스트",
            ],
          ],
          en: "Model",
        },
        {
          name: "프롬프트·입력",
          cells: [
            [
              { k: "프롬프트 인젝션", t: "프롬프트 인젝션(Prompt Injection)" },
              "탈옥",
              "간접(Indirect) 인젝션",
            ],
            ["입력 검증 및 필터링", "프롬프트 캡슐화", "권한 및 접근 제어"],
            ["감사로그", "실시간 모니터링", "RLHF"],
          ],
          en: "Prompt",
        },
        {
          name: "생성 콘텐츠",
          cells: [
            [
              { k: "딥페이크", t: "딥페이크(Deepfake)" },
              { k: "할루시네이션", t: "할루시네이션(Hallucination)" },
              "허위정보",
            ],
            [
              { k: "생성물 워터마크", t: "인공지능 생성물 워터마크 적용 기술" },
              "딥페이크 탐지",
              "RAG",
            ],
            [
              {
                k: "투명성 확보 가이드라인",
                t: "인공지능 투명성 확보 가이드라인",
              },
              "표시 의무",
            ],
          ],
          en: "Output",
        },
        {
          name: "판단 근거·공정성",
          cells: [
            ["블랙박스 모델", "고의적 편향", "데이터 편향"],
            [
              { k: "XAI", t: "XAI(eXplainable AI) 방법론" },
              "LIME",
              "SHAP",
              "LRP",
            ],
            [
              {
                k: "AI TRiSM",
                t: "AI TRiSM(AI Trust, Risk and Security Management)",
              },
              "MS Fairlearn",
            ],
          ],
          en: "Explainability",
        },
        {
          name: "운영 환경",
          cells: [
            [
              {
                k: "모델 드리프트",
                t: "모델 드리프트(Model Drift) — 컨셉 드리프트 & 데이터 드리프트",
              },
              "컨셉 드리프트",
              "데이터 드리프트",
            ],
            ["온라인 학습", "피처 드로핑", "재학습·재배포"],
            [{ k: "MLOps", t: "MLOps" }, "드리프트 감시"],
          ],
          en: "Drift",
        },
        {
          name: "AI 공급망",
          cells: [
            ["CVE 기반 취약점", "Rug Pulls", "무분별한 설치"],
            [
              {
                k: "AI BOM",
                t: "AI BOM(Artificial Intelligence Bill of Materials)",
              },
              "SBOM",
              "모델카드",
            ],
            ["CycloneDX", "SPDX", "NVD/CVE"],
          ],
          en: "Supply Chain",
        },
      ],
      all: {
        name: "위험관리 프레임워크",
        chips: [
          { k: "AI RMF", t: "AI RMF(AI Risk Management Framework)" },
          { k: "ISO/IEC 23894", t: "ISO/IEC 23894" },
          {
            k: "범용 인공지능 위험관리",
            t: "범용 인공지능 위험관리 프레임워크",
          },
          { k: "AI 신뢰성 인증", t: "AI 신뢰성 인증" },
        ],
      },
      basis:
        "인공지능 적대적 공격 「공격 기법」·「방어 기법」, 프롬프트 인젝션 「유형」·「공격 대응방안」, 딥페이크 「탐지기술」·「대응방안」, 편향 「유형」, XAI 방법론 「종류」, AI TRiSM 「구성요소」, 모델 드리프트 비교표, AI BOM 「구성 요소」·「SBOM과 AI BOM 비교」, AI RMF·ISO/IEC 23894 절차",
    },
    {
      no: 8,
      title: "AI 생명주기 맵 (활동 ↔ 기법 ↔ 표준)",
      sub: "AI 도입 기획부터 데이터·개발·평가·테스트·운영·규제까지 단계별 활동과 근거 표준",
      rowHead: "생명주기 단계",
      cols: [
        { name: "주요 활동", tone: "teal" },
        { name: "기법·도구", tone: "amber" },
        { name: "표준·가이드라인", tone: "violet" },
      ],
      rows: [
        {
          name: "기획·도입",
          cells: [
            [
              { k: "AX", t: "AX(AI Transformation)" },
              { k: "공공 AX 전략", t: "공공 AX 전략" },
              "AI 전략 수립",
            ],
            [
              {
                k: "AI 도입 사업비 산정",
                t: "인공지능(AI) 도입 사업비 산정 절차",
              },
              "파일럿 프로젝트",
              "AI Full Stack",
            ],
            [
              {
                k: "초거대AI 도입·활용 가이드라인",
                t: "공공부문 초거대AI 도입, 활용 가이드라인 2.0(2025.04)",
              },
              { k: "소버린 AI", t: "소버린 AI(Artificial Intelligence)" },
            ],
          ],
          en: "Plan",
        },
        {
          name: "데이터 준비",
          cells: [
            [
              { k: "AI Ready Data", t: "AI Ready Data" },
              "데이터 획득",
              "데이터 정제",
            ],
            [
              { k: "데이터 라벨링", t: "데이터라벨링과 어노테이션" },
              { k: "합성 데이터", t: "합성 데이터(Synthetic Data)" },
              "비식별화",
            ],
            [
              {
                k: "학습용 데이터 품질관리",
                t: "인공지능 학습용 데이터 품질관리 가이드라인 v3.1",
              },
              {
                k: "생성형AI 데이터 품질관리",
                t: "생성형AI 데이터 품질관리 가이드 v2.0",
              },
            ],
          ],
          en: "Data",
        },
        {
          name: "모델 개발",
          cells: [
            ["모델 학습", "하이퍼 파라미터 최적화"],
            [
              { k: "AutoML", t: "AutoML" },
              {
                k: "AI 슈퍼컴퓨팅 플랫폼",
                t: "AI 슈퍼컴퓨팅 플랫폼(Supercomputing Platform)",
              },
              { k: "오픈웨이트 모델", t: "오픈웨이트(Open-weight) 모델" },
            ],
            [
              {
                k: "인공지능 경영시스템",
                t: "인공지능 경영시스템(ISO 42001:2023)",
              },
              "ISO/IEC 23053",
            ],
          ],
          en: "Build",
        },
        {
          name: "평가·벤치마크",
          cells: [
            ["모델 평가", { k: "MLPerf", t: "MLPerf" }],
            [
              { k: "혼동행렬", t: "혼동행렬(Confusion Matrix)" },
              {
                k: "멀티모달 데이터의 품질검증",
                t: "멀티모달 데이터의 품질검증 방법",
              },
              "FID",
              "BLEU",
            ],
            [
              { k: "ISO/IEC 25059", t: "ISO/IEC 25059:2023(AI 품질모델)" },
              "기능 적합성",
              "강건성",
            ],
          ],
          en: "Evaluate",
        },
        {
          name: "테스트·검증",
          cells: [
            [
              { k: "AI 시스템 테스트", t: "AI 시스템 테스트" },
              { k: "튜링 테스트", t: "튜링 테스트" },
              "변성 테스팅",
            ],
            ["뉴런 커버리지", "백투백 테스트", "A/B testing"],
            [
              { k: "ISO 29119-11", t: "ISO 29119-11" },
              { k: "ISO/IEC 42119-2", t: "ISO/IEC 42119-2" },
              { k: "AI 레드팀", t: "AI 레드팀(Red team) 테스트" },
            ],
          ],
          en: "Test",
        },
        {
          name: "배포·운영",
          cells: [
            [
              { k: "MLOps", t: "MLOps" },
              { k: "LLMOps", t: "LLMOps" },
              "모델 배포",
            ],
            ["CI/CD", "Feature Store", "프롬프트 모니터링"],
            ["ML 파이프라인 자동화", "CI/CD 파이프라인 자동화"],
          ],
          en: "Operate",
        },
        {
          name: "규제·이용자 보호",
          cells: [
            [
              { k: "AI 기본법", t: "AI 기본법" },
              {
                k: "고영향 인공지능 판단",
                t: "고영향 인공지능(AI) 판단 가이드라인",
              },
              { k: "인공지능 영향평가", t: "인공지능 영향평가 가이드라인" },
            ],
            ["사전 고지 의무", "기본권 매핑", "STPA·FMEA"],
            [
              {
                k: "생성형 AI 서비스 이용자 보호",
                t: "생성형 AI 서비스 이용자 보호 가이드라인(2025.02.28)",
              },
              {
                k: "이용자 보호 가이드라인",
                t: "생성형 인공지능 서비스 이용자 보호 가이드라인",
              },
              {
                k: "투명성 확보 가이드라인",
                t: "인공지능 투명성 확보 가이드라인",
              },
            ],
          ],
          en: "Regulate",
        },
      ],
      all: {
        name: "AI 신뢰성 (전 단계)",
        chips: [
          { k: "AI 신뢰성 인증", t: "AI 신뢰성 인증" },
          "안전성",
          "설명가능성",
          "투명성",
          "견고성",
          "공평성",
        ],
      },
      basis:
        "AX 「절차」, 공공 AX 전략 「도입 방법론(7D)」, AI 도입 사업비 산정 「상세절차」, AI Ready Data 「데이터 관련 용어」, 학습용 데이터 품질관리 가이드라인 v3.1 「품질관리 프로세스」, MLOps 「파이프라인」·「단계」, AI 시스템 테스트·ISO 29119-11 블랙박스 테스트기법, 인공지능 영향평가 「수행 절차」, AI 신뢰성 인증 「핵심 속성」",
    },
  ],
  ST: [
    {
      no: 1,
      title: "확률분포 계보 맵 (분포 ↔ 통계량 ↔ 검정)",
      sub: "분포마다 특징·관련 정리와 쓰이는 검정·분석을 잇는다",
      rowHead: "확률분포",
      cols: [
        { name: "특징·조건", tone: "slate" },
        { name: "관련 정리·통계량", tone: "violet" },
        { name: "검정·분석 활용", tone: "green" },
      ],
      rows: [
        {
          name: "이산확률분포",
          en: "베르누이·이항·포아송",
          cells: [
            [
              { k: "확률분포", t: "확률분포" },
              "셀 수 있는 값",
              "각 시행 독립",
              "독립성·비례성·비집락성",
            ],
            [
              { k: "확률질량함수", t: "확률분포와 확률 밀도 함수" },
              "기대치·분산",
              "기댓값·분산 λ 동일",
            ],
            ["베르누이 분포", "이항 분포", "포아송 분포", "정규분포 유사"],
          ],
        },
        {
          name: "정규분포",
          en: "Normal · Z",
          cells: [
            [
              { k: "정규분포", t: "정규분포(Normal Distribution)" },
              "종모양",
              "평균=중앙값=최빈값",
              "경험규칙",
            ],
            [
              { k: "중심극한정리", t: "중심극한정리" },
              { k: "확률밀도함수", t: "확률분포와 확률 밀도 함수" },
              "표준오차",
              "Z값",
            ],
            [
              "Z검정",
              { k: "3시그마", t: "이상치(Outlier)" },
              "잔차 정규성",
              "정규성 검정",
            ],
          ],
        },
        {
          name: "T-분포",
          en: "Student t",
          cells: [
            ["T-분포", "모집단 표준편차 모를 때", "평균 검정"],
            ["t 통계량", "자유도", "표본평균"],
            [
              "독립표본 t-검정",
              "대응표본 t-검정",
              { k: "추론 통계", t: "추론 통계(Inferential Statistics)" },
            ],
          ],
        },
        {
          name: "카이제곱 분포",
          en: "χ²",
          cells: [
            ["카이제곱 분포", "표본분산", "독립 표준정규 변수 제곱합"],
            ["χ² 통계량", "관측빈도·기대빈도", "자유도"],
            [
              {
                k: "교차분석",
                t: "연관성 분석(association analysis) - 기초통계",
              },
              "적합도·독립성",
              "동질성 검정",
            ],
          ],
        },
        {
          name: "F-분포",
          en: "F",
          cells: [
            ["F-분포", "두 χ² 값의 비율", "분산 검정"],
            ["F 통계량", "분산비", "F 검정량"],
            [
              { k: "ANOVA", t: "ANOVA(Analysis of variance)" },
              "F검정",
              "One Way ANOVA",
              "Two Way ANOVA",
            ],
          ],
        },
        {
          name: "연속확률분포 일반",
          en: "PDF",
          cells: [
            ["연속확률변수", "연속적인 값", "지수분포"],
            [
              { k: "확률밀도함수(PDF)", t: "확률분포와 확률 밀도 함수" },
              "확률변수 → 확률분포",
            ],
            ["시간 간격 모델링", "일반적 데이터 모델링"],
          ],
        },
      ],
      all: {
        name: "검정 공통 틀",
        chips: [
          { k: "가설검정", t: "통계적 가설검정(Hypothesis Testing)" },
          "검정통계량",
          "유의수준",
          "기각역",
          "임계치",
        ],
      },
      basis:
        "확률분포 유형·이산/연속확률분포 상세 표, 확률분포 개념도·확률밀도함수 개념도·관계 표, 정규분포 모양·확률적 특징 표, 중심극한정리 특징·수식 표, 추론통계 방법 표, 교차 분석 표, ANOVA F검정·유형 표, 가설검정 용어 표",
    },
    {
      no: 2,
      title: "통계 분석 단계 맵 (문제 ↔ 기법 ↔ 판단 지표)",
      sub: "자료 수집부터 모델링까지 단계별 문제·조건과 기법, 판단 지표를 정리",
      rowHead: "분석 단계",
      cols: [
        { name: "문제·조건", tone: "red" },
        { name: "기법·방법", tone: "blue" },
        { name: "판단 지표·결과", tone: "green" },
      ],
      rows: [
        {
          name: "자료 수집",
          en: "Data · Sampling",
          cells: [
            ["편향", "대표성", "모집단 정보 없음"],
            [
              { k: "데이터 유형", t: "데이터 유형" },
              { k: "표본 추출", t: "표본 추출(Sampling)" },
              "층화확률 추출",
              "계통 추출",
              "눈덩이 추출법",
            ],
            ["명목·순서·등간·비율", "확률 추출·비확률 추출", "횡단형·종단형"],
          ],
        },
        {
          name: "정제",
          en: "Cleansing",
          cells: [
            ["결과 왜곡", "분포 왜곡", "적정성 위협"],
            [
              { k: "이상치", t: "이상치(Outlier)" },
              { k: "결측치", t: "결측치(Missing Value)" },
              "다중 대체",
              "Winsorization",
              "행 삭제",
            ],
            ["IQR", "3시그마", "Likelihood", "완전 무작위 결측"],
          ],
        },
        {
          name: "기술·요약",
          en: "Descriptive",
          cells: [
            ["표본 특성 분석", "비대칭성", "치우친 정도"],
            [
              { k: "기술 통계", t: "기술 통계(Descriptive statistics)" },
              "히스토그램",
              "상자수염그림",
              "산점도",
            ],
            [
              { k: "왜도·첨도", t: "왜도(Skewness) & 첨도(Kurtosis)" },
              "중심경향값",
              "변산도",
            ],
          ],
        },
        {
          name: "추정",
          en: "Estimation",
          cells: [
            ["모집단 특성 추정", "불확실성 표현"],
            [
              { k: "추정 이론", t: "추정 이론(Estimation Theory)" },
              "점 추정",
              "구간 추정",
              "최대우도추정",
            ],
            [
              "신뢰 구간",
              "불편성·효율성",
              "일치성·충분성",
              { k: "표준오차", t: "중심극한정리" },
            ],
          ],
        },
        {
          name: "확률 갱신",
          en: "Bayesian",
          cells: [
            ["조건부 확률", "사전확률", "배반사건"],
            [
              { k: "베이즈 정리", t: "베이즈 정리(Bayes's theorem)" },
              "곱셈의 정리",
              "전확률의 법칙",
            ],
            ["사후확률", "우도"],
          ],
        },
        {
          name: "가설 검정",
          en: "Testing",
          cells: [
            ["귀무가설·대립가설", "제1종 오류", "제2종 오류"],
            [
              { k: "가설검정", t: "통계적 가설검정(Hypothesis Testing)" },
              { k: "추론 통계", t: "추론 통계(Inferential Statistics)" },
              { k: "ANOVA", t: "ANOVA(Analysis of variance)" },
              "비모수적 방법",
            ],
            ["p값", "유의수준", "기각역", "F 검정량"],
          ],
        },
        {
          name: "관계·예측 모델링",
          en: "Modeling",
          cells: [
            ["다중 공선성", "과적합", "정상성"],
            [
              { k: "회귀분석", t: "회귀분석(Regression Analysis)" },
              {
                k: "상관분석",
                t: "연관성 분석(association analysis) - 기초통계",
              },
              { k: "시계열분석", t: "시계열분석" },
              "ARIMA",
            ],
            [
              "결정계수 R²",
              {
                k: "AIC·BIC",
                t: "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)",
              },
              "상관계수",
              "잔차 분석",
            ],
          ],
        },
      ],
      basis:
        "데이터 유형(명순등비)·시간 자료 유형 표, 확률·비확률 추출 표, 이상치 검출·대체 표, 결측치 유형·제거 방법 표, 기술통계 요약·시각화 표, 왜도·첨도 표, 추정 방법·추정량 조건 표, 베이즈 정리 용어·수식 이론 표, 가설검정 절차·용어·오류 표, 추론통계 방법, ANOVA 조건, 회귀분석 가정·평가 진단, AIC/BIC 비교, 연관성 분석 유형, 시계열 모델 종류·정상성 표",
    },
  ],
  NW: [
    {
      no: 1,
      title: "계층별 프로토콜 맵 (문제 ↔ 해결)",
      sub: "OSI 계층마다 대표 프로토콜과 풀어야 할 문제, 해결 기법·절차를 정리",
      rowHead: "OSI 계층",
      cols: [
        { name: "대표 프로토콜", tone: "blue" },
        { name: "문제·한계", tone: "red" },
        { name: "해결 기법·절차", tone: "amber" },
      ],
      rows: [
        {
          name: "응용 (L7~L5)",
          en: "Application",
          cells: [
            [
              { k: "HTTP/3", t: "HTTP/3" },
              { k: "DNS", t: "DNS(Domain Name System)" },
              { k: "DHCP", t: "DHCP(Dynamic Host Configuration Protocol)" },
              "SMTP·FTP",
              "TLS·SSH",
            ],
            ["HOL 블로킹", "연결형 전송", "DHCP Starvation"],
            [
              "QUIC",
              "0-RTT",
              "Seamless Connection",
              "Recursive Query",
              "Load Distribution",
            ],
          ],
        },
        {
          name: "전송 (L4)",
          en: "Transport",
          cells: [
            [
              { k: "TCP·UDP", t: "TCP 와 UDP 비교" },
              { k: "SCTP", t: "SCTP(Stream Control Transmission Protocol)" },
              "RTP",
            ],
            ["순서 미유지", "중복·손실 가능", "Half-open Closing"],
            [
              {
                k: "3-way handshake",
                t: "TCP 연결의 설정 및 해제(Handshaking)",
              },
              "4-way handshake",
              "Multi Homing",
              "Multi Streaming",
              "SACK·HEARTBEAT",
            ],
          ],
        },
        {
          name: "네트워크 — 주소",
          en: "Network · IP",
          cells: [
            [
              { k: "IPv6", t: "IPv6" },
              { k: "ARP", t: "ARP(Address Resolution Protocol)" },
              { k: "RARP", t: "RARP(Reverse Address Resolution Protocol)" },
              "ICMP·IGMP",
            ],
            ["주소고갈", "MAC 미인지", "IP 미인지"],
            [
              { k: "터널링", t: "IPv4와 IPv6 터널링" },
              "듀얼 스택",
              "주소 변환",
              "128비트",
              "브로드캐스트·유니캐스트",
            ],
          ],
        },
        {
          name: "네트워크 — 경로",
          en: "Network · Routing",
          cells: [
            [
              {
                k: "라우팅 알고리즘",
                t: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)",
              },
              "RIP·OSPF",
              { k: "BGP", t: "BGP(Border Gateway Protocol)" },
              "EIGRP",
            ],
            ["토폴로지 변경", "AS 번호 상이", "인입 경로 다중"],
            [
              "거리벡터·링크상태",
              "벨만-포드·다익스트라",
              "SPF 트리",
              "Path Vector",
              "iBGP·eBGP",
            ],
          ],
        },
        {
          name: "데이터링크 (L2)",
          en: "Data Link",
          cells: [
            [
              "Ethernet",
              "PPP·HDLC",
              { k: "CSMA/CD", t: "CSMA/CD" },
              { k: "CSMA/CA", t: "CSMA/CA" },
            ],
            ["충돌", "채널 Busy"],
            ["Back-off", "Jamming Signal", "RTS·CTS", "IFS", "P-Persistent"],
          ],
        },
        {
          name: "물리 (L1)",
          en: "Physical",
          cells: [
            ["RS-232C", "광 섬유·동축케이블", "DSL"],
            ["잡음 오류", "수신 동기"],
            [
              {
                k: "라인 코딩",
                t: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)",
              },
              "bipolar·unipolar·polar",
              { k: "다중화", t: "다중화(Multiplexing)" },
            ],
          ],
        },
      ],
      all: {
        name: "계층 공통",
        chips: [
          { k: "OSI 7 Layer", t: "OSI 7 Layer (ISO 7498)" },
          { k: "서비스 프리미티브", t: "서비스 프리미티브(Service Primitive)" },
          "요청·지시·응답·확인",
          "캡슐화/역캡슐화",
          "PDU",
          "라우터·브리지",
        ],
      },
      basis:
        "OSI 7 Layer 계층별 역할과 프로토콜·데이터 단위와 장비 표, 서비스 프리미티브 종류 표, HTTP/3 특징 표, DHCP 할당 과정·DNS 동작 원리 표, TCP와 UDP 비교 표, 3-way/4-way handshake 표, SCTP 기술 요소 표, IPv4와 IPv6 터널링 유형 표, ARP와 RARP 비교 표, 라우팅 알고리즘 거리벡터·링크상태 표, BGP 기술 요소 표, CSMA/CD·CSMA/CA 동작 표, 전송부호화 라인 코딩 표",
    },
    {
      no: 2,
      title: "무선·이동통신 진화 맵 (기술 ↔ 표준 ↔ 서비스)",
      sub: "RAN 개방부터 6G·Wi-Fi 8까지 망 영역별 핵심 기술과 표준, 서비스를 연결",
      rowHead: "망 영역·세대",
      cols: [
        { name: "핵심 기술", tone: "amber" },
        { name: "표준·인터페이스", tone: "blue" },
        { name: "서비스·활용", tone: "green" },
      ],
      rows: [
        {
          name: "RAN 분리·개방",
          en: "Radio Access Network",
          cells: [
            [
              { k: "C-RAN", t: "C-RAN(Centralized / Cloud RAN)" },
              { k: "O-RAN", t: "O-RAN" },
              "DU와 RF 분리",
              "가상화",
              "RIC",
            ],
            ["CPRI·OBSAI·ORI", "Open Front Haul", "E2·F1", "O-CU·O-DU·O-RU"],
            ["간섭 조정", "협력 통신", "벤더 간 호환성"],
          ],
        },
        {
          name: "5G 코어·공유",
          en: "5G Core",
          cells: [
            [
              { k: "네트워크 슬라이싱", t: "네트워크 슬라이싱" },
              { k: "RAN Sharing", t: "RAN(Radio Access Network) Sharing" },
              "SDN·NFV",
              "MEC",
            ],
            ["MOCN·MORAN·GWCN", "UPF", "gNB", "4.7GHz·28GHz"],
            [
              { k: "5G 특화망", t: "5G 특화망" },
              "Massive IoT",
              "Mission critical",
              "On-Premise 형",
            ],
          ],
        },
        {
          name: "비지상 네트워크",
          en: "NTN",
          cells: [
            [
              { k: "NTN", t: "비지상네트워크(NTN, Non-Terrestrial Networks)" },
              "고고도 플랫폼(HAPS)",
              "드론(UAV)",
              "빔포밍·MIMO",
            ],
            [
              "3GPP",
              "GEO·LEO",
              "서비스 링크·피더 링크",
              "Transparent·Regenerative",
            ],
            ["넓은 지역 서비스", "이동 중 통신 지원", "저궤도 위성통신"],
          ],
        },
        {
          name: "지능형 네트워크",
          en: "Network Intelligence",
          cells: [
            [
              { k: "NWDAF", t: "NWDAF(Network Data Analytics Function)" },
              { k: "네트워크 지능", t: "네트워크 지능" },
              { k: "IBN", t: "인텐트 기반 네트워킹(Intent-Based Networking)" },
              {
                k: "디지털 트윈 네트워크",
                t: "디지털 트윈 네트워크(Digital Twin Network)",
              },
            ],
            ["AnLF·MTLF", "DCCF·ADRF·MFAF", "OAM·MANO", "Closed-loop control"],
            [
              "의도 번역",
              "LLM",
              "네트워크 오류 식별 및 예측",
              "지능형 SD-WAN 관리",
            ],
          ],
        },
        {
          name: "6G",
          en: "6th Generation",
          cells: [
            [
              { k: "6G", t: "6G" },
              { k: "ISAC", t: "ISAC(Integrated Sensing and Communication)" },
              "테라 헤르츠",
              "네이티브 AI",
              "RIS·XL-MIMO",
            ],
            ["1Tbps", "무선 지연 0.1ms", "100GHz 이상", "초성능·초정밀"],
            [
              { k: "Hyper-AI 네트워크", t: "Hyper-AI 네트워크" },
              "실시간 홀로그램",
              "초정밀 SLAM",
              "AI-RAN",
            ],
          ],
        },
        {
          name: "무선 LAN·IoT",
          en: "WLAN · IoT",
          cells: [
            [
              { k: "Wi-Fi 7", t: "Wi-Fi 7(IEEE 802.11be)" },
              { k: "Wi-Fi 8", t: "Wi-Fi 8(IEEE 802.11bn)" },
              { k: "Passive WiFi", t: "Passive WiFi" },
              "4096 QAM",
              "16x16 MIMO",
            ],
            ["IEEE 802.11be", "802.11bn", "Thread(802.15.4)", "EHT·UHR"],
            [
              { k: "IoT Matter", t: "IoT Matter" },
              "스마트홈",
              "후방산란",
              "초실감 미디어",
            ],
          ],
        },
      ],
      all: {
        name: "전 영역 공통",
        chips: ["SDN", "NFV", "MEC", "Network Slicing", "AI/ML"],
      },
      basis:
        "C-RAN 기술 요소 표, O-RAN 구성 요소·아키텍처 인터페이스 표, RAN Sharing 공유 방식 비교 표, 네트워크 슬라이싱 슬라이스 예시 표, 5G 특화망 구성·기술 요소·유형 표, NTN 구성요소 및 기술요소 표, NWDAF 표준 기능 표, 네트워크 지능 적용 기술·활용 분야 표, IBN 기술 요소 표, 6G 비전·지원 기술 표, ISAC 기술 요소 표, Hyper-AI 네트워크 추진방향 표, Wi-Fi 7·8 성능 스펙 표, IoT Matter 기술 요소 표, Passive WiFi 구성요소 표",
    },
    {
      no: 3,
      title: "트래픽 제어·품질 맵 (문제 ↔ 제어 기법 ↔ 지표)",
      sub: "혼잡·흐름·품질·경로·전달·정책 문제마다 제어 기법과 관리 지표를 정리",
      rowHead: "제어 대상",
      cols: [
        { name: "문제·원인", tone: "red" },
        { name: "제어 기법", tone: "amber" },
        { name: "지표·관리", tone: "blue" },
      ],
      rows: [
        {
          name: "혼잡",
          en: "Congestion",
          cells: [
            ["네트워크 용량 초과", "다수 패킷 손실", "Time out"],
            [
              { k: "TCP 혼잡제어", t: "TCP 혼잡제어" },
              "Slow Start",
              "Congestion Avoidance",
              "Fast Recovery",
              "Tahoe·Reno",
            ],
            ["CWND", "RTO", "RTT", "Partial ACK"],
          ],
        },
        {
          name: "흐름",
          en: "Flow",
          cells: [
            ["작은 패킷", "적합성 문제"],
            [
              {
                k: "Sliding Window",
                t: "Sliding Window & 네이글(Nagle's) 알고리즘",
              },
              {
                k: "네이글 알고리즘",
                t: "Sliding Window & 네이글(Nagle's) 알고리즘",
              },
              "Window 열림·닫힘·축소",
              "Stop and Wait",
            ],
            ["cwnd·rwnd", "MSS", "ACK"],
          ],
        },
        {
          name: "서비스 품질",
          en: "QoS",
          cells: [
            ["지연·지터", "패킷 손실"],
            [
              { k: "QoS", t: "QoS(Quality of Service)" },
              "IntServ·DiffServ",
              "RSVP",
              "Token Bucket",
              "WFQ",
              "RED·WRED",
            ],
            ["대역폭", "DSCP", "PHB"],
          ],
        },
        {
          name: "제어 구조",
          en: "SDN",
          cells: [
            ["SW HW 통합", "스위치 내 공존"],
            [
              { k: "SDN", t: "SDN(Software Defined Network)" },
              { k: "OpenFlow", t: "오픈플로우(OpenFlow)" },
              "Control Plane·Data Plane",
              "Flow Table",
            ],
            ["Open API", "Global View", "OSS·BSS"],
          ],
        },
        {
          name: "WAN 경로",
          en: "SD-WAN",
          cells: [
            ["저하 경로", "유실 대비"],
            [
              { k: "SD-WAN", t: "SD-WAN(Software Defined-Wide Area Network)" },
              "Dynamic Path Switching",
              "Packet Duplication",
              "Link Aggregation",
              "트래픽 스티어링",
            ],
            ["SD-WAN Controller", "SD-WAN Edge", "사용량·성능 보고"],
          ],
        },
        {
          name: "콘텐츠 전달",
          en: "CDN",
          cells: [
            ["서버 부하", "고장난 서버"],
            [
              { k: "CDN", t: "CDN(Contents Delivery Network)" },
              "Caching",
              "Load Balancing",
              "Request Routing",
              "Grid Delivery",
            ],
            ["POP", "IX", "CDN SP"],
          ],
        },
        {
          name: "망 정책",
          en: "Network Neutrality",
          cells: [
            ["불합리한 차별", "일방적 차단"],
            [
              { k: "망 중립성", t: "망 중립성(Network Neutrality)" },
              "합리적인 트래픽 관리",
              "차단금지",
            ],
            ["투명성", "망 중립성 가이드라인"],
          ],
        },
      ],
      basis:
        "TCP 혼잡제어 메커니즘 4단계·알고리즘 유형 표, Sliding Window 동작·네이글 알고리즘 동작 표, QoS 주요 지표·관리 기술·보장 기술 표, SDN 개념도·구성 요소 표, 오픈플로우 구성 요소 표, SD-WAN 기술 요소 표, CDN 구성 요소·기술 요소 표, 망 중립성 3대 원칙·기본 원칙 표",
    },
    {
      no: 4,
      title: "전송 신호 처리 맵 (문제 ↔ 기법 ↔ 활용)",
      sub: "송신에서 수신까지 신호 처리 단계별로 풀 문제와 부호화·변조·접근 기법을 정리",
      rowHead: "신호 처리 단계",
      cols: [
        { name: "문제·목표", tone: "red" },
        { name: "기법·방식", tone: "amber" },
        { name: "표준·활용", tone: "green" },
      ],
      rows: [
        {
          name: "소스 코딩",
          en: "Source Coding · A/D",
          cells: [
            ["중복정보", "앨리어싱", "A/D변환"],
            [
              { k: "PCM", t: "PCM(Pulse-Code Modulation)" },
              {
                k: "소스 코딩",
                t: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)",
              },
              "표본화·양자화·부호화",
              "나이퀴스트",
              "허프만·런렝스",
            ],
            ["JPEG·MPEG", "영상 부호화", "오디오 부호화"],
          ],
        },
        {
          name: "채널 코딩 — 정정",
          en: "FEC",
          cells: [
            ["잡음 오류", "랜덤·연집(Burst) 오류"],
            [
              {
                k: "FEC",
                t: "FEC(Forward Error Correction) / BEC(Backward Error Correction)",
              },
              { k: "해밍코드", t: "해밍코드(Hamming code)" },
              "RS 코드",
              "길쌈 코드·터보 코드",
            ],
            ["블록 코드", "하이브리드 ARQ", "짝수 패리티"],
          ],
        },
        {
          name: "오류 검출·재전송",
          en: "BEC · ARQ",
          cells: [
            ["집단 오류", "오류(NACK) 프레임"],
            [
              { k: "CRC", t: "CRC(Cyclic Redundancy Check)" },
              {
                k: "BEC",
                t: "FEC(Forward Error Correction) / BEC(Backward Error Correction)",
              },
              "Parity Check·Check Sum",
              "Go-Back-N",
              "Selective-Repeat",
            ],
            ["CRC-8", "Divisor", "Adaptive ARQ"],
          ],
        },
        {
          name: "라인 코딩·변조",
          en: "Line Coding · Modulation",
          cells: [
            ["수신 동기", "신호 상태 나쁨"],
            [
              {
                k: "라인 코딩",
                t: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)",
              },
              { k: "QAM", t: "QAM(Quadrature Amplitude Modulation)" },
              "진폭 변조·위상 변조",
              "16QAM·64QAM",
            ],
            ["DVB-T", "4096 QAM", "QPSK"],
          ],
        },
        {
          name: "다중화·다원접속",
          en: "Multiplexing",
          cells: [
            ["전송매체 효율", "자원 공동 이용"],
            [
              { k: "다중화", t: "다중화(Multiplexing)" },
              "FDM·TDM·CDM",
              "WDM·SDM",
              "FDMA·TDMA·CDMA",
            ],
            ["OFDMA", "광섬유 한 가닥"],
          ],
        },
        {
          name: "매체 접근",
          en: "MAC",
          cells: [
            ["충돌", "채널 Busy"],
            [
              { k: "CSMA/CD", t: "CSMA/CD" },
              { k: "CSMA/CA", t: "CSMA/CA" },
              "Back-off",
              "Contention Window",
            ],
            ["무선랜", "1-Persistent", "Non-Persistent"],
          ],
        },
        {
          name: "RF·무선 전력",
          en: "Radio · Power",
          cells: [
            ["RF 전력 소모", "금속 영향"],
            [
              { k: "SDR", t: "SDR(Software Defined Radio)" },
              { k: "Passive WiFi", t: "Passive WiFi" },
              "후방산란",
              { k: "무선 충전", t: "무선 충전 기술" },
              "자기유도·자기공명",
            ],
            ["SW 다운로드", "Digital IF", "WPC·A4WP"],
          ],
        },
      ],
      basis:
        "전송부호화 소스·채널·라인 코딩 표, PCM 동작 원리·나이퀴스트 표, FEC/BEC 분류·기법 표, 해밍코드 절차 표, CRC 처리 과정 표, QAM 성상도·계층적 변조 표, 다중화 종류·다중화 vs 다원접속 표, CSMA/CD Persistent 방식·CSMA/CA IFS 표, SDR 기술 요소 표, Passive WiFi 구성도, 무선 충전 기술 방식 비교 표",
    },
  ],
  AL: [
    {
      no: 1,
      title: "설계 기법별 알고리즘 맵 (원리 ↔ 알고리즘 ↔ 한계)",
      sub: "설계 기법마다 전제 원리, 대표 알고리즘, 수행 절차, 복잡도·한계를 엮어 정리",
      rowHead: "설계 기법",
      cols: [
        { name: "원리 · 전제", tone: "blue" },
        { name: "대표 알고리즘", tone: "amber" },
        { name: "수행 절차 · 핵심 연산", tone: "teal" },
        { name: "복잡도 · 한계", tone: "red" },
      ],
      rows: [
        {
          name: "분할 정복",
          en: "Divide and Conquer",
          cells: [
            ["분할과 정복", "재귀적 수행", "비교 정렬"],
            [
              { k: "퀵 정렬", t: "퀵 정렬(Quick Sort)" },
              { k: "병합 정렬", t: "병합 정렬(Merge Sort)" },
              "이진탐색",
            ],
            ["Pivot", "Low·High", "반으로 나눔", "병합"],
            ["O(N log N)", "최악의 경우 O(n²)", "O(log N)"],
          ],
        },
        {
          name: "동적 계획법",
          en: "Dynamic Programming",
          cells: [
            [
              "최적성 원리",
              "점화/재귀식",
              "부분 반복 문제",
              "관계식 도출 가능",
            ],
            [
              { k: "동적 계획법", t: "동적 계획법(Dynamic Programming)" },
              "Top Down",
              "Bottom Up",
            ],
            ["Memoization", "타뷸레이션", "최종 최적해 도출"],
            ["O(2ⁿ)", "테이블 저장", "cache 누적"],
          ],
        },
        {
          name: "탐욕 기법",
          en: "Greedy",
          cells: [
            ["순간 최적의 해", "부분 최적화", "제약조건"],
            [
              { k: "그리디", t: "그리디(탐욕) 알고리즘" },
              {
                k: "프림(Prim)",
                t: "최소 신장 트리(MST, Minimum Spanning Tree)",
              },
              {
                k: "크루스칼(Kruscal)",
                t: "최소 신장 트리(MST, Minimum Spanning Tree)",
              },
              { k: "허프만(Huffman) 코딩", t: "허프만(Huffman) 코딩" },
            ],
            ["해 선택", "적합성 검증", "해 검증"],
            ["최적해 미도출", "800원·400원 동전"],
          ],
        },
        {
          name: "빔 탐색",
          en: "Beam Search",
          cells: [
            ["K개 후보군", "Beam size", "확률 기반 Score"],
            [
              { k: "빔 탐색", t: "빔 탐색(Beam Search)" },
              "Seq2Seq 디코딩",
              "자연어 처리",
            ],
            ["최초 K개 해 선택", "부분 해 확장", "나머지 후보 삭제"],
            ["최적해 미보장", "확률 점수 최고"],
          ],
        },
        {
          name: "전체 순회",
          en: "Traversal",
          cells: [
            ["한번씩 방문", "체계적으로 방문", "백트래킹"],
            [
              { k: "DFS", t: "그래프 순회(Graph Traversal)" },
              { k: "BFS", t: "그래프 순회(Graph Traversal)" },
              { k: "트리 순회", t: "트리 순회(Tree Traversal)" },
            ],
            ["큐 이용 구현", "스택·백트래킹", "전위·중위·후위"],
            ["깊은 그래프 느림", "넓은 그래프 느림"],
          ],
        },
      ],
      all: {
        name: "성능 평가 (전 기법)",
        chips: [
          { k: "알고리즘 성능평가", t: "알고리즘 성능평가" },
          { k: "빅오 표기법", t: "빅오 표기법(O-Notation)" },
          "시간복잡도·공간복잡도",
          "점근적 성능표기법",
        ],
      },
      basis:
        "퀵 정렬 동작 원리·수행 절차, 병합 정렬 수행 절차, 동적 계획법 전제 조건·접근방법 표, 그리디 수행 절차 [해적검]·최적해 미도출 사례, 빔 탐색 수행절차·활용 사례, 그래프 순회 BFS·DFS 비교, 트리 순회 유형 표",
    },
    {
      no: 2,
      title: "문제 영역별 알고리즘 맵 (문제 ↔ 해법 ↔ 활용)",
      sub: "정렬·탐색·그래프·압축·텍스트 문제마다 해법과 핵심 원리, 성능·활용을 연결",
      rowHead: "문제 영역",
      cols: [
        { name: "해결할 문제", tone: "red" },
        { name: "대표 알고리즘", tone: "amber" },
        { name: "핵심 원리 · 기법", tone: "blue" },
        { name: "성능 · 활용", tone: "green" },
      ],
      rows: [
        {
          name: "정렬",
          en: "Sorting",
          cells: [
            ["오름차순 정렬", "비교 정렬", "완전 정렬"],
            [
              { k: "퀵 정렬", t: "퀵 정렬(Quick Sort)" },
              { k: "병합 정렬", t: "병합 정렬(Merge Sort)" },
              { k: "삽입 정렬", t: "삽입 정렬(Insertion Sort)" },
              { k: "버블 정렬", t: "버블 정렬(Bubble Sort)" },
            ],
            ["Pivot", "분할과 정복", "자신 위치 찾아 삽입", "인접 원소 비교"],
            ["O(N log N)", "O(n²)", "위치 교환 방식"],
          ],
        },
        {
          name: "탐색 · 해싱",
          en: "Search · Hashing",
          cells: [
            ["직접 접근", "충돌", "오버 플로우", "동거자"],
            [
              { k: "해시 테이블", t: "해시 테이블" },
              { k: "해싱", t: "해싱과 충돌해결방법" },
              "이진탐색",
              { k: "이진 탐색 트리", t: "이진 탐색 트리(Binary Search Tree)" },
            ],
            ["나눗셈법", "폴딩법", "선형 조사법", "해시 체이닝", "버킷·슬롯"],
            [
              "O(1)",
              "직접파일",
              { k: "해시 기반 인덱스", t: "RDBMS 인덱스(index)" },
            ],
          ],
        },
        {
          name: "최단 경로",
          en: "Shortest Path",
          cells: [
            ["음수가 아닌 가중치", "모든 정점까지 최단 경로"],
            [
              { k: "다익스트라", t: "다익스트라(Dijkstra) 알고리즘" },
              "Finding the Shortest Path",
            ],
            ["무한대(∞) 설정", "인접 정점 탐색", "방문한 노드 집합"],
            ["O(N³)", "가중치 최저"],
          ],
        },
        {
          name: "최소 신장 트리",
          en: "MST",
          cells: [
            ["가중치 합 최소", "비순환", "간선 가중치 최소"],
            [
              {
                k: "프림(Prim)",
                t: "최소 신장 트리(MST, Minimum Spanning Tree)",
              },
              {
                k: "크루스칼(Kruscal)",
                t: "최소 신장 트리(MST, Minimum Spanning Tree)",
              },
            ],
            ["단계적 확장", "오름차순 정렬", "사이클 시 제외"],
            ["신장트리", "n-1개 간선"],
          ],
        },
        {
          name: "트리 · 그래프 순회",
          en: "Traversal",
          cells: [
            ["모든 노드 한 번씩", "정점 집합 V"],
            [
              { k: "트리 순회", t: "트리 순회(Tree Traversal)" },
              { k: "그래프 순회", t: "그래프 순회(Graph Traversal)" },
              {
                k: "위상 정렬",
                t: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
              },
            ],
            ["전위·중위·후위", "큐 이용 구현", "스택·백트래킹"],
            ["전위 표기·중위 표기", "넓은 그래프 유리", "깊은 그래프 유리"],
          ],
        },
        {
          name: "부호화 · 압축",
          en: "Coding",
          cells: [
            ["무손실 압축", "빈도", "같은 값 연속"],
            [
              { k: "허프만(Huffman) 코딩", t: "허프만(Huffman) 코딩" },
              { k: "런랭스(Run Length) 코딩", t: "런랭스(Run Length) 코딩" },
            ],
            ["짧은 부호", "통계적 기법", "엔트로피", "RUN·LENGTH"],
            ["DEFLATE", "JPEG·MP3", "압축률"],
          ],
        },
        {
          name: "텍스트 가중치",
          en: "Text Weighting",
          cells: [
            ["단어빈도", "불용어 처리"],
            [
              {
                k: "TF-IDF",
                t: "TF-IDF(Term Frequency - Inverse Document Frequency)",
              },
              "DTM 작성",
            ],
            ["TF×IDF", "역문서빈도", "통계적 수치"],
            ["코사인 거리", "내적", "NORM"],
          ],
        },
      ],
      basis:
        "정렬 4종 정의·수행 절차, 해시 테이블 구성 요소 표, 해싱 기법 [나폴리는 중세기다]·충돌 해결방법 [선이중무 체코] 표, 다익스트라 수행 과정, MST 프림·크루스칼 표, 트리·그래프 순회 표, DAG 위상 정렬, 허프만 활용 사례, 런랭스 예제, TF-IDF 산출 절차, RDBMS 인덱스 유형 표(DB)",
    },
    {
      no: 3,
      title: "복잡도 등급 맵 (유형 ↔ 알고리즘 ↔ 자료구조)",
      sub: "빅오 유형별 연산시간 순서를 행으로 두고 해당 알고리즘·자료구조 연산을 대응",
      rowHead: "시간 복잡도",
      cols: [
        { name: "유형 · 동작", tone: "slate" },
        { name: "대표 알고리즘", tone: "amber" },
        { name: "자료구조 · 연산", tone: "teal" },
      ],
      rows: [
        {
          name: "O(1)",
          en: "상수형",
          cells: [
            ["상수형", "입력 크기 무관"],
            ["해시 함수", { k: "해시 테이블", t: "해시 테이블" }],
            [
              { k: "push·pop", t: "Stack" },
              { k: "Enqueue·Dequeue", t: "Queue" },
              "직접 접근",
            ],
          ],
        },
        {
          name: "O(log N)",
          en: "로그형",
          cells: [
            ["로그형", "나눠 하나만 처리"],
            [
              "이진탐색",
              { k: "이진 탐색 트리", t: "이진 탐색 트리(Binary Search Tree)" },
            ],
            [
              { k: "B-Tree", t: "B-Tree(Balanced Tree)" },
              { k: "AVL 트리", t: "AVL 트리" },
              "트리 높이 감소",
            ],
          ],
        },
        {
          name: "O(N)",
          en: "선형",
          cells: [
            ["선형", "하나씩 모두 처리"],
            ["단순탐색", { k: "트리 순회", t: "트리 순회(Tree Traversal)" }],
            [{ k: "Linked List", t: "링크드 리스트(Linked List)" }, "Array"],
          ],
        },
        {
          name: "O(N log N)",
          en: "분할·합병형",
          cells: [
            ["분할·합병형", "분할 후 합병"],
            [
              { k: "퀵 정렬", t: "퀵 정렬(Quick Sort)" },
              { k: "병합 정렬", t: "병합 정렬(Merge Sort)" },
            ],
            ["재귀적 수행", "평균실행시간"],
          ],
        },
        {
          name: "O(N²)",
          en: "제곱형",
          cells: [
            ["제곱형", "2중 loop"],
            [
              { k: "버블 정렬", t: "버블 정렬(Bubble Sort)" },
              { k: "삽입 정렬", t: "삽입 정렬(Insertion Sort)" },
              "최악의 경우 O(n²)",
            ],
            ["인접 원소 비교", "위치 교환 방식", "Shift"],
          ],
        },
        {
          name: "O(N³) ~ O(N!)",
          en: "세제곱·지수형",
          cells: [
            ["세제곱형", "지수형", "모든 해법 검사"],
            [
              "Finding the Shortest Path",
              {
                k: "Dynamic Programming",
                t: "동적 계획법(Dynamic Programming)",
              },
            ],
            ["3중 loop", "O(2ⁿ)", "O(N!)"],
          ],
        },
      ],
      all: {
        name: "점근적 표기 (전 등급)",
        chips: [
          { k: "빅오 표기법", t: "빅오 표기법(O-Notation)" },
          "Ω Notation",
          "Θ Notation",
          { k: "성능분석·성능측정", t: "알고리즘 성능평가" },
          "시간복잡도·공간복잡도",
        ],
      },
      basis:
        "빅오 표기법 유형 표·유형별 연산시간 순서, 알고리즘 성능평가 점근적 성능 표기법·성능 평가 유형 표, 정렬 4종 키워드, 해시 테이블 구성 요소, Stack·Queue 연산(DS), B-Tree 특징 표(DS)",
    },
  ],
  DS: [
    {
      no: 1,
      title: "선형·비선형 구조 맵 (저장 원리 ↔ 연산 ↔ 활용)",
      sub: "자료구조마다 저장·접근 원리, 핵심 연산, 예외·유형, 쓰이는 알고리즘을 연결",
      rowHead: "자료구조",
      cols: [
        { name: "저장 · 접근 원리", tone: "blue" },
        { name: "핵심 연산", tone: "amber" },
        { name: "예외 · 유형", tone: "red" },
        { name: "활용 알고리즘", tone: "green" },
      ],
      rows: [
        {
          name: "링크드 리스트",
          en: "Linked List",
          cells: [
            ["연결 저장", "노드 = 데이터 + 포인터", "Head·Tail"],
            ["삽입", "삭제", "포인터 수정"],
            [
              "Singly Linked List",
              "Double Linked List",
              "Circular Linked List",
            ],
            [
              { k: "LinkedList 큐", t: "Queue" },
              { k: "해시 체이닝", t: "해싱과 충돌해결방법" },
            ],
          ],
        },
        {
          name: "스택",
          en: "Stack",
          cells: [
            ["제한 접근", "LIFO", "TOP·Bottom"],
            ["push(item)", "pop()", "init()", "isEmpty()"],
            ["Overflow", "Underflow"],
            [{ k: "DFS", t: "그래프 순회(Graph Traversal)" }, "스택·백트래킹"],
          ],
        },
        {
          name: "큐",
          en: "Queue",
          cells: [
            ["제한 접근", "FIFO", "Front·Rear"],
            ["Enqueue", "Dequeue", "isFull", "isEmpty"],
            ["선형 큐", "순환 큐", "덱"],
            [
              { k: "BFS", t: "그래프 순회(Graph Traversal)" },
              {
                k: "위상 정렬",
                t: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
              },
            ],
          ],
        },
        {
          name: "트리",
          en: "Tree",
          cells: [
            ["계층", "순환이 없는 연결 그래프"],
            ["삽입", "삭제", "분할"],
            [
              { k: "이진 탐색 트리", t: "이진 탐색 트리(Binary Search Tree)" },
              { k: "AVL 트리", t: "AVL 트리" },
              { k: "힙", t: "힙(Heap)" },
              { k: "B-Tree", t: "B-Tree(Balanced Tree)" },
            ],
            [
              { k: "트리 순회", t: "트리 순회(Tree Traversal)" },
              { k: "트리 기반 인덱스", t: "RDBMS 인덱스(index)" },
            ],
          ],
        },
        {
          name: "그래프",
          en: "Graph",
          cells: [
            ["망", "G = (V, E)", "정점·간선"],
            ["진입차수", "간선 제거"],
            [
              {
                k: "DAG",
                t: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
              },
              "유향 비순환",
            ],
            [
              { k: "다익스트라", t: "다익스트라(Dijkstra) 알고리즘" },
              { k: "MST", t: "최소 신장 트리(MST, Minimum Spanning Tree)" },
              { k: "그래프 순회", t: "그래프 순회(Graph Traversal)" },
            ],
          ],
        },
      ],
      all: {
        name: "구조 분류 (전 구조)",
        chips: [
          { k: "선형 자료구조", t: "선형 자료구조와 비선형 자료구조" },
          "1:1 대응",
          "Array",
          { k: "비선형 자료구조", t: "선형 자료구조와 비선형 자료구조" },
          "1:N",
        ],
      },
      basis:
        "선형·비선형 자료구조 표, 링크드 리스트 구성요소·삽입/삭제 연산·유형 표, Stack 구성 요소·연산 표, Queue 구성 요소·유형 [선순링덱] 표, DAG 위상 정렬 표, 그래프 순회 BFS·DFS 비교(AL), 해싱 충돌 해결방법(AL), RDBMS 인덱스 유형(DB)",
    },
    {
      no: 2,
      title: "트리·그래프 구조 맵 (구조 규칙 ↔ 균형·연산 ↔ 성능·활용)",
      sub: "비선형 구조마다 성질, 균형을 지키는 연산, 그로써 얻는 성능·활용을 정리",
      rowHead: "비선형 구조",
      cols: [
        { name: "구조 규칙 · 성질", tone: "teal" },
        { name: "연산 · 균형 유지", tone: "amber" },
        { name: "성능 · 활용", tone: "green" },
      ],
      rows: [
        {
          name: "이진 탐색 트리",
          en: "BST",
          cells: [
            ["작은 값·큰 값", "중복 노드 없음", "재귀적 성질"],
            ["루트 노드 비교", "좌측 재귀 검색", "우측 재귀 검색"],
            [
              "빈번한 입력과 삭제",
              "이진 탐색",
              { k: "중위 순회", t: "트리 순회(Tree Traversal)" },
            ],
          ],
        },
        {
          name: "AVL 트리",
          en: "AVL Tree",
          cells: [
            ["Balance factor", "균형 이진 트리"],
            [{ k: "트리 회전", t: "AVL 트리" }, "LL·RR", "LR·RL"],
            [
              "서브트리 균형",
              { k: "이진 탐색 트리", t: "이진 탐색 트리(Binary Search Tree)" },
            ],
          ],
        },
        {
          name: "힙",
          en: "Heap",
          cells: [
            ["완전 이진 트리", "최대 힙", "최소 힙"],
            ["삽입 연산", "완전 이진 트리 유지", "치환"],
            ["우선순위 큐 적합", "루트 최대 키"],
          ],
        },
        {
          name: "B-Tree",
          en: "Balanced Tree",
          cells: [
            ["m/2", "Root node·Leaf node", "노드 내 정렬"],
            [
              { k: "분할", t: "B-Tree(Balanced Tree)" },
              "중간 키 부모 승격",
              "후행 키 교환",
            ],
            [
              "O(logN) 일정",
              "트리 높이 감소",
              "B+ Tree·B* Tree",
              { k: "트리 기반 인덱스", t: "RDBMS 인덱스(index)" },
            ],
          ],
        },
        {
          name: "방향성 비순환 그래프",
          en: "DAG",
          cells: [
            ["유향 비순환", "진입 차수", "진출 차수"],
            [
              {
                k: "위상 정렬",
                t: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
              },
              "진입차수 0 삽입",
              "간선 제거 반복",
            ],
            ["DFS·큐 활용", { k: "Queue", t: "Queue" }],
          ],
        },
      ],
      all: {
        name: "공통 기반",
        chips: [
          { k: "트리 순회", t: "트리 순회(Tree Traversal)" },
          { k: "그래프 순회", t: "그래프 순회(Graph Traversal)" },
          "재귀",
          { k: "Stack", t: "Stack" },
          { k: "Linked List", t: "링크드 리스트(Linked List)" },
        ],
      },
      basis:
        "이진 탐색 트리 성질·데이터 탐색 매커니즘 표, AVL 트리 회전 표, 힙 최대·최소 힙·Min-Heap 삽입 연산 표, B-Tree 구조와 특징·삽입/삭제 연산 표, DAG 위상 정렬 표, RDBMS 인덱스 유형(DB), 트리·그래프 순회(AL)",
    },
  ],
  DB: [
    {
      no: 1,
      title: "트랜잭션 보장 맵 (ACID 위협 ↔ 제어·회복)",
      sub: "ACID 특성마다 깨뜨리는 장애·이상 현상과 지키는 제어·회복 기법을 정리",
      rowHead: "보장 특성",
      cols: [
        { name: "주요 장애·이상 현상", tone: "red" },
        { name: "제어·회복 기법", tone: "amber" },
        { name: "보장 수준·관리 요소", tone: "blue" },
      ],
      rows: [
        {
          name: "원자성",
          en: "Atomicity",
          cells: [
            ["Instance 장애", "Syntax 장애", "Fat-finger Error"],
            [{ k: "DB 회복기법", t: "DB 회복기법" }, "즉시 갱신 기법", "UNDO"],
            [{ k: "상태전이도", t: "트랜잭션" }, "부분 완료 상태", "철회 상태"],
          ],
        },
        {
          name: "일관성",
          en: "Consistency",
          cells: [
            ["갱신손실", "모순성", "연쇄복귀"],
            [
              { k: "DB 동시성제어", t: "DB 동시성제어" },
              "2PL",
              "Timestamp ordering",
              "Locking",
            ],
            [
              "직렬성",
              { k: "무결성 제약조건", t: "데이터베이스 무결성" },
              "확장·수축 단계",
            ],
          ],
        },
        {
          name: "고립성",
          en: "Isolation",
          cells: [
            ["Dirty Read", "Non-Repeatable Read", "Phantom Read"],
            [
              { k: "Isolation Level", t: "Isolation Level(격리 레벨)" },
              { k: "낙관적 검증", t: "낙관적 검증(Validation) 기법" },
              { k: "MVCC", t: "MVCC(다중 버전 동시성 제어) 2가지 유형" },
            ],
            [
              "Read Committed",
              "Repeatable Read",
              "Serializable",
              "Rollback Segment",
              "MGA",
            ],
          ],
        },
        {
          name: "영속성",
          en: "Durability",
          cells: [
            ["Media 장애", "H/W 성능 저하", "Parameter Error"],
            ["지연 갱신 기법", "체크포인트", "그림자 페이지", "ARIES"],
            ["REDO", "WAL", "LSN"],
          ],
        },
        {
          name: "교착상태",
          en: "DeadLock",
          cells: [
            ["DeadLock", "교착상태"],
            [
              { k: "Wait-Die", t: "Wait-Die와 Wound-Wait" },
              { k: "Wound-Wait", t: "Wait-Die와 Wound-Wait" },
            ],
            ["타임스템프", "선점", "비선점"],
          ],
        },
        {
          name: "분산 트랜잭션",
          en: "Distributed",
          cells: [
            ["네트워크 장애", "에러 보고"],
            [{ k: "2PC", t: "2PC" }, "Prepare 준비단계", "Commit 단계"],
            [
              "Global Coordinator",
              "Commit Point Site",
              { k: "장애 투명성", t: "분산 DB" },
            ],
          ],
        },
      ],
      all: {
        name: "트랜잭션 공통",
        chips: [
          { k: "트랜잭션", t: "트랜잭션" },
          "ACID",
          "직렬 가능성",
          { k: "TCL", t: "SQL(Structured Query Language)" },
          "SAVEPOINT",
        ],
      },
      basis:
        "트랜잭션 ACID·상태전이도 표, Isolation Level 표, DB 회복기법 장애 유형·회복기법 유형 표, 동시성제어 문제점·기법 유형 표, 낙관적 검증 처리단계, MVCC 2가지 유형, Wait-Die/Wound-Wait 비교, 2PC 구성요소·단계 표",
    },
    {
      no: 2,
      title: "데이터 모델링 단계 맵 (활동 ↔ 이론 ↔ 산출물)",
      sub: "개념→논리→물리→구현 단계마다 활동·문제·이론·산출물을 연결",
      rowHead: "모델링 단계",
      cols: [
        { name: "주요 활동", tone: "blue" },
        { name: "문제·제약", tone: "red" },
        { name: "핵심 이론·기법", tone: "amber" },
        { name: "산출물", tone: "slate" },
      ],
      rows: [
        {
          name: "개념 모델링",
          en: "Conceptual",
          cells: [
            ["주제 영역 정의", "핵심 Entity 정의", "관계 정의"],
            [
              { k: "부채꼴 함정", t: "연결함정(Connection Trap)" },
              { k: "균열 함정", t: "연결함정(Connection Trap)" },
              "순환, Arc",
            ],
            [{ k: "엔티티", t: "엔티티(Entity)" }, "엔티티 유형", "본질식별자"],
            ["ERD", "엔티티정의서"],
          ],
        },
        {
          name: "논리 모델링",
          en: "Logical",
          cells: [
            ["속성 정의", "Entity 상세화", "이력 관리 정의"],
            [
              { k: "삽입 이상", t: "데이터베이스 정규화(Normalization)" },
              "갱신 이상",
              { k: "개체 무결성", t: "데이터베이스 무결성" },
              "참조 무결성",
            ],
            [
              { k: "함수적 종속성", t: "함수적 종속성(Functional Dependency)" },
              { k: "암스트롱 공리", t: "암스트롱 공리(Armstrong's Axioms)" },
              { k: "정규화", t: "데이터베이스 정규화(Normalization)" },
              { k: "릴레이션 키", t: "릴레이션 키(key)" },
            ],
            ["애트리뷰트 정의서", "논리데이터모델 다이어그램"],
          ],
        },
        {
          name: "물리 모델링",
          en: "Physical",
          cells: [
            ["물리 환경 조사", "논리모델 변환", "DBMS 확정"],
            ["테이블 조인 수", "조인 비용", "갱신 비용"],
            [
              { k: "반정규화", t: "데이터베이스 반정규화(De-Normalization)" },
              { k: "인덱스", t: "RDBMS 인덱스(index)" },
              { k: "파티셔닝", t: "데이터베이스 파티셔닝(Partitioning)" },
              "테이블 분할",
            ],
            ["테이블정의서", "컬럼정의서", "물리데이터모델 다이어그램"],
          ],
        },
        {
          name: "구현·질의",
          en: "Implementation",
          cells: [
            [
              { k: "SQL", t: "SQL(Structured Query Language)" },
              "DDL",
              "DML",
              "DCL",
            ],
            [
              {
                k: "데이터 독립성",
                t: "ANSI/SPARC 모델(3-단계 데이터베이스 구조) / 데이터 독립성",
              },
              "논리적 독립성",
              "물리적 독립성",
            ],
            [
              { k: "관계대수", t: "관계대수(Relational Algebra)" },
              { k: "관계해석", t: "관계해석(Relational Calculus)" },
              { k: "조인", t: "조인(Join)" },
            ],
            ["외부 스키마", "개념 스키마", "내부 스키마"],
          ],
        },
      ],
      all: {
        name: "모델링 원칙",
        chips: [
          { k: "데이터베이스 모델링", t: "데이터베이스 모델링" },
          "커뮤니케이션 원칙",
          "모델링 상세화 원칙",
          "논리적 표현 원칙",
          {
            k: "데이터베이스 정의서",
            t: "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)",
          },
        ],
      },
      basis:
        "데이터베이스 모델링 원칙·단계·고려사항 표, 엔티티 유형·도출 절차, 연결함정, 무결성·키 표, 함수적 종속성·암스트롱 공리·정규화·반정규화 표, ANSI/SPARC 스키마 표, 관계대수·관계해석·SQL·조인 표, 공공기관 DB 표준화지침 산출물 관리항목",
    },
    {
      no: 3,
      title: "정규화 단계 맵 (종속성 ↔ 정규형 ↔ 이상현상)",
      sub: "정규형마다 제거하는 종속성과 그 근거·이상현상, 되돌리는 반정규화",
      rowHead: "정규형",
      cols: [
        { name: "제거 대상 종속성", tone: "red" },
        { name: "분해 내용", tone: "amber" },
        { name: "근거 이론·규칙", tone: "violet" },
      ],
      rows: [
        {
          name: "1정규화",
          en: "1NF",
          cells: [
            ["원자값", "셀 단일 값"],
            ["복수의 속성값", "속성 분리"],
            [
              { k: "본질적 제약", t: "릴레이션 키(key)" },
              { k: "릴레이션 키", t: "릴레이션 키(key)" },
            ],
          ],
        },
        {
          name: "2정규화",
          en: "2NF",
          cells: [
            [
              { k: "부분함수 종속", t: "함수적 종속성(Functional Dependency)" },
              "삽입 이상",
            ],
            ["부분함수종속 제거", "주식별자"],
            ["완전 함수 종속", { k: "후보키", t: "릴레이션 키(key)" }],
          ],
        },
        {
          name: "3정규화",
          en: "3NF",
          cells: [
            [
              { k: "이행함수 종속", t: "함수적 종속성(Functional Dependency)" },
              "갱신 이상",
            ],
            ["이행함수종속 분리", "속성 분리"],
            [
              { k: "이행성 규칙", t: "암스트롱 공리(Armstrong's Axioms)" },
              "A→Y",
            ],
          ],
        },
        {
          name: "BCNF",
          en: "Boyce-Codd",
          cells: [
            ["결정자함수 종속", "삭제 이상"],
            ["다수의 주식별자 분리"],
            ["결정자", "후보키 아님"],
          ],
        },
        {
          name: "4·5정규화",
          en: "4NF·5NF",
          cells: [
            ["다중값 종속성", "조인종속성"],
            ["다가 종속 속성 분리", "N개로 분리"],
            ["Multi-Valued Dependency", "Join Dependency"],
          ],
        },
        {
          name: "반정규화",
          en: "De-Normalization",
          cells: [
            ["테이블 조인 수", "대량 범위 처리"],
            [
              {
                k: "테이블 병합",
                t: "데이터베이스 반정규화(De-Normalization)",
              },
              "테이블 분할",
              "중복 컬럼 추가",
              "중복관계 추가",
            ],
            ["뷰(View) 테이블", "클러스터링 적용", "인덱스 조정"],
          ],
        },
      ],
      all: {
        name: "정규화 원칙",
        chips: [
          { k: "정규화", t: "데이터베이스 정규화(Normalization)" },
          "정보의 무손실",
          "데이터 중복성 감소",
          "분리의 원칙",
          { k: "폐포(F+)", t: "암스트롱 공리(Armstrong's Axioms)" },
          "정당성·완전성",
        ],
      },
      basis:
        "함수적 종속성 유형·종속성 해결방법 표, 정규화 이상현상·원인·원칙·유형 표, 암스트롱 공리 기본·부가규칙·폐포, 릴레이션 키 유형·제약유형 표, 반정규화 절차·기법 표",
    },
    {
      no: 4,
      title: "DB 확장 아키텍처 맵 (한계 ↔ 분산 기법 ↔ 이론)",
      sub: "분산·분리·분할·NoSQL·NewSQL·벡터 DB가 어떤 한계를 무엇으로 푸는지 정리",
      rowHead: "확장 방식",
      cols: [
        { name: "한계·문제", tone: "red" },
        { name: "핵심 기법", tone: "amber" },
        { name: "이론·원리", tone: "blue" },
        { name: "구성·대표 사례", tone: "slate" },
      ],
      rows: [
        {
          name: "분산 DB",
          en: "Distributed DB",
          cells: [
            ["Bottle neck", "이기종 연동", "장애처리"],
            [
              { k: "분산 DB", t: "분산 DB" },
              { k: "2PC", t: "2PC" },
              "테이블 복제분산",
              "Fragmentation",
            ],
            ["위치 투명성", "복제 투명성", "분할 투명성", "병행 투명성"],
            ["Top Down", "Bottom Up", "Hybrid"],
          ],
        },
        {
          name: "읽기·쓰기 분리",
          en: "Query Offloading",
          cells: [
            ["성능저하", "조회 부하"],
            [
              { k: "쿼리 오프로딩", t: "쿼리오프로딩(Query offloading)" },
              "CDC",
              "load balancing",
            ],
            ["Read 트랜잭션", "Update 트랜잭션"],
            ["Master DB", "Staging DB", "Slave DB"],
          ],
        },
        {
          name: "데이터 분할",
          en: "Partitioning·Sharding",
          cells: [
            ["용량 한계", "데이터 집중", "단일 장애 포인트"],
            [
              { k: "파티셔닝", t: "데이터베이스 파티셔닝(Partitioning)" },
              { k: "샤딩", t: "데이터베이스 샤딩(Sharding)" },
              "Hash Sharding",
              "Range Sharding",
            ],
            ["수평 분할", "수직 분할", "shard key"],
            ["Shard DB", "proxy", "로컬 파티션", "글로벌파티션"],
          ],
        },
        {
          name: "NoSQL",
          en: "Not only SQL",
          cells: [
            ["비정형 데이터", "일관성 저하", "가용성 저하"],
            [
              { k: "NoSQL", t: "NoSQL" },
              { k: "데이터모델링 패턴", t: "NoSQL 데이터모델링 패턴" },
              "Key-Value",
              "Document",
              "Column Family",
              "Graph 기반",
            ],
            [
              { k: "CAP", t: "CAP 이론과 BASE 이론" },
              { k: "BASE", t: "CAP 이론과 BASE 이론" },
              { k: "PACELC", t: "PACELC" },
              "Eventually Consistent",
            ],
            ["HBase", "Cassandra", "MongoDB", "Dynamo"],
          ],
        },
        {
          name: "NewSQL",
          en: "NewSQL",
          cells: [
            ["Scale-up", "Schema-full"],
            [
              { k: "NewSQL", t: "NewSQL" },
              "비잠금 동시성제어",
              "인메모리",
              { k: "MVCC", t: "MVCC(다중 버전 동시성 제어) 2가지 유형" },
            ],
            ["ACID 지원", "Scale-out", "병렬/비공유"],
            ["Volt DB", "Spanner"],
          ],
        },
        {
          name: "벡터 DB",
          en: "Vector DB",
          cells: [
            ["고차원 성능 저하", "정보 손실 위험", "구축 시간 김"],
            [
              { k: "벡터 DB", t: "벡터 데이터베이스(Vector Database)" },
              { k: "ANN", t: "ANN(Approximate Nearest Neighbor) 알고리즘" },
              "HNSW",
              "IVF",
              "LSH",
            ],
            ["코사인 유사도", "유클리드 거리", "내적", "자카드 유사도"],
            ["벡터 임베딩", "k-d 트리", "차원의 저주", "Brute Force"],
          ],
        },
      ],
      all: {
        name: "공통 성능 기법",
        chips: [
          { k: "인덱스", t: "RDBMS 인덱스(index)" },
          { k: "Hash Join", t: "조인(Join)" },
          "Nested Loop Join",
          "Sort Merge Join",
          "Index Range Scan",
        ],
      },
      basis:
        "분산 DB 설계 전략·투명성·분산방법 표, 2PC, 쿼리오프로딩 구성요소·샤딩 비교 표, 파티셔닝 유형, 샤딩 구성요소·분할방법 표, NoSQL 유형·모델링 패턴, CAP·BASE·PACELC 분류 표, NewSQL 기능·기술요소·비교 표, 벡터 DB 알고리즘·유사도, ANN 구성요소, 조인·인덱스 표",
    },
    {
      no: 5,
      title: "데이터 품질 관리 맵 (품질 문제 ↔ 관리 활동 ↔ 진단·인증)",
      sub: "예방적 품질관리 4영역(표준·구조·값·관리체계)에 메타데이터·가치를 더해 정리",
      rowHead: "관리 영역",
      cols: [
        { name: "품질 문제", tone: "red" },
        { name: "관리 활동·기법", tone: "amber" },
        { name: "진단·인증 기준", tone: "blue" },
      ],
      rows: [
        {
          name: "데이터 표준",
          en: "Standard",
          cells: [
            ["데이터 불일치", "데이터 통합 어려움"],
            [
              { k: "데이터 표준화", t: "데이터 표준화" },
              "표준 용어",
              "표준 도메인",
              "표준 코드",
            ],
            [
              {
                k: "표준화지침",
                t: "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)",
              },
              "데이터표준확산",
              "데이터 표준 관리 도구",
            ],
          ],
        },
        {
          name: "데이터 구조",
          en: "Structure",
          cells: [
            ["이상현상", "데이터 중복성"],
            ["데이터 구조 설계", "데이터 구조 검증", "논리모델 변환"],
            ["데이터구조안정화", "데이터 모델 검증"],
          ],
        },
        {
          name: "데이터 값",
          en: "Value",
          cells: [
            ["누락값", "비유효값", "무결성 위반사항", "이상값"],
            [
              {
                k: "데이터 프로파일링",
                t: "데이터 프로파일링(Data Profiling)",
              },
              { k: "데이터 클렌징", t: "데이터 클렌징(Cleansing)" },
              { k: "데이터 전처리", t: "데이터 전처리" },
              "이관 데이터 검증",
            ],
            [
              { k: "ISO 8000", t: "데이터 품질관리(ISO 8000)" },
              "데이터오류율",
              "완전성",
              "유효성",
              "정확성",
            ],
          ],
        },
        {
          name: "메타데이터",
          en: "Metadata",
          cells: [
            ["의미 파악 어려움", "데이터 파편화"],
            [
              { k: "데이터 카탈로그", t: "메타 데이터와 데이터 카탈로그" },
              { k: "데이터 리니지", t: "데이터 리니지" },
              "메타정보 관리항목",
            ],
            [{ k: "ISO/IEC 11179", t: "ISO/IEC 11179" }, "데이터 표준사전"],
          ],
        },
        {
          name: "관리체계",
          en: "Governance",
          cells: [
            ["유지보수 곤란", "신규 요건 반영"],
            [
              { k: "데이터 거버넌스", t: "데이터 거버넌스(Data Governance)" },
              "DQM",
              "데이터 주기 관리",
            ],
            [
              {
                k: "예방적 품질관리",
                t: "공공데이터 예방적 품질관리 진단 가이드",
              },
              {
                k: "DQ인증",
                t: "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)",
              },
              "성숙도 단계",
              "사후관리",
            ],
          ],
        },
        {
          name: "개방·가치",
          en: "Open·Value",
          cells: [
            ["오류 신고 분석", "주관적 평가"],
            [
              { k: "데이터 가치 평가", t: "데이터 가치 평가" },
              "시장 접근법",
              "수익 접근법",
              "원가 접근법",
            ],
            [
              {
                k: "공공데이터 품질인증",
                t: "공공데이터 품질인증 매뉴얼(2025.07.)",
              },
              "최우수",
              "우수",
              "공공데이터개방활성화",
            ],
          ],
        },
      ],
      all: {
        name: "품질 관리 공통",
        chips: [
          "데이터품질진단",
          "품질진단결과조치",
          "품질관리계획수립",
          "데이터 관리체계",
        ],
      },
      basis:
        "공공데이터 예방적 품질관리 진단항목·단계별 절차 표, 데이터 표준화 필요성·대상 표, 공공기관 DB 표준화지침 표준사전 항목, 데이터 프로파일링 절차·분석기술, 데이터 거버넌스 주요기능·성숙도, 공공데이터 품질인증 심사 영역·등급, DQ인증 데이터 내용·관리체계 인증, 데이터 가치 평가 기법 표",
    },
    {
      no: 6,
      title: "데이터 분석 방법론 맵 (KDD ↔ SEMMA ↔ CRISP-DM)",
      sub: "세 마이닝 방법론의 같은 단계를 나란히 놓고 그 단계의 분석 토픽을 연결",
      rowHead: "분석 단계",
      cols: [
        { name: "KDD", tone: "teal" },
        { name: "SEMMA", tone: "violet" },
        { name: "CRISP-DM", tone: "blue" },
        { name: "관련 기법·토픽", tone: "amber" },
      ],
      rows: [
        {
          name: "선택·이해",
          en: "Selection",
          cells: [
            ["Selection", "데이터셋 생성"],
            ["Sampling", "통계적 추출", "조건 추출"],
            ["비즈니스 이해", "Success Criteria"],
            [
              {
                k: "분석 준비도",
                t: "데이터 분석 준비도와 데이터 분석 성숙도",
              },
              {
                k: "분석 거버넌스",
                t: "데이터 분석 거버넌스(Data Analytics Governance)",
              },
            ],
          ],
        },
        {
          name: "전처리·탐색",
          en: "Explore",
          cells: [
            ["Preprocessing", "잡음·이상값·결측값"],
            ["Explore", "클러스터링"],
            ["데이터 이해", "Quality Report"],
            [
              {
                k: "탐색적 데이터 분석",
                t: "탐색적 데이터 분석과 확증적 데이터 분석",
              },
              {
                k: "데이터 프로파일링",
                t: "데이터 프로파일링(Data Profiling)",
              },
              "히스토그램",
              "상자수염그림",
            ],
          ],
        },
        {
          name: "변환·준비",
          en: "Transformation",
          cells: [
            ["Transformation", "변수 선택", "차원 축소"],
            ["Modify", "수량화", "표준화"],
            ["데이터 준비", "Cleaning Report", "Merged Data"],
            [
              { k: "데이터 전처리", t: "데이터 전처리" },
              { k: "데이터 클렌징", t: "데이터 클렌징(Cleansing)" },
              { k: "데이터 랭글링", t: "데이터 랭글링(Data Wrangling)" },
            ],
          ],
        },
        {
          name: "모델링·마이닝",
          en: "Data Mining",
          cells: [
            ["Data Mining", "기법·알고리즘"],
            ["Modeling", "Neural Network", "Decision Tree"],
            ["모델링", "Test Design"],
            [
              { k: "비정형 데이터 마이닝", t: "정형/비정형 데이터 마이닝" },
              {
                k: "연관성 분석",
                t: "연관성 분석(association analysis) - 데이터마이닝",
              },
              { k: "Apriori", t: "Apriori 알고리즘" },
              { k: "DHP", t: "DHP(Direct Hashing & Pruning) 알고리즘" },
              { k: "FP-Growth", t: "FP(Frequent Pattern)-Growth 알고리즘" },
            ],
          ],
        },
        {
          name: "평가·전개",
          en: "Evaluation",
          cells: [
            ["Interpretation·Evaluation", "활용"],
            ["Assessment", "Report", "Review"],
            ["평가", "전개", "Final Report"],
            [
              {
                k: "확증적 데이터 분석",
                t: "탐색적 데이터 분석과 확증적 데이터 분석",
              },
              { k: "데이터 시각화", t: "데이터 시각화" },
              { k: "빅데이터 시각화", t: "빅데이터 시각화(Visualization)" },
              "P-value",
            ],
          ],
        },
      ],
      all: {
        name: "방법론·수준 진단",
        chips: [
          { k: "KDD", t: "데이터 마이닝 방법론" },
          { k: "SEMMA", t: "데이터 마이닝 방법론" },
          { k: "CRISP-DM", t: "데이터 마이닝 방법론" },
          { k: "분석 성숙도", t: "데이터 분석 준비도와 데이터 분석 성숙도" },
          "인사이트 프로세스",
        ],
      },
      basis:
        "데이터 마이닝 방법론 KDD·SEMMA·CRISP-DM 절차 표, EDA·CDA 비교 표, 데이터 시각화 프로세스·인사이트 프로세스, 연관성 분석·Apriori·DHP·FP-Growth 절차, 데이터 분석 거버넌스·준비도·성숙도 표",
    },
    {
      no: 7,
      title: "데이터 플랫폼·공유 맵 (플랫폼 ↔ 핵심 기술 ↔ 거버넌스)",
      sub: "저장·통합·유통 플랫폼별 해결 문제, 핵심 기술, 관리·거버넌스 요소를 연결",
      rowHead: "데이터 플랫폼",
      cols: [
        { name: "해결 대상·한계", tone: "red" },
        { name: "핵심 기술·구성", tone: "amber" },
        { name: "관리·거버넌스", tone: "blue" },
      ],
      rows: [
        {
          name: "웨어하우스·레이크",
          en: "DW·Lake",
          cells: [
            ["정형", "비정형"],
            [
              {
                k: "데이터 웨어하우스",
                t: "데이터(웨어하우스, 레이크, 패브릭, 메시)",
              },
              {
                k: "데이터 레이크",
                t: "데이터(웨어하우스, 레이크, 패브릭, 메시)",
              },
              "ETL",
              "OLAP",
            ],
            ["스키마 관리", "데이터 품질 관리"],
          ],
        },
        {
          name: "레이크하우스",
          en: "Lakehouse",
          cells: [
            ["배치", "스트리밍"],
            [
              {
                k: "데이터 레이크하우스",
                t: "데이터 레이크하우스(Data Lakehouse)",
              },
              "Batch Processing",
              "Streaming Processing",
              "ACID 트랜잭션",
            ],
            ["스키마 레지스트리", "데이터 파이프라인", "BI 도구"],
          ],
        },
        {
          name: "스트리밍",
          en: "Streaming",
          cells: [
            ["실시간성", "CDC, CEP"],
            [
              { k: "아파치 카프카", t: "아파치 카프카(Apache Kafka)" },
              "topic",
              "producer",
              "consumer",
              "broker",
            ],
            ["Publish/Subscribe", "Partition"],
          ],
        },
        {
          name: "패브릭·가상화",
          en: "Fabric·Virtualization",
          cells: [
            ["데이터 파편화", "외부 상호작용"],
            [
              { k: "데이터 패브릭", t: "데이터패브릭(Data Fabric)" },
              { k: "데이터 가상화", t: "데이터 가상화(Data Virtualization)" },
              { k: "데이터 파운드리", t: "데이터 파운드리(Data Foundry)" },
            ],
            [
              { k: "데이터 카탈로그", t: "메타 데이터와 데이터 카탈로그" },
              { k: "데이터 리니지", t: "데이터 리니지" },
              "메타데이터",
            ],
          ],
        },
        {
          name: "메시·데이터 제품",
          en: "Mesh·DaaP",
          cells: [
            ["중앙 집중형 Platform", "데이터셋 탈피"],
            [
              { k: "데이터 메시", t: "데이터 메시(Data Mesh)" },
              { k: "DaaP", t: "DaaP(Data as a product)" },
              "API 기반 데이터 서비스",
            ],
            ["도메인 소유권", "Data Product Owner", "관측 가능성"],
          ],
        },
        {
          name: "공유·교환",
          en: "Data Space",
          cells: [
            ["유통·거래", "데이터 주권"],
            [
              { k: "데이터 스페이스", t: "데이터 스페이스(Data Space)" },
              "연합 카탈로그",
              "메타데이터 브로커",
              "클리어링하우스",
            ],
            [
              { k: "상호운용성", t: "데이터 상호 운용성 & 데이터 이동권" },
              { k: "데이터 이동권", t: "데이터 상호 운용성 & 데이터 이동권" },
              "Policy-as-Code",
            ],
          ],
        },
      ],
      all: {
        name: "공통 기반",
        chips: [
          { k: "데이터 거버넌스", t: "데이터 거버넌스(Data Governance)" },
          "클라우드 네이티브",
          "Open API",
          "표준 API",
        ],
      },
      basis:
        "데이터 레이크하우스 구성도·기술요소 표, 아파치 카프카 구성요소·동작방식, DaaP 구성요소·핵심원칙, 데이터 스페이스 거버넌스 참조모델·계층 구성 표, 데이터 상호 운용성·이동권 핵심요소, 데이터 아키텍처 영역 토픽(웨어하우스·레이크·패브릭·메시·가상화·파운드리)",
    },
  ],
  MG: [
    {
      no: 1,
      title: "IT 서비스·업무 연속성 맵 (위험 ↔ 대응 ↔ 지표)",
      sub: "서비스 운영부터 재해복구까지 영역마다 위험·대응 체계·측정 지표를 정리",
      rowHead: "관리 영역",
      cols: [
        { name: "위험·원인", tone: "red" },
        { name: "대응 체계·기법", tone: "amber" },
        { name: "지표·도구·표준", tone: "blue" },
      ],
      rows: [
        {
          name: "서비스 운영",
          en: "Service Operation",
          cells: [
            ["서비스 수준 위반", "네트워크 장애", "SW 버그·오작동"],
            [
              {
                k: "ITSM",
                t: "ITSM(Information Technology Service Management)",
              },
              { k: "ITIL", t: "ITIL(IT Infrastructure Library) 4.0" },
              {
                k: "SLM",
                t: "서비스 수준 관리 (SLM, Service Level Management)",
              },
              "OLA",
              "Service Catalog",
            ],
            ["SLA·SLO", "서비스 가동률", "SR 적기 처리율", "고객 만족도"],
          ],
        },
        {
          name: "기술 품질",
          en: "Technical Debt",
          cells: [
            [
              { k: "기술 부채", t: "기술 부채(Technical Debt)" },
              "설계 악취",
              "스파게티 코드",
              "테스트 커버리지",
            ],
            ["부채 추정", "우선순위화", "리팩토링", "템플릿 통합"],
            ["코드 정적 분석", "SonarQube", "Coverity"],
          ],
        },
        {
          name: "업무 영향",
          en: "Impact Analysis",
          cells: [
            ["핵심프로세스", "발생가능성", "손실평가"],
            [
              { k: "BIA", t: "BIA (Business Impact Analysis)" },
              "의존성 분석",
              "우선순위 산정",
            ],
            [
              { k: "MBCO·MTPD·MAO", t: "BCP 지표 중 MBCO, MTPD, MAO" },
              "RTO·RPO",
              "RSO·RCO",
            ],
          ],
        },
        {
          name: "업무 연속성",
          en: "Business Continuity",
          cells: [
            ["비즈니스 중단", "내/외부 사건", "최대 중단기간"],
            [
              { k: "BCP", t: "BCP (Business Continuity Planning)" },
              "업무복구 계획",
              "대체프로세스",
              "업무비상 계획",
            ],
            ["BIA 최종등급", "레질리언스"],
          ],
        },
        {
          name: "재해복구",
          en: "Disaster Recovery",
          cells: [
            ["재난·재해", "서비스 중단", "최대 정지시간"],
            [
              { k: "DRS", t: "DRS (Disaster Recovery System)" },
              { k: "DRaaS", t: "DRaaS(Disaster Recovery as a Service)" },
              "Mirror·Hot·Warm·Cold",
              "상호계약형·공동이용형",
            ],
            ["HA·FT", "IP-SAN", "DWDM", "Failover·Failback"],
          ],
        },
        {
          name: "법·표준",
          en: "Regulation",
          cells: [
            ["디지털 재난", "데이터센터", "중요통신시설"],
            [
              { k: "ISO 22301", t: "ISO 22301" },
              { k: "디지털 안전 3법", t: "디지털 안전 3법" },
              { k: "정보시스템 등급제", t: "정보시스템 등급제" },
            ],
            [
              "BCMS",
              { k: "PDCA", t: "PDCA(Plan-Do-Check-Act, Deming Cycle)" },
              "BS25999",
            ],
          ],
        },
      ],
      all: {
        name: "통합 관리 (전 영역)",
        chips: ["모의훈련", "경영진 의지", "조직 내재화", "지속적 개선"],
      },
      basis:
        "ITSM 프레임워크·SLA 주요지표 표, SLM 구성요소, 기술 부채 원인·유형·관리방안 표, BIA 절차·지표 표, BCP 개념도, DRS DR센터 유형·기술요소 표, DRaaS 모델, ISO 22301 PDCA, 디지털 안전 3법 개정 내용, 비즈니스 연속성 성능목표치 그래프",
    },
    {
      no: 2,
      title: "IT 거버넌스 도메인 맵 (영역 ↔ 프레임워크 ↔ 측정)",
      sub: "도메인 프레임워크 5영역마다 관련 토픽·참조모델·측정 수단을 연결",
      rowHead: "거버넌스 영역",
      cols: [
        { name: "관련 요소", tone: "violet" },
        { name: "프레임워크·표준", tone: "blue" },
        { name: "측정·통제", tone: "green" },
      ],
      rows: [
        {
          name: "전략적 연계",
          en: "Strategy Alignment",
          cells: [
            [
              { k: "ISP", t: "ISP (Information Strategy Planning)" },
              { k: "ISMP", t: "ISMP (Information System Master Plan)" },
              "EA",
            ],
            [
              "EA/ITA",
              "도메인 프레임워크",
              { k: "ISO 38500", t: "ISO 38500:2024" },
            ],
            ["IT비전·로드맵", "전략 정의서"],
          ],
        },
        {
          name: "가치 전달",
          en: "Value Delivery",
          cells: [
            [
              "ERP·SCM·CRM",
              "BPM",
              { k: "가치사슬", t: "가치사슬(Value Chain)" },
            ],
            ["Val IT", "포트폴리오관리", "투자관리"],
            [
              { k: "IT 투자성과 평가", t: "IT 투자성과 평가" },
              { k: "정보화 투자관리", t: "정보화 투자관리 가이드" },
              "NPV·ROI",
            ],
          ],
        },
        {
          name: "위험관리",
          en: "Risk Management",
          cells: [
            [
              { k: "DRS", t: "DRS (Disaster Recovery System)" },
              { k: "BCP", t: "BCP (Business Continuity Planning)" },
              "ERM",
            ],
            ["Risk IT", "COBIT", { k: "IT-Compliance", t: "IT-Compliance" }],
            ["Risk Evaluation", "Risk Response", "내부통제"],
          ],
        },
        {
          name: "자원관리",
          en: "Resource Management",
          cells: [
            [
              {
                k: "ITSM",
                t: "ITSM(Information Technology Service Management)",
              },
              "ITAM",
              {
                k: "하드웨어 규모산정",
                t: "정보시스템 하드웨어 규모산정 지침",
              },
            ],
            [
              "CMMI/SPICE",
              { k: "ITIL", t: "ITIL(IT Infrastructure Library) 4.0" },
              "eSCM",
            ],
            [
              {
                k: "SLA·SLM",
                t: "서비스 수준 관리 (SLM, Service Level Management)",
              },
              "tpmC",
              "SPECjbb2015",
            ],
          ],
        },
        {
          name: "성과측정",
          en: "Performance Measurement",
          cells: [
            [
              {
                k: "BSC",
                t: "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)",
              },
              "IT ROI",
              { k: "OKR", t: "OKR" },
            ],
            ["IT-BSC", "MBO", { k: "ESG 경영", t: "ESG 경영" }],
            ["KPI·CSF", "Key Results", "재무·고객"],
          ],
        },
      ],
      all: {
        name: "거버넌스 공통",
        chips: [
          { k: "IT 거버넌스", t: "IT 거버넌스(IT-Governance)" },
          "평가·지휘·감독",
          "이해관계자 참여",
          "SOX·Basel II",
          "의사결정영역 프레임워크",
        ],
      },
      basis:
        "IT 거버넌스 도메인 프레임워크 개념도·참조모델·프레임워크 유형 표, ISO 38500 구성요소, IT-Compliance 주요요구사항, BSC & IT-BSC 표, OKR과 MBO 비교, 규모산정 지표 표",
    },
    {
      no: 3,
      title: "정보화 전략 수립 맵 (단계 ↔ 기법 ↔ 산출물)",
      sub: "ISP·ISMP 절차를 따라 단계별 활동·분석 기법·산출물과 투자·기술 평가를 정리",
      rowHead: "수립 단계",
      cols: [
        { name: "핵심 활동", tone: "amber" },
        { name: "분석 기법·도구", tone: "blue" },
        { name: "산출물·지표", tone: "green" },
      ],
      rows: [
        {
          name: "환경 분석",
          en: "Environment",
          cells: [
            [
              { k: "환경분석", t: "환경분석" },
              "경영환경분석",
              "법령·제도 분석",
              "IT 환경분석",
            ],
            ["PEST 분석", "5 Force", "3C 분석"],
            ["경영환경 분석서", "IT 동향분석서", "기회/위협"],
          ],
        },
        {
          name: "현황 분석",
          en: "As-Is",
          cells: [
            ["업무현황분석", "벤치마킹 수행", "Gap 분석"],
            [
              { k: "Value Chain 분석", t: "가치사슬(Value Chain)" },
              "7S 모형",
              { k: "MECE·LISS", t: "MECE와 LISS" },
            ],
            ["차이 분석서", "개선과제 분석서", "강점/약점"],
          ],
        },
        {
          name: "전략·목표모델",
          en: "To-Be",
          cells: [
            [
              { k: "ISP", t: "ISP (Information Strategy Planning)" },
              "비전·전략 수립",
              "목표모델 설계",
            ],
            [
              { k: "BCG Matrix", t: "BCG Matrix" },
              { k: "Ansoff Matrix", t: "Ansoff Matrix" },
              "EA/ITA",
            ],
            ["전략 정의서", "프로세스 설계서", "데이터 설계서"],
          ],
        },
        {
          name: "요건·이행계획",
          en: "Master Plan",
          cells: [
            [
              { k: "ISMP", t: "ISMP (Information System Master Plan)" },
              {
                k: "공통가이드 9판",
                t: "ISP 및 ISMP 수립 공통가이드 9판(2025.05)",
              },
              "요건 기술서",
            ],
            [
              {
                k: "하드웨어 규모산정",
                t: "정보시스템 하드웨어 규모산정 지침",
              },
              "수식계산법·참조법",
              "분리발주 평가",
            ],
            ["이행계획 수립서", "총구축비 산출", "제안요청서"],
          ],
        },
        {
          name: "투자 평가",
          en: "Investment",
          cells: [
            [
              { k: "IT 투자성과 평가", t: "IT 투자성과 평가" },
              "사전평가·중간평가·사후평가",
              { k: "정보화 투자관리", t: "정보화 투자관리 가이드" },
            ],
            ["NPV·ROI·IRR", "Payback Period", "BCR"],
            ["투자 우선순위", "KPI", "사업 개선안"],
          ],
        },
        {
          name: "기술 평가",
          en: "Technology",
          cells: [
            [
              { k: "TRL", t: "TRL(Technology Readiness Level)" },
              { k: "기술 가치 평가", t: "기술 가치 평가" },
              { k: "지식재산권", t: "지식재산권" },
            ],
            ["수익·원가·시장 접근법", "기술성·권리성", "시장성·사업성"],
            ["기술준비도", "경제적수명 추정", "로열티 공제법"],
          ],
        },
      ],
      all: {
        name: "사업 검토 (공통)",
        chips: [
          "사업 타당성",
          "실현 가능성",
          "클라우드 우선 적용",
          "규모 적정성",
        ],
      },
      basis:
        "ISP 절차 상세 표, ISMP 절차·ISP/EA/ISMP 비교 표, 공통가이드 9판 검토 주요 내용, 환경분석 외부·내부 표, 규모산정 방법·절차, IT 투자성과평가 상세, 기술 가치 평가 절차·평가요인·평가방법, TRL 이행 단계",
    },
    {
      no: 4,
      title: "성장·혁신 전략 맵 (상황 ↔ 전략·기법 ↔ 성과·사례)",
      sub: "사업 포트폴리오에서 새 경제 모델까지 혁신 대상별 상황·기법·성과를 연결",
      rowHead: "혁신 대상",
      cols: [
        { name: "문제·상황", tone: "red" },
        { name: "전략·기법", tone: "amber" },
        { name: "성과·사례", tone: "green" },
      ],
      rows: [
        {
          name: "사업 포트폴리오",
          en: "Portfolio",
          cells: [
            ["점유율·성장률", "제품생명주기"],
            [
              { k: "BCG Matrix", t: "BCG Matrix" },
              { k: "Ansoff Matrix", t: "Ansoff Matrix" },
              "다각화",
            ],
            ["Star·Cash Cow", "시장 침투", "제품 개발"],
          ],
        },
        {
          name: "기술 수용",
          en: "Adoption",
          cells: [
            [
              {
                k: "기술수용 주기",
                t: "기술수용 주기(Technology Adoption Life Cycle)",
              },
              "캐즘",
              "기술 성숙도",
            ],
            ["목표 고객 세분화", "명확한 가치제안", "신뢰확보"],
            [
              "전기다수 수용자",
              { k: "TRL 9", t: "TRL(Technology Readiness Level)" },
            ],
          ],
        },
        {
          name: "고객 성장",
          en: "Growth",
          cells: [
            ["데이터 기반", "주목 경제"],
            [
              { k: "그로스 해킹", t: "그로스 해킹(Growth hacking)" },
              "A/B Test",
              "Cohort analysis",
              "Funnel Analysis",
            ],
            ["AARRR", "Retention", "Referral"],
          ],
        },
        {
          name: "제품·서비스 모델",
          en: "Business Model",
          cells: [
            ["제품 서비스 결합", "능동적 소비자"],
            [
              { k: "서비타이제이션", t: "서비타이제이션(Servitization)" },
              { k: "의도 경제", t: "의도 경제(Intention Economy)" },
              "PSS",
            ],
            ["협업 필터링", "의도 기반 마케팅", "인텐토노미"],
          ],
        },
        {
          name: "플랫폼 경제",
          en: "Platform",
          cells: [
            ["탈중앙화·탈독점화", "공정한 분배"],
            [
              { k: "프로토콜 경제", t: "프로토콜 경제(Protocol Economy)" },
              "블록체인",
              { k: "스테이블 코인", t: "스테이블 코인(Stable coin)" },
            ],
            ["De-Fi", "마이데이터", "BaaS"],
          ],
        },
        {
          name: "사회·사용자 혁신",
          en: "Co-creation",
          cells: [
            ["사회 문제", "공감", "시민 참여"],
            [
              { k: "디자인 씽킹", t: "디자인 씽킹(Design Thinking)" },
              { k: "시빅 해킹", t: "시빅 해킹(Civic Hacking)" },
              { k: "리빙랩·S.O.S랩", t: "리빙랩(Living Lab), S.O.S랩" },
            ],
            ["프로토타입", "공공 데이터", "공동 창조", "사중나선 구조"],
          ],
        },
        {
          name: "지속가능 경영",
          en: "Sustainability",
          cells: [
            ["기후변화", "지속 가능"],
            [
              { k: "ESG 경영", t: "ESG 경영" },
              { k: "OKR", t: "OKR" },
              { k: "PDCA", t: "PDCA(Plan-Do-Check-Act, Deming Cycle)" },
            ],
            ["기업가치제고", "지속가능경영", "ESG 정보 공개 원칙"],
          ],
        },
      ],
      all: {
        name: "문제 해결 사고",
        chips: [
          { k: "MECE·LISS", t: "MECE와 LISS" },
          "로직트리",
          "가설",
          "3I모델",
        ],
      },
      basis:
        "BCG Matrix 개념도·제품생명주기, Ansoff Matrix, 기술수용 주기·캐즘 극복방안, 그로스 해킹 기법·AARRR, 서비타이제이션 유형, 의도 경제 비교·구성요소, 프로토콜 경제 표, 디자인 씽킹 절차·3I모델, 시빅 해킹 참여주체, 리빙랩·S.O.S랩 비교, ESG 구성요소·정보 공개 원칙",
    },
  ],
  SC: [
    {
      no: 1,
      title: "계층별 보안 맵 (공격 ↔ 대응)",
      sub: "심층 방어 관점에서 계층마다 위협과 기술적·관리적 대응을 정리",
      rowHead: "보호 계층",
      cols: [
        { name: "주요 위협·공격", tone: "red" },
        { name: "기술적 대응 (보안 솔루션)", tone: "amber" },
        { name: "관리적·물리적 대응", tone: "blue" },
      ],
      rows: [
        {
          name: "사용자·단말",
          cells: [
            [
              { k: "랜섬웨어", t: "RaaS(Ransomware as a Service)" },
              { k: "딥보이스", t: "딥보이스(Deep Voice) 피싱" },
              "사회공학",
              {
                k: "드라이브 바이 다운로드",
                t: "드라이브 바이 다운로드(Drive By Download)",
              },
              "이메일 스푸핑",
            ],
            [
              { k: "EDR", t: "EDR(Endpoint Detection and Response)" },
              { k: "패스키", t: "패스키(Passkey)" },
              { k: "생체 인증", t: "생체 인증(텔레바이오 인증)" },
              "Anti-Virus",
              {
                k: "DMARC",
                t: "DMARC(Domain-based Message Authentication, Reporting and Conformance)",
              },
            ],
            [
              "사용자 교육",
              "보안인식 제고",
              "화이트리스트 기반관리",
              "이동식 매체 제한",
              "백업 수행",
            ],
          ],
          en: "Endpoint",
        },
        {
          name: "응용",
          cells: [
            [
              { k: "인젝션", t: "OWASP Top 10:2025" },
              { k: "SSRF", t: "SSRF(Server-Side Request Forgery)" },
              "XSS·CSRF",
              {
                k: "프롬프트 인젝션",
                t: "OWASP Top 10 for LLM Application 2025",
              },
              { k: "취약한 접근 통제", t: "OWASP Top 10:2021" },
            ],
            [
              { k: "WAAP", t: "WAAP(Web Application and API Protection)" },
              "웹 방화벽",
              { k: "시큐어 코딩", t: "시큐어 코딩(Secure Coding)" },
              { k: "OAuth 2.0", t: "OAuth(Open Authorize) 2.0" },
              { k: "SW난독화", t: "SW난독화" },
            ],
            [
              { k: "DevSecOps", t: "DevSecOps" },
              { k: "위협 모델링", t: "위협 모델링(Threat Modeling)" },
              { k: "SSDF", t: "Secure Software Development Framework(SSDF)" },
              "모의해킹·취약점 점검",
            ],
          ],
          en: "Application",
        },
        {
          name: "데이터",
          cells: [
            [
              "정보 유출",
              "데이터 위·변조",
              "내부자 위협",
              "민감정보 추론",
              "불법유통",
            ],
            [
              "DB암호화",
              "DLP",
              { k: "가명처리", t: "가명처리(Pseudonymization) 기법" },
              { k: "동형 암호", t: "동형 암호(Homomorphic Encryption)" },
              { k: "DRM", t: "DRM(Digital Right Management)" },
              {
                k: "디지털 워터마킹",
                t: "디지털 워터마킹(Digital Watermarking)",
              },
            ],
            [
              {
                k: "개인정보 영향평가",
                t: "개인정보 영향평가(Privacy Impact Assessment)",
              },
              { k: "가명정보 처리 가이드라인", t: "가명정보 처리 가이드라인" },
              "추가정보 분리",
              "접근권한 분리",
            ],
          ],
          en: "Database",
        },
        {
          name: "시스템",
          cells: [
            [
              { k: "루트킷", t: "루트킷(Rootkit)" },
              { k: "BPF Door", t: "BPF(Berkeley Packet Filter) Door" },
              "권한상승",
              { k: "하이퍼바이저 감염", t: "클라우드 컴퓨팅 취약점, 대응기술" },
              "보안 설정 오류",
            ],
            [
              "Secure OS",
              {
                k: "CWPP·CSPM",
                t: "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)",
              },
              { k: "기밀컴퓨팅", t: "기밀컴퓨팅(Confidential Computing)" },
              "VMI",
              "Secure Boot",
            ],
            [
              { k: "최소 권한 부여", t: "접근 제어/접근 통제(Access Control)" },
              "최신 보안 패치",
              "정기적 보안 점검",
              { k: "ISO 27017", t: "ISO 27017" },
            ],
          ],
          en: "Server · OS · Cloud",
        },
        {
          name: "네트워크",
          cells: [
            [
              { k: "DDoS", t: "DoS(Denial of Service)" },
              { k: "DRDoS", t: "DRDoS(Distributed Reflection DoS)" },
              { k: "스니핑·스푸핑", t: "스니핑(Sniffing) & 스푸핑(Spoofing)" },
              {
                k: "DNS 캐시 포이즈닝",
                t: "DNSSEC(Domain Name System Security Extension)",
              },
              "MITM",
            ],
            [
              { k: "IPSec", t: "IPSec" },
              { k: "VPN", t: "VPN(Virtual Private Network)" },
              { k: "TLS/SSL", t: "TLS/SSL(Secure Socket Layer)" },
              { k: "DNS 싱크홀", t: "DNS 싱크홀(Sinkhole)" },
              "IDS·IPS",
              "NAC",
            ],
            [
              "망분리",
              { k: "SDP", t: "SDP(Software Defined Perimeter)" },
              { k: "SASE", t: "SASE(Secure Access Service Edge)" },
              { k: "국가 망 보안체계", t: "국가 망 보안체계(N2SF)" },
            ],
          ],
          en: "Network",
        },
        {
          name: "물리·환경",
          cells: [
            [
              { k: "부채널 공격", t: "부채널 공격(Side Channel Attack)" },
              "디바이스 물리적 침해",
              "자연재해 위협",
              "센서 신호 방해",
            ],
            ["TEMPEST", "마스킹 기법", "물리적 접근 제어", "배터리·전원이중화"],
            ["출입 통제", "반출입 통제", "사이버 복구 계획", "보험"],
          ],
          en: "Facility",
        },
      ],
      all: {
        name: "통합 보안 (전 계층)",
        chips: [
          {
            k: "차세대 SIEM",
            t: "차세대 SIEM(Security Information and Event Management)",
          },
          { k: "XDR", t: "XDR(eXtended Detection Response)" },
          "SOAR",
          { k: "위협 헌팅", t: "위협 헌팅(Threat Hunting)" },
          {
            k: "공격 표면 관리",
            t: "공격 표면 관리(Attack Surface Management)",
          },
          { k: "제로 트러스트", t: "제로트러스트 가이드라인 2.0" },
          { k: "ISMS-P", t: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)" },
        ],
      },
      basis:
        "APT 공격 대응 방안, 스마트 시티 보안 이슈·대응 기술(계층별), 개인정보보호 기술적 통제방안, 공격 표면 최소화 대응방안(인프라·데이터·SW·사용자 측면), DoS 대응 방법, 부채널 공격 대응 기법, 클라우드 컴퓨팅 기술·기술 외 측면 대응방안 표를 계층 × 공격·대응으로 엮음",
    },
    {
      no: 2,
      title: "암호 기술 맵 (원리 ↔ 알고리즘 ↔ 공격 ↔ 응용)",
      sub: "암호 계열마다 기반 난제·대표 알고리즘·공격과 쓰임새를 한 줄로 이음",
      rowHead: "암호 계열",
      cols: [
        { name: "설계 원리·난제", tone: "violet" },
        { name: "대표 알고리즘·모드", tone: "blue" },
        { name: "공격·안전성", tone: "red" },
        { name: "응용", tone: "green" },
      ],
      rows: [
        {
          name: "대칭키 (블록·스트림)",
          cells: [
            [
              { k: "Shannon", t: "Shannon의 암호 설계 원칙" },
              "혼돈·확산",
              "SPN",
              "Feistel",
            ],
            [
              { k: "블록 암호화", t: "블록 암호화(Block Cipher)" },
              "AES·ARIA",
              "DES·SEED",
              "CBC·CTR",
            ],
            [
              {
                k: "암호 분석 공격",
                t: "암호 분석 공격(Cryptanalysis Attacks) 기법",
              },
              "KPA·CPA",
              "그로버 알고리즘",
              "커크호프의 원칙",
            ],
            [
              { k: "암호화", t: "암호화(Encryption)" },
              "AES-256",
              "DB암호화",
              "경량 암호화",
            ],
          ],
          en: "Symmetric",
        },
        {
          name: "공개키 (비대칭)",
          cells: [
            [
              "인수분해",
              "이산대수",
              {
                k: "디피-헬만",
                t: "디피-헬만 알고리즘(Diffie-Hellman Algorithm)",
              },
              "타원곡선",
            ],
            ["RSA", "DSA", "ECDH", "IKE"],
            [
              "쇼어 알고리즘",
              { k: "보안 강도", t: "암호학적 보안 강도(Security Strength)" },
              "RSA 3072",
              "선택 암호문 공격",
            ],
            [
              { k: "전자봉투", t: "전자봉투(Digital Envelope)" },
              { k: "이중 서명", t: "이중 서명(Dual Signature)" },
              { k: "TLS/SSL", t: "TLS/SSL(Secure Socket Layer)" },
              "PKI",
            ],
          ],
          en: "Asymmetric",
        },
        {
          name: "해시 (단방향)",
          cells: [
            [
              { k: "해시 함수의 안전성", t: "해시 함수의 안전성" },
              "역상 저항성",
              "충돌 저항성",
            ],
            ["SHA-2", "HMAC", "MD-5", "CMAC·GMAC"],
            ["Rainbow table attack", "Brute force attack", "제2역상 공격"],
            [
              {
                k: "솔트·키 스트레칭",
                t: "해시 솔트(Salt)와 키 스트레칭(Key Stretching)",
              },
              "메시지 다이제스트",
              "직전 블록 해시값",
              {
                k: "DNSSEC",
                t: "DNSSEC(Domain Name System Security Extension)",
              },
            ],
          ],
          en: "Hash",
        },
        {
          name: "양자 (QKD·PQC)",
          cells: [
            ["양자 중첩·양자 얽힘", "불확정성", "격자기반", "코드기반"],
            [
              { k: "양자 암호", t: "양자 암호(Quantum Cryptography)" },
              "BB84",
              {
                k: "포스트 양자 암호",
                t: "포스트 양자 암호(Post-Quantum Cryptography)",
              },
              "SPHINCS",
            ],
            ["쇼어 알고리즘", "그로버 알고리즘", "도청공격"],
            ["양자 키 분배", "QRNG", "양자암호통신 채널"],
          ],
          en: "Quantum",
        },
        {
          name: "연산 보존 (계산 가능)",
          cells: [
            [
              { k: "동형 암호", t: "동형 암호(Homomorphic Encryption)" },
              "부트스트래핑",
              "비밀 분산",
              "영지식성",
            ],
            [
              "완전 동형",
              "Gen09",
              { k: "영지식증명", t: "영지식증명(Zero Knowledge Proof)" },
              "다자간 컴퓨팅",
            ],
            ["완전성·건전성", "노이즈 증가", "재전송 공격"],
            [
              { k: "PEC", t: "PEC(Privacy-Enhancing Computation)" },
              { k: "블록체인 암호기술", t: "블록체인 암호기술 가이드라인" },
              { k: "다중 서명", t: "다중 서명(Multi Signature)" },
              "Zcash·Monero",
            ],
          ],
          en: "Computation",
        },
      ],
      all: {
        name: "키 관리·사용 기준",
        chips: [
          "키 관리",
          "암호 키 길이",
          "초기화 벡터(IV)·논스",
          "112비트",
          "암호모듈 검증",
        ],
      },
      basis:
        "암호화의 종류(정보단위·키 형태·기반기술) 표, Shannon 대전압불확, 블록 암호화 운영 모드, 암호 분석 공격 4유형, 해시함수 속성, 보안 강도별 암호 알고리즘 비교, 양자 컴퓨터 공격 기법·PQC 유형, 동형 암호 유형, 블록체인 주요 암호 기술 표",
    },
    {
      no: 3,
      title: "인증·접근 통제 맵 (원리 ↔ 구현 ↔ 위협)",
      sub: "식별·인증부터 인가·접근 통제·제로 트러스트까지 원리와 구현·위협을 대응",
      rowHead: "보안 서비스",
      cols: [
        { name: "핵심 원리·모델", tone: "violet" },
        { name: "구현 기술·구성요소", tone: "blue" },
        { name: "위협·한계", tone: "red" },
      ],
      rows: [
        {
          name: "식별·인증",
          cells: [
            ["다중 요소 인증", "Passwordless", "보편성·유일성·영구성"],
            [
              { k: "패스키", t: "패스키(Passkey)" },
              { k: "생체 인증", t: "생체 인증(텔레바이오 인증)" },
              "Authenticator",
              { k: "간편인증", t: "간편인증 인터페이스 가이드라인" },
              "i-PIN",
            ],
            [
              "크리덴셜 스터핑",
              "신원 사칭/위장",
              "FAR·FRR",
              { k: "딥보이스", t: "딥보이스(Deep Voice) 피싱" },
            ],
          ],
          en: "Authentication",
        },
        {
          name: "전자서명·부인방지",
          cells: [
            ["전자서명", "부인방지", "메시지 다이제스트", "연접"],
            [
              { k: "전자봉투", t: "전자봉투(Digital Envelope)" },
              { k: "이중 서명", t: "이중 서명(Dual Signature)" },
              { k: "다중 서명", t: "다중 서명(Multi Signature)" },
              "DKIM",
            ],
            ["위·변조", "재전송 공격", "이메일 스푸핑"],
          ],
          en: "Signature",
        },
        {
          name: "권한 위임·인가",
          cells: [
            ["권한 위임", "Authorization Code", "Client Credentials"],
            [
              { k: "OAuth 2.0", t: "OAuth(Open Authorize) 2.0" },
              "액세스 토큰",
              "리프레시 토큰",
              "SAML",
              "JSON Web Token",
            ],
            ["세션 탈취", "토큰 노출", "식별 및 인증 실패"],
          ],
          en: "Authorization",
        },
        {
          name: "접근 통제",
          cells: [
            ["주체·객체·권한", "최소 권한 부여", "직무 분리"],
            [
              { k: "접근 제어", t: "접근 제어/접근 통제(Access Control)" },
              "MAC·DAC·RBAC·ABAC",
              { k: "접근 통제 모델", t: "접근 통제 모델" },
              "Bell-LaPadula·BIBA",
              "만리장성",
            ],
            [
              { k: "취약한 접근 통제", t: "OWASP Top 10:2021" },
              "권한상승",
              "이익 충돌 방지",
            ],
          ],
          en: "Access Control",
        },
        {
          name: "제로 트러스트",
          cells: [
            ["지속적 검증", "선 인증·후 연결", "과립형 경계", "정책 기반 접근"],
            [
              { k: "제로트러스트", t: "제로트러스트 가이드라인 2.0" },
              { k: "SDP", t: "SDP(Software Defined Perimeter)" },
              "PDP·PEP",
              "ZTNA",
              "Micro-Segmentation",
            ],
            ["경계 보안", "Inner Trust 모델", "블랙리스트"],
          ],
          en: "Zero Trust",
        },
        {
          name: "콘텐츠 보호",
          cells: [
            ["비가시성·견조성", "구매자 정보 삽입", "불법복제 방지"],
            [
              { k: "DRM", t: "DRM(Digital Right Management)" },
              {
                k: "디지털 워터마킹",
                t: "디지털 워터마킹(Digital Watermarking)",
              },
              { k: "핑거프린팅", t: "핑거프린팅(Fingerprinting)" },
              "클리어링 하우스",
              "XrML",
            ],
            ["공모공격", "평균화 공격", "Mosaic Attack", "Filtering Attack"],
          ],
          en: "Content",
        },
      ],
      all: {
        name: "AAA 공통 기반",
        chips: [
          "PKI",
          "IAM",
          "ID 관리 시스템",
          "Agent ID",
          "다중 인증 및 최소 권한 부여",
        ],
      },
      basis:
        "패스키·OAuth 2.0 구성요소, 생체 유형·측정 지표, 전자봉투 송수신 절차, 이중 서명 암호화 단계, 접근 통제 정책 비교(MAC·DAC·RBAC·ABAC)·접근 통제 모델 비교, 제로 트러스트 Framework·SDP 구성 요소, DRM 기술 요소, 워터마킹·핑거프린팅 공격 기법 표",
    },
    {
      no: 4,
      title: "공격 단계별 위협 대응 맵 (공격 ↔ 탐지 ↔ 대응)",
      sub: "침투에서 사후 분석까지 공격 흐름마다 탐지·분석과 대응·복구 기술을 정리",
      rowHead: "공격 단계",
      cols: [
        { name: "공격 기법", tone: "red" },
        { name: "탐지·분석", tone: "amber" },
        { name: "대응·복구", tone: "green" },
      ],
      rows: [
        {
          name: "정찰·침투",
          cells: [
            [
              { k: "APT 공격", t: "APT(Advanced Persistent Threat) 공격" },
              { k: "공급망 공격", t: "공급망 공격(Supply Chain Attack)" },
              {
                k: "드라이브 바이 다운로드",
                t: "드라이브 바이 다운로드(Drive By Download)",
              },
              "제로데이 취약점",
              "사회공학",
            ],
            [
              {
                k: "공격 표면 관리",
                t: "공격 표면 관리(Attack Surface Management)",
              },
              "EASM",
              "OSINT·다크웹",
              "평판분석",
            ],
            ["망분리", "SBOM 관리", "SW 최신 유지", "업데이트 시 무결성 검증"],
          ],
          en: "Incursion",
        },
        {
          name: "설치·은닉",
          cells: [
            [
              { k: "루트킷", t: "루트킷(Rootkit)" },
              { k: "BPF Door", t: "BPF(Berkeley Packet Filter) Door" },
              "부트킷",
              "프로세스 위장",
              "백도어",
            ],
            [
              { k: "EDR", t: "EDR(Endpoint Detection and Response)" },
              "IOC",
              { k: "사이버 디셉션", t: "사이버 디셉션(Cyber Deception)" },
              "허니팟",
              "행위분석",
            ],
            [
              "최소권한 원칙",
              "화이트리스트 기반관리",
              "Secure Boot",
              "레드팀/블루팀 테스트",
            ],
          ],
          en: "Persistence",
        },
        {
          name: "확산·제어",
          cells: [
            [
              "C&C서버",
              "권한상승",
              { k: "스니핑·스푸핑", t: "스니핑(Sniffing) & 스푸핑(Spoofing)" },
              "ARP 스푸핑",
            ],
            [
              { k: "위협 헌팅", t: "위협 헌팅(Threat Hunting)" },
              { k: "XDR", t: "XDR(eXtended Detection Response)" },
              {
                k: "차세대 SIEM",
                t: "차세대 SIEM(Security Information and Event Management)",
              },
              "UEBA",
              "Cyber Kill Chain",
            ],
            [
              { k: "DNS 싱크홀", t: "DNS 싱크홀(Sinkhole)" },
              "Endpoint Isolation",
              "Network Segmentation",
              "SOAR",
            ],
          ],
          en: "Lateral · C2",
        },
        {
          name: "유출·파괴",
          cells: [
            [
              { k: "랜섬웨어", t: "RaaS(Ransomware as a Service)" },
              { k: "사이버전", t: "사이버전(Cyber Warfare)" },
              "기밀 데이터 유출",
              "SW·HW 손상",
            ],
            [
              "DLP",
              "Log 시계열 분석",
              { k: "사이버 게놈", t: "사이버 게놈(Cyber genome)" },
              "ATT&CK 매핑",
            ],
            [
              "백업 수행",
              {
                k: "사이버 레질리언스",
                t: "사이버 레질리언스(Cyber Resilience)",
              },
              {
                k: "디지털 면역 시스템",
                t: "디지털 면역 시스템(DIS, Digital Immune System)",
              },
              "사이버 복구 계획",
            ],
          ],
          en: "Exfiltration",
        },
        {
          name: "서비스 거부",
          cells: [
            [
              { k: "DoS", t: "DoS(Denial of Service)" },
              { k: "DRDoS", t: "DRDoS(Distributed Reflection DoS)" },
              "SYN Flooding",
              "HashDoS",
              "반사·증폭",
            ],
            ["IDS·IPS", "공격 인지", "공격 유형 파악", "L7 스위치"],
            [
              "Sink Hole",
              "CAR 기능",
              "Load Balancing",
              { k: "WAAP", t: "WAAP(Web Application and API Protection)" },
              "Anti-DDoS",
            ],
          ],
          en: "Availability",
        },
        {
          name: "사후 분석",
          cells: [
            [
              { k: "안티 포렌식", t: "안티 포렌식(Anti-forensic)" },
              "와이핑",
              "스테가노그래피",
              "슬랙공간 은닉",
            ],
            [
              { k: "디지털 포렌식", t: "디지털 포렌식(Digital Forensic)" },
              { k: "클라우드 포렌식", t: "클라우드 포렌식(Cloud Forensic)" },
              "Staganalysis",
              "TimeLine분석",
            ],
            [
              "연계보관의 원칙",
              { k: "e-Discovery", t: "전자증거개시제도(e-Discovery)" },
              "증거물 획득",
              "보고서 작성",
            ],
          ],
          en: "Forensics",
        },
      ],
      all: {
        name: "관제 공통",
        chips: [
          "TIP",
          "MTTD·MTTR",
          "플레이북",
          "보안 전담 조직",
          { k: "위협 모델링", t: "위협 모델링(Threat Modeling)" },
        ],
      },
      basis:
        "APT 공격 절차와 기법·대응 방안, 루트킷 침투 매커니즘, BPF Door Attack Flow, DoS 대응 절차·방법, DRDoS 공격 절차, XDR 동작 절차, 위협 헌팅 요소, 포렌식 절차[수증보분보]·안티포렌식 대응기술 표",
    },
    {
      no: 5,
      title: "개인정보 생애주기 보호 맵 (원칙 ↔ 기술 ↔ 제도)",
      sub: "기획부터 파기까지 처리 단계별로 지킬 원칙·보호 기술·제도를 묶음",
      rowHead: "처리 단계",
      cols: [
        { name: "원칙·요구사항", tone: "violet" },
        { name: "보호 기술", tone: "teal" },
        { name: "제도·표준·지침", tone: "slate" },
      ],
      rows: [
        {
          name: "기획·설계",
          cells: [
            [
              "사전예방",
              "기본값 설정",
              "프라이버시 보호를 내재한 설계",
              "포지티브섬",
            ],
            [
              { k: "PbD", t: "개인정보보호 중심 설계(Privacy by Design)" },
              "8대 전략",
              "최소화·숨기기·분리·총계화",
              "처리 흐름도",
            ],
            [
              {
                k: "Privacy By Design 인증제도",
                t: "PbD(Privacy by Design) 인증제도",
              },
              {
                k: "개인정보 영향평가",
                t: "개인정보 영향평가(Privacy Impact Assessment)",
              },
              "ISO 31700",
              { k: "ISO 27701", t: "ISO 27701" },
            ],
          ],
          en: "Design",
        },
        {
          name: "수집",
          cells: [
            [
              { k: "수집 제한", t: "개인정보 프라이버시 8원칙" },
              "목적 명확화",
              "적법성",
              "비례성",
            ],
            [
              { k: "정책협상 기술", t: "개인정보 보호기술" },
              "쿠키관리",
              "P3P",
              "익명화",
            ],
            [
              { k: "생체정보 보호 안내서", t: "생체정보 보호 안내서(24.12)" },
              "개인정보보호법 제3조",
              { k: "ISO 27018", t: "ISO 27018" },
            ],
          ],
          en: "Collection",
        },
        {
          name: "이용·제공",
          cells: [
            ["이용 제한", "목적제한", "데이터 최소화"],
            [
              { k: "가명처리", t: "가명처리(Pseudonymization) 기법" },
              "차분 프라이버시",
              "K-익명성·L-다양성",
              "재현데이터",
              "형태보존 암호화",
            ],
            [
              { k: "가명정보 처리 가이드라인", t: "가명정보 처리 가이드라인" },
              { k: "ISO/IEC 20889", t: "ISO/IEC 20889" },
              { k: "AI 프라이버시 리스크", t: "AI 프라이버시 리스크 관리" },
            ],
          ],
          en: "Use",
        },
        {
          name: "보관·결합·분석",
          cells: [
            ["안전성 확보", "추가정보 분리", "원본정보 보관 시 분리보관"],
            [
              { k: "PEC", t: "PEC(Privacy-Enhancing Computation)" },
              { k: "동형 암호", t: "동형 암호(Homomorphic Encryption)" },
              { k: "영지식증명", t: "영지식증명(Zero Knowledge Proof)" },
              { k: "기밀컴퓨팅", t: "기밀컴퓨팅(Confidential Computing)" },
              "연합학습",
            ],
            [
              "결합신청",
              {
                k: "ISMS-P",
                t: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)",
              },
              "DB암호화 솔루션",
            ],
          ],
          en: "Storage",
        },
        {
          name: "파기·권리 보장",
          cells: [
            ["개인 참가", "통제권보장", "투명성", "책임"],
            ["중요정보 완전 삭제", "생체인식정보의 파기", "익명화"],
            [
              "가명처리 정지",
              "열람·정정·삭제·처리정지 요구",
              "개인정보 처리방침 공개",
            ],
          ],
          en: "Disposal",
        },
      ],
      all: {
        name: "전 단계 공통",
        chips: [
          "개인정보보호 책임자 임명",
          "개인정보 처리단계별 요구사항",
          "프라이버시 강화 기술 적용",
          "개인정보취급자 관리·감독",
        ],
      },
      basis:
        "PbD 7대 기본 원칙·8대 전략, 프라이버시 8원칙과 개인정보보호법 비교, 개인정보 보호기술 종류, 가명 처리 기법·가명정보 결합 절차, 비식별조치 표준 기법·프라이버시 보호 모델(ISO/IEC 20889), PEC 유형별 주요 기술, 생체인식정보 보호조치 5단계 표",
    },
    {
      no: 6,
      title: "보안 관리체계·인증 제도 맵 (근거 ↔ 기준 ↔ 대상)",
      sub: "국내외 인증·평가·표준을 법적 근거와 핵심 기준·적용 대상으로 비교",
      rowHead: "제도·표준",
      cols: [
        { name: "근거·표준", tone: "slate" },
        { name: "핵심 기준·구성", tone: "blue" },
        { name: "대상·절차·등급", tone: "green" },
      ],
      rows: [
        {
          name: "관리체계 인증",
          cells: [
            [
              {
                k: "ISMS-P",
                t: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)",
              },
              "정보통신망법 제47조",
              "개인정보보호법 제32조의2",
            ],
            [
              "관리체계 수립 및 운영",
              "보호대책 요구사항",
              "개인정보 처리단계별 요구사항",
            ],
            ["PDCA", "위험 관리", "점검 및 개선"],
          ],
          en: "ISMS-P",
        },
        {
          name: "위험 분석",
          cells: [
            [
              {
                k: "위험분석 방법론",
                t: "위험분석 방법론 (ISO/IEC 1335-1, 위험분석 전략/평가)",
              },
              "ISO/IEC 1335-1",
            ],
            [
              "베이스라인 접근법",
              "비정형 접근법",
              "상세 위험 분석",
              "복합 접근법",
            ],
            ["정성적 평가", "정량적 평가", "연간 예상 손실"],
          ],
          en: "Risk",
        },
        {
          name: "제품 평가",
          cells: [
            [
              {
                k: "CC 평가·인증",
                t: "정보보호제품 평가·인증(CC 평가·인증) 제도",
              },
              "ISO 15408",
              "지능정보화기본법 58조",
            ],
            ["PP·ST·TOE", "보안 기능 요구사항", "보안 보증 요구사항"],
            ["EAL1~7", "CCRA", "유효기간"],
          ],
          en: "CC",
        },
        {
          name: "개인정보·공시",
          cells: [
            [
              {
                k: "개인정보 영향평가",
                t: "개인정보 영향평가(Privacy Impact Assessment)",
              },
              { k: "정보보호 공시제도", t: "정보보호 공시제도" },
              "개인정보 보호법 제33조",
            ],
            ["5만·50만·100만", "투자 현황·인력 현황", "CISO/CPO 지정 현황"],
            ["사전준비단계", "영향평가 수행단계", "이행 단계", "3,000억원"],
          ],
          en: "PIA",
        },
        {
          name: "클라우드·프라이버시 표준",
          cells: [
            [
              { k: "ISO 27017", t: "ISO 27017" },
              { k: "ISO 27018", t: "ISO 27018" },
              { k: "ISO 27701", t: "ISO 27701" },
              "ISO 27001",
            ],
            ["클라우드 서비스 정보보호 통제", "PII", "PIMS"],
            ["멀티 테넌트", "PII 통제자", "PII 처리자"],
          ],
          en: "ISO 27k",
        },
        {
          name: "산업·차량·국방",
          cells: [
            [
              { k: "IEC 62443", t: "IEC 62443" },
              { k: "ISO 21434", t: "차량 사이버 보안 국제 표준(ISO 21434)" },
              {
                k: "CMMC",
                t: "사이버 보안 성숙도 모델 인증(CMMC, Cybersecurity Maturity Model Certification)",
              },
              "NIST SP 800-171",
            ],
            [
              "7 FR",
              "위험 분석 및 위험 평가 방법",
              "사이버 보안 활동 프로세스",
            ],
            ["IACS", "CMMC 2.0 단계", "제3자 평가"],
          ],
          en: "OT · Auto · Defense",
        },
        {
          name: "공공·법적 대응",
          cells: [
            [
              { k: "국가 망 보안체계", t: "국가 망 보안체계(N2SF)" },
              { k: "제로트러스트", t: "제로트러스트 가이드라인 2.0" },
              { k: "e-Discovery", t: "전자증거개시제도(e-Discovery)" },
            ],
            ["C/S/O 등급분류", "성숙도 모델", "EDRM"],
            ["적절성 평가·조정", "4단계: 최적화 단계", "ESI"],
          ],
          en: "Public · Legal",
        },
      ],
      basis:
        "ISMS-P 법적 근거·인증 기준 세부 항목, 위험분석 접근법(ISO/IEC 1335-1)·위험 평가 방법, CC Part 구성·국내외 평가·인증 비교, 개인정보 영향평가 대상·PIA 수행 절차, 정보보호 공시 대상·항목, ISO 27017·27018·27701 구성, IEC 62443 7 FR, ISO/SAE 21434 구성, CMMC 2.0 단계, N2SF 적용 절차 표",
    },
    {
      no: 7,
      title: "시큐어 SW 개발 맵 (약점 ↔ 보안 활동 ↔ 기준)",
      sub: "개발 생명주기 단계별 약점과 보안 활동·준거 기준을 연결",
      rowHead: "개발 단계",
      cols: [
        { name: "주요 약점·위협", tone: "red" },
        { name: "보안 활동·기법", tone: "amber" },
        { name: "기준·도구", tone: "blue" },
      ],
      rows: [
        {
          name: "요구·설계",
          cells: [
            ["안전하지 않은 설계", "위협 모델링 누락", "신뢰 경계"],
            [
              { k: "위협 모델링", t: "위협 모델링(Threat Modeling)" },
              "STRIDE",
              "DREAD",
              "PASTA",
            ],
            [
              { k: "SSDF", t: "Secure Software Development Framework(SSDF)" },
              "조직 준비(PO)",
              "DFD",
            ],
          ],
          en: "Design",
        },
        {
          name: "구현",
          cells: [
            [
              "인젝션",
              { k: "SSRF", t: "SSRF(Server-Side Request Forgery)" },
              "하드코드 정보",
              "경쟁조건(TOCTOU)",
              "API 오용",
            ],
            [
              { k: "시큐어 코딩", t: "시큐어 코딩(Secure Coding)" },
              "입력값 검증",
              "One Time Token",
              "에러 처리",
            ],
            [
              { k: "OWASP Top 10:2021", t: "OWASP Top 10:2021" },
              "입보시에코캡A",
              "보호함수",
            ],
          ],
          en: "Coding",
        },
        {
          name: "빌드·배포",
          cells: [
            [
              "소프트웨어 공급망 실패",
              { k: "공급망 공격", t: "공급망 공격(Supply Chain Attack)" },
              "악성 업데이트",
            ],
            [
              "무결성 검증",
              "코드 서명",
              { k: "SW난독화", t: "SW난독화" },
              "SBOM",
            ],
            [{ k: "DevSecOps", t: "DevSecOps" }, "CI/CD", "Security as Code"],
          ],
          en: "Build · Release",
        },
        {
          name: "테스트·검증",
          cells: [
            ["보안 설정 오류", "취약하고 오래된 컴포넌트"],
            [
              "모의해킹",
              "레드 팀",
              "카오스 엔지니어링",
              "인공지능 증강 테스팅",
            ],
            ["보안 점검 도구", "보안코드 품질", "커버리지 자동화"],
          ],
          en: "Test",
        },
        {
          name: "운영·대응",
          cells: [
            ["로깅·경고 실패", "예외적 조건의 오처리", "상세 오류 노출"],
            ["취약점 대응(RV)", "근본 원인 분석", "지속적 모니터링"],
            [
              { k: "OWASP Top 10:2025", t: "OWASP Top 10:2025" },
              { k: "WAAP", t: "WAAP(Web Application and API Protection)" },
              "CVSS·CWE",
            ],
          ],
          en: "Operation",
        },
      ],
      basis:
        "위협 모델링 기법(STRIDE·DREAD·PASTA)·DFD 구성 요소, 시큐어 코딩 7대 항목, OWASP Top 10:2021·2025, SSRF 공격 유형과 대응, SSDF 구성과 단계, DevSecOps 구현 요소·도구, SW 난독화 분류, 디지털 면역 시스템 6가지 조건 표",
    },
    {
      no: 8,
      title: "융합·신기술 보안 맵 (환경 ↔ 위협 ↔ 대응)",
      sub: "클라우드·자율주행·스마트시티·AI 등 융합 환경별 위협과 대응·표준",
      rowHead: "융합 환경",
      cols: [
        { name: "보안 위협", tone: "red" },
        { name: "대응 기술", tone: "amber" },
        { name: "표준·가이드", tone: "blue" },
      ],
      rows: [
        {
          name: "클라우드",
          cells: [
            [
              { k: "하이퍼바이저 감염", t: "클라우드 컴퓨팅 취약점, 대응기술" },
              "vMotion",
              "멀티테넌시",
              "사업자 종속",
            ],
            [
              {
                k: "CWPP·CSPM",
                t: "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)",
              },
              "VMI",
              { k: "SECaaS", t: "SECaaS(Security as a Service)" },
              { k: "SASE", t: "SASE(Secure Access Service Edge)" },
            ],
            [
              { k: "ISO 27017", t: "ISO 27017" },
              "클라우드SLA",
              { k: "클라우드 포렌식", t: "클라우드 포렌식(Cloud Forensic)" },
            ],
          ],
          en: "Cloud",
        },
        {
          name: "자율주행차",
          cells: [
            [
              { k: "CAN 위변조", t: "자율주행 자동차 보안취약점 및 대응방안" },
              "펌웨어 변조",
              "원격제어 해킹",
            ],
            ["Secure Boot", "SecOC", "HSM", "WAVE 통신 보안"],
            [
              { k: "ISO 21434", t: "차량 사이버 보안 국제 표준(ISO 21434)" },
              "취약점점검",
              "위험도검토",
            ],
          ],
          en: "Vehicle",
        },
        {
          name: "스마트시티·팩토리",
          cells: [
            [
              { k: "센서 신호 방해", t: "스마트시티 보안취약점 및 대응방안" },
              { k: "PLC", t: "스마트팩토리 보안취약점 및 대응방안" },
              "디바이스 물리적 침해",
              "공급망 위협",
            ],
            ["경량 암호화", "DTLS/TLS", "일방향 통신망", "포트락"],
            [
              { k: "IEC 62443", t: "IEC 62443" },
              "보안요구사항 매핑",
              "보안아키텍처 적용",
            ],
          ],
          en: "City · Factory",
        },
        {
          name: "디지털 트윈",
          cells: [
            [
              {
                k: "위·변조된 데이터 학습",
                t: "디지털 트윈(Digital Twin)의 보안 취약점 및 대응방안",
              },
              "AI 시스템 권한 탈취",
              "센서 조작",
            ],
            ["제로 트러스트 아키텍처", "AIOps", "PETs"],
            ["생성·전달·종합과 분석", "보안교육 및 정책"],
          ],
          en: "Digital Twin",
        },
        {
          name: "블록체인",
          cells: [
            ["재전송 공격", "스마트 컨트랙트", "거래 변조"],
            [
              { k: "다중 서명", t: "다중 서명(Multi Signature)" },
              "임계 서명",
              "환 서명",
              "영지식 증명",
            ],
            [
              {
                k: "블록체인 암호기술 가이드라인",
                t: "블록체인 암호기술 가이드라인",
              },
              "암호모듈 검증",
              "합의 프로토콜",
            ],
          ],
          en: "Blockchain",
        },
        {
          name: "생성형 AI·LLM",
          cells: [
            [
              {
                k: "프롬프트 인젝션",
                t: "OWASP Top 10 for LLM Application 2025",
              },
              { k: "딥보이스", t: "딥보이스(Deep Voice) 피싱" },
              "데이터 및 모델 중독",
              "학습데이터 암기",
            ],
            [
              "입력 데이터 정제",
              "차분 프라이버시",
              "레드 팀",
              "합성콘텐츠 탐지",
            ],
            [
              "OWASP LLM Top 10",
              {
                k: "AI 프라이버시 리스크 관리",
                t: "AI 프라이버시 리스크 관리",
              },
              "개인정보 영향평가",
            ],
          ],
          en: "LLM",
        },
        {
          name: "AI 에이전트",
          cells: [
            [
              {
                k: "메모리 오염",
                t: "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)",
              },
              { k: "도구오용", t: "AI Agent 보안위협" },
              "연쇄 환각 공격",
              "인간 개입 무력화",
            ],
            [
              "세션 기반 메모리 격리",
              "도구 허용목록",
              "Human-in-the-loop",
              "변조 불가 로그",
            ],
            ["Agentic AI 위협 15종", "최소 권한 원칙", "Agent ID"],
          ],
          en: "Agentic AI",
        },
      ],
      all: {
        name: "공공 적용 기반",
        chips: [
          { k: "국가 망 보안체계", t: "국가 망 보안체계(N2SF)" },
          "C/S/O 등급분류",
          {
            k: "제로트러스트 가이드라인 2.0",
            t: "제로트러스트 가이드라인 2.0",
          },
          { k: "PEC", t: "PEC(Privacy-Enhancing Computation)" },
        ],
      },
      basis:
        "클라우드 기술·기술 외 측면 위협·대응방안, 자율주행 구간별 보안 위협·대응 보안 기술, 스마트 시티 보안 이슈·대응 기술, 스마트팩토리 보안 취약점 및 대응 방안, 디지털 트윈 프로세스별 위협·대응, 블록체인 주요 암호 기술, OWASP LLM Top 10·Agentic AI 위협 15종·AI Agent 단계별 통제 표",
    },
  ],
  DX: [
    {
      no: 1,
      title: "에이전틱 커머스 계층 맵 (프로토콜 ↔ 구성요소 ↔ 신뢰)",
      sub: "AI 에이전트 상거래를 접점부터 정산·실행 기반까지 계층별로 엮어 정리",
      rowHead: "상거래 계층",
      cols: [
        { name: "표준·프로토콜", tone: "violet" },
        { name: "구성요소·기술", tone: "blue" },
        { name: "보안·신뢰", tone: "teal" },
      ],
      rows: [
        {
          name: "소비자 접점",
          en: "Consumer Surfaces",
          cells: [
            [
              { k: "UCP", t: "UCP(Universal Commerce Protocol)" },
              "AI Mode",
              "Gemini",
            ],
            ["대화형 구매", "시각 커머스", "Shopping Service"],
            ["Identity Linking", "OAuth 2.0"],
          ],
        },
        {
          name: "에이전트 연동",
          en: "Transport",
          cells: [
            [{ k: "AP2", t: "AP2(Agent Payment Protocol)" }, "A2A", "MCP"],
            ["사용자 에이전트", "REST API", "JSON RPC"],
            ["Intent Mandate", "Verifiable Credential"],
          ],
        },
        {
          name: "주문·체크아웃",
          en: "Checkout",
          cells: [
            [
              { k: "ACP", t: "ACP(Agentic Commerce Protocol)" },
              { k: "UCP", t: "UCP(Universal Commerce Protocol)" },
            ],
            ["Checkout", "Order", "4개 REST 엔드포인트"],
            ["Cart Mandate", "API버전헤더", "HTTPS"],
          ],
        },
        {
          name: "결제·자격증명",
          en: "Payment",
          cells: [
            [
              { k: "AP2", t: "AP2(Agent Payment Protocol)" },
              "x402 Protocol",
              "A2A",
            ],
            ["Token Exchange", "Delegated Payment", "자격증명 제공자"],
            ["Payment Mandate", "Shared Payment Token", "PCI-DSS"],
          ],
        },
        {
          name: "정산·디지털 화폐",
          en: "Settlement",
          cells: [
            [
              { k: "스테이블 코인", t: "스테이블 코인(Stable coin)" },
              "법정화폐 담보형",
              "무담보 알고리즘형",
            ],
            ["Smart Contract", "발행(Mint)·소각(Burn)", "Banking Service"],
            ["Proof of Reserves", "Distributed Ledger", "허가 서명"],
          ],
        },
        {
          name: "실행 기반",
          en: "AI OS",
          cells: [
            [
              {
                k: "AI OS",
                t: "AI OS(Artificial Intelligence Operating System)",
              },
              "LLMCore",
              "LLMScheduler",
            ],
            ["Context Manager", "Memory Manager", "Tool Manager"],
            ["Access Manager", "컨텍스트 스위칭"],
          ],
        },
      ],
      all: {
        name: "공통 (전 계층)",
        chips: ["AI Agent", "역할기반 결제", "개방형 프로토콜", "스마트계약"],
      },
      basis:
        "AP2 역할기반 아키텍처·주요 기술요소 표, UCP 구성요소·계층 구조 표, ACP 구성요소, 스테이블 코인 유형·구성요소·발행/소각 절차, AI OS 구성요소·전통적 OS 비교",
    },
  ],
};
