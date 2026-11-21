/**
 * 토픽 안 갈래 — 교재가 토픽 안에서 나눠 둔 종류·구성(표 캡션 → 구분 → 항목). 토픽 지도에서 토픽 칩 아래에 그린다.
 *
 * 2026-11-22 "라우팅에 거리벡터 등등등 하이라키 왤케 빈약하냐" — 지도는 토픽까지만 내려가 「라우팅 알고리즘」 아래에
 * BGP 와 서브 토픽 하나뿐이었다. 교재 표에는 거리벡터(벨만-포드·RIP·IGRP) / 링크상태(다익스트라·OSPF·EIGRP)가 그대로 있다.
 *
 * 규칙
 * - 이름은 **교재 서브노트(표·키워드·정의)에 있는 말만** 쓴다 — `npx tsx scripts/check-sub-topics.ts` 가 본다(공백·줄바꿈은 떼고 견준다).
 * - 서브 토픽 이름(같은 상위면 머리 이름·별칭도)을 쓰면 그 서브 토픽 칩이 그 자리에 놓인다. 아니면 글자만 보인다(자기 화면이 없다).
 * - 여기 안 적은 그 토픽의 서브 토픽은 갈래 뒤에 그대로 붙는다. 갈래를 안 적은 토픽은 교재가 따로 정의한 하위 개념(subDefs)이 갈래가 된다.
 * - 출제 이력·답안 연결에는 쓰이지 않는다(열쇠가 아니다) — 지도에 구조만 보인다. 절차(① ② ③)는 넣지 않고 종류·구성만 넣는다.
 */
export type Inner = string | { n: string; kids: Inner[] };

export const TOPIC_INNER: Record<string, Inner[]> = {
  // ── 네트워크 ──
  "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)": [
    { n: "소스 코딩", kids: ["영상 부호화", "오디오 부호화", "고정 길이 부호화", "가변 길이 부호화", "무손실 압축 부호화", "손실 압축 부호화"] },
    "채널 코딩",
    { n: "라인 코딩", kids: ["unipolar", "polar", "bipolar"] },
  ],
  "OSI 7 Layer (ISO 7498)": [
    { n: "계층별 역할과 프로토콜", kids: ["7계층 Application", "6계층 Presentation", "5계층 Session", "4계층 Transport", { n: "3계층 Network", kids: ["IGMP"] }, "2계층 Data Link", "1계층 Physical"] },
    { n: "계층별 데이터 단위와 장비", kids: ["데이터 단위(PDU)", "중계 장비", "캡슐화/역캡슐화"] },
  ],
  "서비스 프리미티브(Service Primitive)": [
    { n: "요청 측", kids: ["요청(Request)", "확인(Confirm)"] },
    { n: "응답 측", kids: ["지시(Indication)", "응답(Response)"] },
  ],
  "PCM(Pulse-Code Modulation)": [
    { n: "송신", kids: ["표본화(Sampling)", "양자화(Quantization)", "부호화(Encoding)"] },
    { n: "수신", kids: ["재생", "복호화(Decoding)", "재구성(Filtering)"] },
    "나이퀴스트 샘플링 정리",
  ],
  "QAM(Quadrature Amplitude Modulation)": ["진폭 변조", "위상 변조", "16QAM 성상도", "계층적 변조 방식"],
  "다중화(Multiplexing)": [{ n: "다중화 종류", kids: ["FDM", "TDM", "CDM", "WDM", "SDM"] }, "다원접속(Multiple Access)"],
  "FEC(Forward Error Correction) / BEC(Backward Error Correction)": [
    {
      n: "FEC (전진 오류 정정)",
      kids: [
        { n: "블록 코드(Block Code)", kids: ["해밍 코드", "RS 코드"] },
        { n: "논블록 코드(Non-block Code)", kids: ["길쌈 코드", "터보 코드"] },
      ],
    },
    {
      n: "BEC (후진 오류 정정)",
      kids: [
        { n: "오류 검출(Error Detect)", kids: ["Parity Check", "Block Sum", "CRC", "Check Sum"] },
        { n: "재전송(Retransmission)", kids: ["ARQ(Go-Back-N·Selective Repeat)", "Stop and Wait", "Go-Back-N", "Selective-Repeat", "Adaptive ARQ"] },
      ],
    },
  ],
  "CSMA/CD": [{ n: "Persistent 방식 3종", kids: ["1-Persistent", "Non-Persistent", "P-Persistent"] }, "Back-off"],
  "CSMA/CA": [{ n: "IFS (Inter Frame Space)", kids: ["DIFS", "SIFS"] }, "경쟁 윈도우 (Contention Window)", "RTS", "CTS"],
  IPv6: [
    { n: "기본 헤더", kids: ["Version", "Traffic Class", "Flow Label", "Payload Length", "Next header", "Hop Limit", "Source Address", "Destination Address"] },
    "확장 헤더",
    { n: "표기법", kids: ["0 억제 표기법", "0 압축 표기법", "혼합 표기법"] },
  ],
  "IPv4와 IPv6 터널링": [
    "듀얼 스택",
    "터널링",
    { n: "주소 변환", kids: ["헤더변환", "수송계층 릴레이", "응용계층 게이트웨이"] },
  ],
  "ARP(Address Resolution Protocol)": ["MAC Address 요청 (Broadcast)", "MAC Address 회신 (Unicast)"],
  "RARP(Reverse Address Resolution Protocol)": ["RARP Request", "RARP Response"],
  "DHCP(Dynamic Host Configuration Protocol)": [
    { n: "IP 할당 과정", kids: ["DISCOVER", "OFFER", "REQUEST", "ACK"] },
    { n: "IP 갱신 과정", kids: ["REQUEST", "ACK"] },
    { n: "IP 해제 과정", kids: ["RELEASE"] },
  ],
  "DNS(Domain Name System)": ["Recursive", "Iterative", { n: "주요 기능", kids: ["Name Resolution", "Host Aliasing", "Mail Server Aliasing", "Load Distribution"] }],
  "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)": [
    { n: "거리벡터 라우팅(Distance Vector Routing)", kids: ["벨만-포드", "RIP(Routing Information Protocol)", "IGRP"] },
    { n: "링크상태 라우팅(Link State Routing)", kids: ["다익스트라", "LSA 수집", "토폴로지 DB", "SPF 계산", "OSPF(Open Shortest Path First)", "EIGRP"] },
    { n: "Metric 정보", kids: ["홉수(Hop count)", "심볼길이(Symbolic length)"] },
  ],
  "BGP(Border Gateway Protocol)": [
    "IGP·EGP(Interior·Exterior Gateway Protocol)",
    "Path Vector",
    { n: "구성도", kids: ["내부 iBGP", "외부 eBGP"] },
    { n: "경로 속성", kids: ["Next-Hop", "Local Preference", "AS-Path", "MED"] },
    { n: "프로토콜 메시지", kids: ["Open", "Update", "Notification", "Keepalive", "Route-Refresh"] },
  ],
  "TCP 와 UDP 비교": [
    { n: "TCP", kids: ["연결지향", "순서제어", "흐름제어", "혼잡제어", "오류제어"] },
    "UDP",
    { n: "TCP 제어 플래그 (6종)", kids: ["URG (Urgent)", "ACK (Acknowledgement)", "PSH (Push)", "RST (Reset)", "SYN (Synchronize)", "FIN (Finish)"] },
  ],
  "TCP 연결의 설정 및 해제(Handshaking)": [
    { n: "3-way handshake", kids: ["초기연결시도", "서버응답", "클라이언트 응답"] },
    { n: "4-way handshake", kids: ["연결종료 요청", "서버 ACK 신호", "서버 FIN 신호", "클라이언트 ACK"] },
  ],
  "Sliding Window & 네이글(Nagle's) 알고리즘": [
    { n: "Sliding Window", kids: ["Window 열림", "Window 닫힘", "Window 축소"] },
    { n: "네이글 알고리즘", kids: ["수신 Window Size만큼 전송", "송신 데이터 종료 시 즉시 전송", "데이터 축적 후 전송"] },
  ],
  "TCP 혼잡제어": [
    { n: "메커니즘 4단계", kids: ["Slow Start", "혼잡회피(Congestion Avoidance)", "빠른 전송(Fast Retransmission)", "빠른 회복(Fast Recovery)"] },
    { n: "알고리즘 유형", kids: ["Tahoe 알고리즘", "Reno 알고리즘", "New Reno 알고리즘"] },
  ],
  "SCTP(Stream Control Transmission Protocol)": [
    { n: "기술 요소", kids: ["Multi Homing", "Multi Streaming", "4-way Handshake(초기화)", "SACK & HEARTBEAT(전송)", "3-way Handshake(세션종료)"] },
  ],
  "HTTP/3": [
    { n: "프로토콜 스택", kids: ["QUIC", "TLS 1.3", "UDP"] },
    { n: "특징", kids: ["HOL 블로킹 해결", "멀티 스트리밍 전송", "Selective ACK(SACK)", "Seamless Connection", "보안성 강화"] },
  ],
  "QoS(Quality of Service)": [
    { n: "주요 지표", kids: ["대역폭", "지연", "지터", "패킷 손실"] },
    {
      n: "관리 기술",
      kids: [
        { n: "트래픽 쉐이핑(Traffic Shaping)", kids: ["Leaky Bucket", "Token Bucket"] },
        { n: "혼잡제어", kids: ["RED", "WRED"] },
        { n: "큐잉 기법(WFQ·PQ)", kids: ["FIFO Queuing", "Priority Queuing", "WFQ"] },
        "수락제어",
      ],
    },
    { n: "보장 기술", kids: ["IntServ·DiffServ", "RSVP"] },
  ],
  "CDN(Contents Delivery Network)": [
    { n: "구성 요소", kids: ["CDN SP", "CP", "ISP", "POP", "IX"] },
    { n: "기술 요소", kids: ["Global Server Load Balancing", "로드 밸런싱(Load Balancing)", "Streaming기술", "콘텐츠 배포", "동기화 기술", "Grid Delivery", "Request Routing"] },
  ],
  "망 중립성(Network Neutrality)": [
    { n: "3대 원칙", kids: ["비차별성 확립", "상호접속 허용", "접근성 제공"] },
    { n: "기본 원칙", kids: ["투명성", "차단금지", "불합리한 차별 금지", "합리적인 트래픽 관리"] },
  ],
  "SDN(Software Defined Network)": [{ n: "SDN 구성 요소", kids: ["Application", "Interface", "Control Plane", "Data Plane"] }],
  "오픈플로우(OpenFlow)": ["OpenFlow Controller", "OpenFlow Protocol", { n: "Switch", kids: ["OpenFlow Channel", "Flow Table", "Group Table"] }],
  "SD-WAN(Software Defined-Wide Area Network)": [
    { n: "장비 측면", kids: ["SD-WAN Controller", "SD-WAN Edge"] },
    { n: "경로 제어", kids: ["Dynamic Path Switching", "Packet Duplication", "Traffic Steering"] },
    { n: "회선 결합", kids: ["Link Aggregation"] },
    { n: "망 분리", kids: ["Network Segmentation"] },
  ],
  "네트워크 지능": [
    { n: "기술요소", kids: ["빅데이터 분석기술", "엣지 컴퓨팅(Edge Computing)", "SDN/NFV"] },
    { n: "관리요소", kids: ["폐쇄형 반복 제어(Closed-loop control)", "OAM / MANO"] },
  ],
  "NWDAF(Network Data Analytics Function)": [
    { n: "분석·학습", kids: ["AnLF", "MTLF"] },
    { n: "데이터 관리", kids: ["DCCF", "ADRF", "MFAF"] },
  ],
  "인텐트 기반 네트워킹(Intent-Based Networking)": [
    { n: "기술 요소", kids: ["의도 명령(Intent command)", "의도 번역(Intent translation)", "의도 적용(Intent deployment)", "의도 모니터링(Intent monitoring)", "의도 검정 및 재설정"] },
  ],
  "디지털 트윈 네트워크(Digital Twin Network)": [
    { n: "참조 아키텍처", kids: ["물리적 네트워크", "데이터 도메인", "모델 도메인", "관리 도메인", "네트워크 애플리케이션"] },
  ],
  "C-RAN(Centralized / Cloud RAN)": [
    { n: "구성 요소", kids: ["RU(Radio Unit)", "Centralized DU(Data Unit)"] },
    { n: "인터페이스 규격 종류", kids: ["CPRI", "OBSAI", "ORI"] },
  ],
  "O-RAN": [
    { n: "구성 요소", kids: ["RIC", "O-CU", "O-DU", "O-RU"] },
    { n: "아키텍처 인터페이스", kids: ["A1", "E2", "E1", "F1", "Open Front Haul"] },
  ],
  "RAN(Radio Access Network) Sharing": [{ n: "공유 방식", kids: ["MOCN·MORAN", "GWCN(GateWay Core Network)"] }],
  "네트워크 슬라이싱": [
    { n: "핵심기술 SDN", kids: ["Control plane", "Data plane"] },
    { n: "NFV(Network Function Virtualization)", kids: ["NFVI", "VNFs", "MANO"] },
  ],
  "5G 특화망": [
    { n: "구성 요소", kids: ["5G 주파수", "UPF(User Plane Function)", "MEC(Multi-access Edge Computing)", "gNB"] },
    { n: "5G 특화망 유형", kids: ["자가구축", "이음 5G 사업자"] },
  ],
  "비지상네트워크(NTN, Non-Terrestrial Networks)": [
    { n: "구성요소", kids: ["저궤도 위성(LEO)", "GEO", "피더 링크(Feeder Link)", "서비스 링크(Service Link)", "위성 간 링크", "Transparent 위성 / Regenerative 위성", "고고도 플랫폼(HAPS)", "드론(UAV)"] },
    { n: "기술요소", kids: ["전송 기술", "네트워크 제어", "위치 추적"] },
  ],
  "6G": [
    { n: "6G 이동통신 비전", kids: ["초성능", "초대역", "초현실", "초지능", "초정밀", "초공간"] },
    { n: "지원 기술", kids: ["테라 헤르츠 대역", "주파수 공유", "통신-컴퓨팅 융합", "네이티브 AI", "안테나 기술"] },
  ],
  "ISAC(Integrated Sensing and Communication)": [
    { n: "기술 요소", kids: ["응용 서비스", "인프라 및 자원", "RIS", "SLAM(Simultaneous Localization and Mapping)"] },
    { n: "기술 구현 과제", kids: ["신호처리", "하드웨어 설계", "스펙트럼 규제", "보안 및 프라이버시"] },
  ],
  "Wi-Fi 7(IEEE 802.11be)": [
    { n: "MAC(Media Access Control)", kids: ["다중협력통신", "16x16 MIMO", "HARQ"] },
    { n: "PHY(Physical layer)", kids: ["혼합 빔포밍", "4096 QAM"] },
  ],
  "Wi-Fi 8(IEEE 802.11bn)": ["UHR(Ultra High Reliability)", "멀티 링크 작동", "멀티 AP 협력", "DSO/NPCA", "dRU"],
  "Passive WiFi": [
    "후방산란(backscatter)",
    { n: "송신(Plugged-In Device)", kids: ["RF(Radio Frequency) Transfer", "RF Calibration"] },
    { n: "수신", kids: ["Passive Device", "Wifi Receiver"] },
  ],
  "SDR(Software Defined Radio)": [
    { n: "소자 기술", kids: ["A/D, D/A 변환기", "Digital IF", "광대역 RF", "FPGA", "DSP"] },
    { n: "소프트웨어 기술", kids: ["소프트웨어 구조(SCA)", "미들웨어", "Description 언어"] },
    { n: "시스템 기술", kids: ["HW Abstraction", "HW Platform", "SW Platform", "Smart Antenna"] },
  ],
  "IoT Matter": [{ n: "프로토콜 스택", kids: ["Matter Application", "TCP/IP", "IPv6", "Wi-Fi(802.11)", "Thread(802.15.4)", "BLE"] }],
  "무선 충전 기술": [
    { n: "무선 충전 기술 방식", kids: ["자기유도", "자기공진(자기공명)", "전자기파"] },
    { n: "기타 무선 충전 기술 방식", kids: ["RF", "적외선", "초음파"] },
  ],
};
