/**
 * 답안지 개념도 사양 — 토픽 답안지 템플릿 「2. ○○의 개념도와 …」 가. 자리에 SVG 로 그린다(ConceptDiagram).
 *
 * 2026-10-11 "교재를 참고로 개념도 그려 줬는데 너는 못 해 주냐" — 교재 슬라이드 그림(public/concept/book·answer)
 * 을 보고 손글씨 답안처럼 다시 그린 것이다. 패턴·규칙은 1교시 지침 4장:
 *  - 패턴 1개: 계층(tree)·중심-위성(hub)·그룹(group)·순환(cycle)·레이어드(layer)·흐름+분기(flow)·시퀀스(sequence)·그래프(graph).
 *    교재에 개념도가 있으면 그 형태를 우선한다.
 *  - 매칭: 1열이 그룹(구분·분류)인 표면 그룹 이름 = 표 1열, 박스 = 표 2열(순서·개수·글자 같게).
 *    1열이 단계·항목인 표면 박스 = 표 1열.
 *  - hi = 강조할 박스 하나(주제 박스). 그룹(점선)은 필수.
 * 키 = 서브노트 제목. 두 개념 토픽(2항목형)은 배열로 A·B 각각. gloss = 그림 간글(40자 이내).
 */
import type { AnswerConclusion } from "./answerConclusions";

type SeqMsg = { from: number; to: number; label: string; dashed?: boolean };

export type ConceptSpec = { hi?: string; gloss?: string; note?: string } & (
  | {
      pattern: "group";
      groups: { name: string; items: string[] }[];
      /** [from 그룹, to 그룹, 라벨] */
      arrows?: [number, number, string?][];
      both?: boolean;
      /** 그룹 안 최대 행 수(기본 3) */
      rows?: number;
    }
  | {
      pattern: "flow";
      steps: string[];
      labels?: string[];
      branch?: {
        from: number;
        steps: string[];
        label?: string;
        parallel?: boolean;
        dashed?: boolean;
      };
      loop?: boolean;
      loopLabel?: string;
    }
  | { pattern: "cycle"; steps: string[]; center?: string }
  | { pattern: "layer"; layers: { name: string; items: string[] }[] }
  | {
      pattern: "sequence";
      actors: string[];
      /** from === to 는 자기 처리(오류 검출 등) */
      msgs: SeqMsg[];
      /** 칸 나눔 — 칸마다 같은 행위자로 따로 그린다(이때 msgs 는 비워 둔다) */
      panels?: { name: string; msgs: SeqMsg[] }[];
    }
  | { pattern: "hub"; center: string; items: string[] }
  | {
      pattern: "tree";
      root: string;
      children: { label: string; children?: string[] }[];
    }
  | { pattern: "graph"; graph: NonNullable<AnswerConclusion["graph"]> }
);

export const CONCEPT_DIAGRAMS: Record<string, ConceptSpec | ConceptSpec[]> = {
  "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)": {
    pattern: "group",
    groups: [
      {
        name: "소스코딩",
        items: ["영상 부호화", "파형 부호화", "무손실 압축", "손실 압축"],
      },
      { name: "채널코딩", items: ["오류제어"] },
      { name: "라인코딩", items: ["기저대역"] },
    ],
    arrows: [
      [0, 1, "압축"],
      [1, 2, "오류제어"],
    ],
    rows: 2,
    hi: "오류제어",
    gloss: "A/D변환→소스→채널→라인코딩 순 송신, 수신은 역순 복원 구조",
  },
  "PCM(Pulse-Code Modulation)": {
    pattern: "group",
    groups: [
      { name: "송신", items: ["표본화", "양자화", "부호화"] },
      { name: "수신", items: ["재생", "복호화", "재구성"] },
    ],
    arrows: [[0, 1, "전송로"]],
    hi: "부호화",
    gloss: "아날로그신호→PCM신호로 전송로 거쳐 아날로그신호 복원 구조",
  },
  "QAM(Quadrature Amplitude Modulation)": {
    pattern: "hub",
    center: "16 QAM",
    items: ["X 축", "Y 축", "심볼 코딩", "심볼 표현"],
    hi: "16 QAM",
    gloss: "I·Q 축 성상도 위 심볼 위치로 진폭·위상 표현 구조",
  },
  "CSMA/CD": {
    pattern: "group",
    groups: [
      { name: "송신 준비", items: ["데이터 준비"] },
      { name: "채널 감시", items: ["채널 Free", "충돌 발생", "채널 Busy"] },
    ],
    arrows: [[0, 1, "송신"]],
    hi: "충돌 발생",
    gloss: "채널 Busy 재탐색, 충돌 발생 시 Jam 신호 후 새로운 시도 구조",
  },
  "CSMA/CA": {
    pattern: "flow",
    steps: [
      "①채널 사용 검사",
      "②IFS 주기 대기",
      "③Back off 대기",
      "④프레임 전송",
      "⑤ACK 메시지 수신",
    ],
    labels: ["CTS"],
    hi: "③Back off 대기",
    gloss: "RTS·CTS 교환 후 Data·ACK, 다른 노드 NAV 매체 접근 연기 구조",
  },
  "다중화(Multiplexing)": {
    pattern: "tree",
    root: "다중화",
    children: [
      { label: "주파수 축", children: ["FDM"] },
      { label: "시간 축", children: ["TDM"] },
      { label: "코드 축", children: ["CDM"] },
      { label: "파장 축", children: ["WDM"] },
      { label: "공간 축", children: ["SDM"] },
    ],
    hi: "다중화",
    gloss: "하나의 전송로를 분할 축에 따라 다수 채널로 나누는 분류 구조",
  },
  "서비스 프리미티브(Service Primitive)": {
    pattern: "group",
    groups: [
      { name: "요청 측", items: ["요청", "확인"] },
      { name: "응답 측", items: ["지시", "응답"] },
    ],
    arrows: [[0, 1, "N-1"]],
    both: true,
    hi: "요청",
    gloss: "N+1 계층 하향 요청·응답, 상향 지시·확인 전달 구조",
  },
  "OSI 7 Layer (ISO 7498)": {
    pattern: "layer",
    layers: [
      { name: "7 Application", items: ["HTTP, SMTP"] },
      { name: "6 Presentation", items: ["JPEG"] },
      { name: "5 Session", items: ["TLS, SSH"] },
      { name: "4 Transport", items: ["TCP, UDP"] },
      { name: "3 Network", items: ["IP, ICMP"] },
      { name: "2 Data Link", items: ["PPP, HDLC"] },
      { name: "1 Physical", items: ["RS-232C, DSL"] },
    ],
    hi: "4 Transport",
    gloss: "통신순서 송신측 7→1계층, 수신측 1→7계층 전달 구조",
  },
  "HTTP/3": {
    pattern: "group",
    groups: [
      {
        name: "Initial 1-RTT",
        items: ["Inchoate CHLO", "Rejection", "Complete CHLO"],
      },
      { name: "Successful 0-RTT", items: ["Complete CHLO"] },
      { name: "Rejected 0-RTT", items: ["1-RTT 재수행"] },
    ],
    arrows: [[0, 1, "캐싱"]],
    hi: "Rejection",
    gloss: "Client·Server 간 CHLO·REJ·SHLO 교환 후 암호화 요청·응답 구조",
  },
  "TCP 연결의 설정 및 해제(Handshaking)": {
    pattern: "sequence",
    actors: ["Client", "Server"],
    msgs: [],
    panels: [
      {
        name: "3-way handshake",
        msgs: [
          { from: 0, to: 1, label: "연결시도 SYN" },
          { from: 1, to: 0, label: "서버응답 SYN+ACK" },
          { from: 0, to: 1, label: "Client 응답 ACK" },
        ],
      },
      {
        name: "4-way handshake",
        msgs: [
          { from: 0, to: 1, label: "종료 요청 FIN" },
          { from: 1, to: 0, label: "서버 ACK" },
          { from: 1, to: 0, label: "서버 FIN" },
          { from: 0, to: 1, label: "Client ACK" },
        ],
      },
    ],
    hi: "3-way handshake",
    gloss: "Client·Server 간 SYN·ACK 교환 수립, FIN·ACK 교환 종료 구조",
    note: "교재 그림대로 시퀀스(지침 4장 예: 3-Way Handshake) — 메시지 라벨 = 표 2열 + 교재 플래그",
  },
  "TCP 혼잡제어": {
    pattern: "graph",
    graph: {
      x: "Time",
      y: "Window Size",
      series: [
        {
          name: "느린 출발",
          pts: [
            [0, 0],
            [1, 1],
            [2, 4],
            [3, 12],
          ],
        },
        {
          name: "혼잡회피",
          pts: [
            [3, 12],
            [7, 24],
          ],
          hi: true,
        },
        {
          name: "빠른 전송",
          pts: [
            [7, 24],
            [7, 10],
          ],
        },
        {
          name: "빠른 회복",
          pts: [
            [7, 10],
            [10, 17],
          ],
        },
      ],
      labels: [
        "ssthresh1·ssthresh2",
        "Tahoe TCP 초기버전",
        "Reno TCP 이후 버전",
      ],
    },
    hi: "혼잡회피",
    gloss: "ssthresh 도달 후 선형 증가, 손실 시 절반에서 재증가 추이",
  },
  "TCP 와 UDP 비교": [
    {
      pattern: "group",
      groups: [
        {
          name: "TCP",
          items: [
            "발신지 포트 주소",
            "목적지 포트 주소",
            "Sequence number",
            "Acknowledgement number",
            "Window size",
            "Urgent pointer",
          ],
        },
        {
          name: "UDP",
          items: [
            "송신지 포트 번호",
            "수신지 포트 번호",
            "전체 길이",
            "검사합",
          ],
        },
      ],
      hi: "TCP",
      gloss: "TCP 20 byte 헤더 순서·확인 필드, UDP 8바이트 헤더 4필드 구조",
      note: "교재 그림은 TCP·UDP 헤더 구조라 비교표 1열(비교 항목)과 축이 달라 헤더 필드로 그림",
    },
    {
      pattern: "layer",
      layers: [
        { name: "Sequence number", items: [] },
        { name: "Acknowledgement number", items: [] },
        {
          name: "제어 플래그",
          items: ["①URG", "②ACK", "③PSH", "④RST", "⑤SYN", "⑥FIN"],
        },
      ],
      hi: "⑤SYN",
      gloss: "TCP 헤더 HLEN·예약 다음 6 bits 플래그 배치 구조",
    },
  ],
  "IPv4와 IPv6 터널링": {
    pattern: "group",
    groups: [
      { name: "병행", items: ["듀얼 스택"] },
      { name: "경유", items: ["터널링"] },
      { name: "변환", items: ["주소 변환"] },
    ],
    hi: "터널링",
    gloss: "IP계층 모두 설치·IPv4망 터널 통과·주소변환기 연동 구조",
  },
  "DNS(Domain Name System)": {
    pattern: "hub",
    center: "local DNS server",
    items: [
      "requesting host",
      "root DNS server",
      "TLD DNS server",
      "ns.test.com",
      "www.test.com",
    ],
    hi: "local DNS server",
    gloss: "local DNS 중심 root·TLD·ns.test.com 순차 질의 구조",
    note: "표 1열이 단계 번호(1~9)라 박스 라벨 대신 교재 그림의 서버 배치로 그림",
  },
  "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)": {
    pattern: "group",
    groups: [
      { name: "정의", items: ["정의"] },
      {
        name: "동작방식",
        items: ["동작방식 ①", "동작방식 ②", "동작방식 ③", "동작방식 ④"],
      },
      { name: "프로토콜", items: ["RIP", "IGRP"] },
    ],
    hi: "동작방식 ③",
    gloss: "수신 테이블 반영 후 Compare, 최소 Hop Count로 A 테이블 갱신 구조",
  },
  "FEC(Forward Error Correction) / BEC(Backward Error Correction)": [
    {
      pattern: "sequence",
      actors: ["송신측", "수신측"],
      msgs: [
        { from: 0, to: 1, label: "데이터+잉여 비트" },
        { from: 1, to: 1, label: "오류 → 자체 정정" },
      ],
      hi: "오류 → 자체 정정",
      gloss: "수신 측이 잉여 비트로 오류를 스스로 정정하는 구조",
      note: "교재 개념도가 송신측·수신측 시퀀스(지침 4장 예: FEC·BEC) — 표는 부호 분류라 기준이 다름",
    },
    {
      pattern: "sequence",
      actors: ["송신측", "수신측"],
      msgs: [
        { from: 0, to: 1, label: "데이터" },
        { from: 1, to: 1, label: "오류 검출" },
        { from: 1, to: 0, label: "재전송 요청" },
        { from: 0, to: 1, label: "재전송" },
      ],
      hi: "재전송 요청",
      gloss: "수신 측 오류 검출 후 송신 측에 재전송 요청하는 구조",
      note: "교재 개념도가 송신측·수신측 시퀀스(지침 4장 예: FEC·BEC) — 표는 기법 분류라 기준이 다름",
    },
  ],
  "해밍코드(Hamming code)": {
    pattern: "flow",
    steps: [
      "1. Parity 수 결정",
      "2. Parity 위치 결정",
      "3. Parity 값 결정",
      "4. 데이터 위치 지정",
      "5. 해밍 코드 생성",
      "6. 생성 결과",
    ],
    hi: "5. 해밍 코드 생성",
    gloss: "d+p+1 ≤ 2^p 로 Parity 수 정하고 1,2,4,8 위치 삽입 후 XOR 생성",
  },
  "CRC(Cyclic Redundancy Check)": {
    pattern: "group",
    groups: [
      { name: "Encoding", items: ["Data", "Divisor", "CRC"] },
      { name: "Transmission", items: ["Data+CRC"] },
      { name: "Decoding", items: ["Divisor", "Remainder"] },
    ],
    arrows: [
      [0, 1, "송신"],
      [1, 2, "수신"],
    ],
    hi: "Divisor",
    gloss: "송신측 Divisor 나눗셈 CRC 부착, 수신측 Remainder 0이면 accept",
  },
  "QoS(Quality of Service)": {
    pattern: "flow",
    steps: ["수락제어", "데이터 Path", "트래픽 쉐이핑", "혼잡제어", "큐잉"],
    hi: "데이터 Path",
    gloss: "수락 트래픽을 분류·평준화·랜덤 폐기 후 큐잉하는 라우터 처리",
  },
  "ARP(Address Resolution Protocol)": {
    pattern: "group",
    groups: [
      { name: "MAC Address 요청", items: ["요청 ①", "요청 ②", "요청 ③"] },
      {
        name: "MAC Address 회신",
        items: ["회신 ①", "회신 ②", "회신 ③", "회신 ④"],
      },
    ],
    arrows: [[0, 1, "ARP Request"]],
    rows: 4,
    hi: "요청 ③",
    gloss: "호스트 A가 D의 MAC 요청, D가 ARP Replay 회신 후 Cache 수정",
  },
  "RARP(Reverse Address Resolution Protocol)": {
    pattern: "sequence",
    actors: ["Host", "RARP server"],
    msgs: [
      { from: 0, to: 1, label: "RARP Request" },
      { from: 1, to: 0, label: "RARP Response" },
    ],
    hi: "RARP server",
    gloss: "물리 주소 담은 Request에 RARP server가 IP 주소 Reply",
  },
  "DHCP(Dynamic Host Configuration Protocol)": {
    pattern: "sequence",
    actors: ["Client", "Server"],
    msgs: [
      { from: 0, to: 1, label: "DISCOVER", dashed: true },
      { from: 1, to: 0, label: "OFFER", dashed: true },
      { from: 0, to: 1, label: "REQUEST", dashed: true },
      { from: 1, to: 0, label: "ACK", dashed: true },
    ],
    hi: "Server",
    note: "표 1열은 단계 번호(①~④)뿐이라 2열 할당 과정 이름으로 메시지 라벨을 맞춤",
    gloss: "Client UDP 68과 Server UDP 67 간 메시지 교환 구조",
  },
  "SCTP(Stream Control Transmission Protocol)": {
    pattern: "group",
    groups: [
      { name: "초기화", items: ["4-way Handshake"] },
      {
        name: "전송",
        items: ["Multi Homing", "Multi Streaming", "SACK & HEARTBEAT"],
      },
      { name: "세션종료", items: ["3-way Handshake"] },
    ],
    arrows: [
      [0, 1],
      [1, 2],
    ],
    hi: "Multi Homing",
    gloss: "4단계 초기화, 다중 IP·스트림 전송, 3단계 세션 종료 구조",
  },
  "C-RAN(Centralized / Cloud RAN)": {
    pattern: "group",
    groups: [
      { name: "구성 요소", items: ["RU", "Centralized DU"] },
      { name: "인터페이스 규격", items: ["CPRI", "OBSAI", "ORI"] },
    ],
    arrows: [[0, 1, "프론트홀"]],
    hi: "Centralized DU",
    gloss: "RRH 분산 배치, 디지털부문 중앙 집중, 프론트홀 규격 연결",
  },
  "O-RAN": {
    pattern: "layer",
    layers: [
      { name: "RIC", items: ["RIC near-RT", "RIC non-RT"] },
      { name: "O-CU", items: ["RRC·SDAP·PDCP"] },
      { name: "O-DU", items: ["RLC·MAC·High PHY"] },
      { name: "O-RU", items: ["DFE·RF FE", "Low PHY·Beamforming"] },
    ],
    hi: "RIC",
    gloss: "HW·SW 분리, Fronthaul·Midhaul로 장치 연결",
  },
  "RAN(Radio Access Network) Sharing": {
    pattern: "group",
    groups: [
      { name: "MORAN", items: ["컨트롤러", "기지국"] },
      { name: "MOCN", items: ["컨트롤러", "기지국", "Spectrum"] },
      { name: "GWCN", items: ["Core", "컨트롤러", "기지국", "Spectrum"] },
    ],
    arrows: [
      [0, 1],
      [1, 2],
    ],
    rows: 4,
    hi: "MOCN",
    gloss: "이통사별 Service Platform 별도, Shared 요소 범위로 방식 구분",
  },
  "5G 특화망": {
    pattern: "group",
    groups: [
      { name: "무선 자원", items: ["5G 주파수"] },
      { name: "접속", items: ["gNB"] },
      { name: "엣지", items: ["MEC"] },
      { name: "코어", items: ["UPF"] },
    ],
    arrows: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    hi: "MEC",
    gloss: "단말이 전용 주파수로 액세스 망 거쳐 코어 망 연결",
  },
  "네트워크 슬라이싱": {
    pattern: "group",
    groups: [
      { name: "SDN", items: ["application", "Control plane", "Data plane"] },
      { name: "NFV", items: ["NFVI", "VNFs", "MANO"] },
    ],
    hi: "Control plane",
    gloss: "Openflow로 Plane 분리, MANO가 VNF 관리하는 구조",
  },
  "NWDAF(Network Data Analytics Function)": {
    pattern: "group",
    groups: [
      { name: "NWDAF", items: ["MTLF", "AnLF"] },
      { name: "데이터 관리", items: ["DCCF", "MFAF", "ADRF"] },
    ],
    arrows: [[1, 0, "전달"]],
    hi: "AnLF",
    gloss: "MTLF 모델 배포, AnLF가 수집 데이터로 분석 응답하는 구조",
  },
  "네트워크 지능": {
    pattern: "group",
    groups: [
      {
        name: "기술요소",
        items: ["인공지능/머신러닝", "빅데이터", "클라우드·엣지", "SDN/NFV"],
      },
      { name: "관리요소", items: ["Closed-loop", "OAM / MANO"] },
    ],
    arrows: [[0, 1]],
    rows: 2,
    hi: "Closed-loop",
    gloss: "데이터 수집·AI 분석·피드백 반복으로 망을 최적 상태로 제어",
  },
  "6G": {
    pattern: "hub",
    center: "6G",
    items: ["초성능", "초대역", "초현실", "초지능", "초정밀", "초공간"],
    hi: "초성능",
    gloss: "1Tbps·100GHz 이상 대역·0.1ms 지연 목표 이동 통신",
  },
  "ISAC(Integrated Sensing and Communication)": {
    pattern: "layer",
    layers: [
      { name: "응용 서비스", items: ["디지털트윈", "SDN·NFV"] },
      { name: "통합설계/지능화", items: ["NWDAF·MEC", "AI/ML·ZTNA"] },
      { name: "인프라 및 자원", items: ["XL-MIMO·RIS", "O-RAN·SDR·NTN"] },
    ],
    hi: "통합설계/지능화",
    gloss: "Network Slice 할당·Open FH로 계층 연결, 단일 신호로 송수신·감지",
  },
  "디지털 트윈 네트워크(Digital Twin Network)": {
    pattern: "layer",
    layers: [
      { name: "6G 네트워크 애플리케이션", items: [] },
      {
        name: "6G 디지털 트윈",
        items: ["데이터 도메인", "모델 도메인", "관리 도메인"],
      },
      { name: "6G 물리적 네트워크", items: [] },
    ],
    hi: "6G 디지털 트윈",
    gloss: "물리적 네트워크 데이터 수집, 트윈 계층 거쳐 인텐트·제어 교환 구조",
    note: "표 1열 「6G 네트워크\\n애플리케이션」은 한 이름이 칸 너비로 접힌 것이라 그림엔 전체 이름(교재 계층 그림 3단 그대로)",
  },
  "Hyper-AI 네트워크": {
    pattern: "tree",
    root: "Hyper-AI 네트워크",
    children: [
      {
        label: "네트워크 전면 구축",
        children: ["이동통신 고도화", "광통신망 지능화", "국제망 경쟁력 강화"],
      },
      {
        label: "산업 1등 국가",
        children: ["기술 개발", "수요 창출", "제도 개선"],
      },
    ],
    hi: "Hyper-AI 네트워크",
    gloss: "이동통신·광통신·국제망 고도화와 기술·수요·제도 동시 추진 구조",
  },
  "비지상네트워크(NTN, Non-Terrestrial Networks)": {
    pattern: "group",
    groups: [
      {
        name: "구성요소",
        items: [
          "사용자 단말",
          "피더 링크",
          "서비스 링크",
          "위성 간 링크",
          "Transparent Regenerative",
          "HAPS",
          "드론",
        ],
      },
    ],
    rows: 2,
    hi: "서비스 링크",
    gloss: "GEO·LEO 위성 간 링크로 지상망 도달 어려운 지역 5G 서비스 구조",
  },
  "Wi-Fi 7(IEEE 802.11be)": {
    pattern: "layer",
    layers: [
      {
        name: "MAC",
        items: ["AP 다중협력", "320MHz 대역폭", "16x16 MIMO", "HARQ"],
      },
      { name: "PHY", items: ["혼합 빔포밍", "4096 QAM"] },
    ],
    hi: "320MHz 대역폭",
    gloss: "MAC 다중협력·재전송, PHY 빔포밍·변조로 30Gbps 전송 구조",
  },
  "Wi-Fi 8(IEEE 802.11bn)": {
    pattern: "group",
    groups: [
      {
        name: "Wi-Fi 7",
        items: [
          "주파수 대역(GHz)",
          "최대 대역폭(MHz)",
          "변조",
          "MU-MIMO",
          "OFDMA",
        ],
      },
      { name: "Wi-Fi 8", items: ["최대 PHY 속도", "멀티 AP 협력", "DSO/NPCA"] },
    ],
    arrows: [[0, 1, "UHR"]],
    hi: "멀티 AP 협력",
    gloss: "Wi-Fi 7 대역폭·변조 계승, AP 간 협력 더해 신뢰성 높인 구조",
  },
  "Passive WiFi": {
    pattern: "group",
    groups: [
      {
        name: "Plugged-In Device",
        items: ["RF Transfer", "RF Calibration", "MAC"],
      },
      { name: "Passive Device", items: ["후방산란"] },
      { name: "Wifi Receiver", items: [""] },
    ],
    arrows: [
      [0, 1, "RF"],
      [1, 2, "반사"],
    ],
    hi: "후방산란",
    gloss: "송신 장치 신호를 Passive Device가 반사해 수신기 전달 구조",
  },
  "SDN(Software Defined Network)": {
    pattern: "layer",
    layers: [
      { name: "Application", items: ["SDN Application"] },
      { name: "Control Plane", items: ["Control Logic", "ACL·Routing"] },
      { name: "Interface", items: ["OpenFlow"] },
      { name: "Data Plane", items: ["Forward Engine"] },
    ],
    hi: "Control Plane",
    gloss: "중앙집중 Control Plane이 Data Plane 장비 제어 구조",
  },
  "IoT Matter": {
    pattern: "layer",
    layers: [
      { name: "Application", items: ["Matter Application"] },
      { name: "Transport", items: ["TCP/IP", "UDP"] },
      { name: "Network", items: ["IPv6"] },
      { name: "Radio", items: ["Wi-Fi", "Thread", "BLE"] },
    ],
    hi: "Matter Application",
    gloss: "다양한 Radio 위 공통 IPv6·Transport로 Matter 기기 연동 구조",
  },
  "오픈플로우(OpenFlow)": {
    pattern: "layer",
    layers: [
      { name: "Controller", items: ["OpenFlow Controller"] },
      {
        name: "Protocol",
        items: ["Controller-to-Switch", "Asynchronous", "Symmetric"],
      },
      {
        name: "Switch",
        items: ["OpenFlow Channel", "Flow Table", "Group Table"],
      },
    ],
    hi: "Protocol",
    gloss: "Controller가 Protocol로 Switch 파이프라인 제어 구조",
  },
  "SD-WAN(Software Defined-Wide Area Network)": {
    pattern: "group",
    groups: [
      { name: "장비 측면", items: ["SD-WAN Controller", "SD-WAN CPE"] },
      {
        name: "경로 제어",
        items: [
          "Dynamic Path Switching",
          "Packet Duplication",
          "Traffic Steering",
        ],
      },
      { name: "회선 결합", items: ["Link Aggregation"] },
      { name: "망 분리", items: ["Network Segmentation"] },
    ],
    hi: "SD-WAN Controller",
    gloss: "MPLS·Internet 다중 회선을 경로 제어·회선 결합·망 분리로 활용 구조",
  },
  "SDR(Software Defined Radio)": {
    pattern: "tree",
    root: "SDR",
    children: [
      {
        label: "소자 기술",
        children: [
          "ADC/DAC",
          "광대역 RF",
          "Digital IF",
          "FPGA, DSP",
          "프로세서",
        ],
      },
      { label: "소프트웨어 기술", children: ["SCA", "미들웨어", "RTOS"] },
    ],
    hi: "SDR",
    gloss: "기존 BBA·MSM·CODEC을 단일 SDR 블록으로 통합한 광대역 처리 구조",
  },
  "CDN(Contents Delivery Network)": {
    pattern: "flow",
    steps: ["CP", "ISP", "IX", "POP", "User"],
    branch: { from: 3, steps: ["CDN SP"], dashed: true },
    hi: "POP",
    gloss: "Middle-mile 경유 최소화, 사용자 인접 POP가 Last-mile 전달 구조",
  },
  "망 중립성(Network Neutrality)": {
    pattern: "tree",
    root: "망 중립성",
    children: [
      { label: "트래픽 관리 투명성" },
      { label: "차단금지" },
      { label: "불합리한 차별 금지" },
      { label: "합리적 트래픽 관리" },
    ],
    hi: "망 중립성",
    gloss: "투명성 바탕 차단·차별 금지, 예외로 합리적 관리 허용 구조",
  },
  "인텐트 기반 네트워킹(Intent-Based Networking)": {
    pattern: "layer",
    layers: [
      { name: "의도 명령", items: ["NMS, User"] },
      { name: "의도 번역", items: ["Translation·Optimization", "LLM"] },
      {
        name: "의도 적용",
        items: ["Activation·Configuration", "Virtual Machine·Container"],
      },
      { name: "의도 모니터링", items: ["Monitoring·Assurance"] },
      { name: "의도 검정 및 재설정", items: ["Validation", "feedback"] },
    ],
    hi: "의도 번역",
    gloss: "High-level 의도 번역·적용 후 모니터링 피드백 순환 구조",
  },
  "무선 충전 기술": {
    pattern: "tree",
    root: "무선 충전 기술",
    children: [
      { label: "근거리", children: ["자기유도"] },
      { label: "중거리", children: ["자기공명"] },
      { label: "원거리", children: ["전자기파"] },
      { label: "전파", children: ["RF"] },
      { label: "빛", children: ["적외선"] },
      { label: "음파", children: ["초음파"] },
    ],
    hi: "무선 충전 기술",
    gloss: "전송 거리·매체별 자기유도·자기공명·전자기파 등 방식 분류 구조",
  },
  "Sliding Window & 네이글(Nagle's) 알고리즘": {
    pattern: "group",
    groups: [
      {
        name: "Sliding Window",
        items: ["Window 열림", "Window 닫힘", "Window 축소"],
      },
      {
        name: "네이글 알고리즘",
        items: ["Window Size", "종료 시 전송", "축적 후 전송"],
      },
    ],
    hi: "축적 후 전송",
    gloss: "Sliding Window 송신량 조절, 네이글 ACK 대기 동안 송신 억제 구조",
  },
  "BGP(Border Gateway Protocol)": {
    pattern: "group",
    groups: [
      {
        name: "경로 속성",
        items: ["Next-Hop", "Local Preference", "AS-Path", "MED"],
      },
      {
        name: "프로토콜 메시지",
        items: ["Open", "Update", "Notification", "Keepalive"],
      },
    ],
    arrows: [[1, 0, "Update"]],
    rows: 2,
    hi: "AS-Path",
    gloss: "같은 AS 내부는 iBGP, 다른 AS 간 연결은 외부 eBGP 구현",
  },
  IPv6: {
    pattern: "group",
    groups: [
      {
        name: "IPv6 기본 헤더",
        items: [
          "버전",
          "트래픽 클래스",
          "플로우 레이블",
          "페이로드 길이",
          "다음 헤더",
          "홉 제한",
          "송신지 주소",
          "수신지 주소",
        ],
      },
      { name: "Payload", items: ["IPv6 확장 헤더", "상위계층 데이터"] },
    ],
    arrows: [[0, 1, "다음 헤더"]],
    rows: 4,
    hi: "IPv6 기본 헤더",
    gloss: "40바이트 기본 헤더 뒤 확장 헤더·상위계층 데이터 Payload 구조",
  },
  "선형 자료구조와 비선형 자료구조": [
    {
      pattern: "tree",
      root: "자료구조",
      children: [
        { label: "순차 저장", children: ["Array"] },
        { label: "연결 저장", children: ["Linked List"] },
        { label: "제한 접근", children: ["Stack (LIFO)", "Queue (FIFO)"] },
        { label: "계층", children: ["Tree"] },
        { label: "망", children: ["Graph"] },
      ],
      hi: "자료구조",
      gloss: "자료 순차 배열·연결·제한 접근과 계층·망 구조로 저장 방식 구분",
    },
    {
      pattern: "group",
      groups: [
        {
          name: "선형 자료구조",
          items: ["1:1 대응 구조", "Array, List", "Stack, Queue"],
        },
        { name: "비선형 자료구조", items: ["1:N, M:N 구조", "Tree", "Graph"] },
      ],
      arrows: [[0, 1, "관계 표현"]],
      hi: "비선형 자료구조",
      gloss: "선형은 구조 간단·access 빠름, 비선형은 자료 간의 관계 표현",
      note: "비교표 1열(대응 구조·설명·구조)은 비교 축이라 박스 대신 두 자료구조 그룹의 칸 글로 그림",
    },
  ],
  "링크드 리스트(Linked List)": {
    pattern: "group",
    groups: [
      { name: "단방향", items: ["Singly Linked List", "Singly Circular List"] },
      { name: "양방향", items: ["Double Linked List", "Double Circular List"] },
    ],
    arrows: [[0, 1, "이전 포인터"]],
    rows: 2,
    hi: "Singly Linked List",
    gloss: "마지막 노드 포인터가 Null인지 처음 노드인지로 순환 여부 구분",
  },
  Stack: {
    pattern: "layer",
    layers: [
      { name: "TOP", items: ["PUSH", "POP"] },
      { name: "DATA", items: ["DATA 3", "DATA 2"] },
      { name: "Bottom", items: ["DATA 1"] },
    ],
    hi: "TOP",
    gloss: "나중에 삽입된 DATA 3이 가장 먼저 삭제되는 후입선출 방식",
  },
  Queue: {
    pattern: "group",
    groups: [
      { name: "전단", items: ["Front", "Dequeue", "isEmpty"] },
      { name: "후단", items: ["Rear", "Enqueue", "isFull"] },
    ],
    arrows: [[1, 0, "삽입 방향"]],
    hi: "Front",
    gloss: "삭제 시 새로운 전단, 삽입 시 새로운 후단으로 이동하는 구조",
  },
  "이진 탐색 트리(Binary Search Tree)": {
    pattern: "tree",
    root: "노드 x",
    children: [
      { label: "좌측 서브 트리", children: ["좌측 작은 값"] },
      { label: "우측 서브 트리", children: ["우측 큰 값"] },
    ],
    hi: "노드 x",
    gloss: "좌측·우측 서브 트리도 모두 이진 탐색 트리인 재귀적 구조",
    note: "표 1열이 성질 번호(1)~4))라 박스는 표 2열 성질(좌측 작은 값·우측 큰 값)로 그림",
  },
  "AVL 트리": {
    pattern: "tree",
    root: "Balance factor",
    children: [
      { label: "BF +2", children: ["LL", "LR"] },
      { label: "BF −2", children: ["RR", "RL"] },
    ],
    hi: "Balance factor",
    gloss: "왼쪽 서브 트리 높을 때 LL·LR, 오른쪽 높을 때 RR·RL 회전",
  },
  "힙(Heap)": {
    pattern: "flow",
    steps: [
      "2, 6, 4, 9, 7 순서 삽입",
      "노드 1 삽입",
      "1<4 비교",
      "1<2 비교",
      "삽입 완료",
    ],
    labels: ["새 노드", "4 왼쪽", "1, 4 치환", "1, 2 치환"],
    hi: "1<4 비교",
    gloss: "완전 이진 트리 형태 유지하며 자식·부모 노드 비교 후 치환",
    note: "표 1열이 단계 번호(1~5)라 박스는 표 2열 첫 줄로 그림",
  },
  "B-Tree(Balanced Tree)": {
    pattern: "tree",
    root: "B-Tree",
    children: [
      { label: "구조", children: ["Root node", "Internal node", "Leaf node"] },
      { label: "특징", children: ["자식노드 수", "균등 탐색", "효율성"] },
      { label: "유형", children: ["B+ Tree", "B* Tree"] },
    ],
    hi: "B-Tree",
    gloss: "각 노드 자료 정렬 상태, 최하위 노드 동일레벨 구현 균형 트리",
  },
  "방향성 비순환 그래프(DAG, Directed Acyclic Graph)": {
    pattern: "flow",
    steps: ["진입 차수", "차수 0 큐 삽입", "간선 제거", "모든 정점 제거"],
    labels: ["", "동시에", ""],
    branch: { from: 3, steps: ["완료"], label: "YES" },
    loop: true,
    loopLabel: "NO",
    hi: "차수 0 큐 삽입",
    gloss: "꼭짓점을 변의 방향 거스르지 않도록 나열하는 위상 정렬 절차",
    note: "표 1열이 절차·설명·진입/진출 차수 용어 혼합이라 교재 위상 정렬 절차 흐름으로 그림",
  },
  "알고리즘 성능평가": {
    pattern: "tree",
    root: "알고리즘 성능평가",
    children: [
      { label: "성능분석", children: ["복잡도 분석"] },
      { label: "성능측정", children: ["시간 측정"] },
      { label: "효율성 평가", children: ["시간 복잡도", "공간 복잡도"] },
    ],
    hi: "효율성 평가",
    gloss: "구현 없이 분석, 실제 구현물로 측정, 시간·공간 효율성 평가",
  },
  "빅오 표기법(O-Notation)": {
    pattern: "graph",
    graph: {
      x: "데이터의 수 n",
      y: "수행 시간 T(n)",
      series: [
        {
          name: "O(1)",
          pts: [
            [0, 1.5],
            [10, 1.5],
          ],
        },
        {
          name: "O(log N)",
          pts: [
            [0, 0],
            [2, 1.8],
            [5, 2.9],
            [10, 3.6],
          ],
        },
        {
          name: "O(N)",
          pts: [
            [0, 0],
            [10, 8],
          ],
          hi: true,
        },
        {
          name: "O(N log N)",
          pts: [
            [0, 0],
            [4, 4.3],
            [7.5, 10],
          ],
        },
        {
          name: "O(N²)",
          pts: [
            [0, 0],
            [3, 3.2],
            [5.5, 10],
          ],
        },
        {
          name: "O(N³)",
          pts: [
            [0, 0],
            [2.2, 3.5],
            [3.8, 10],
          ],
        },
        {
          name: "O(2ⁿ)",
          pts: [
            [0, 0.6],
            [1.2, 2.5],
            [2, 10],
          ],
        },
      ],
      labels: ["해시 함수", "이진탐색", "단순탐색", "퀵 정렬", "버블 정렬"],
    },
    hi: "O(N)",
    gloss: "데이터 수 N 증가에 따른 유형별 수행 시간 증가율 차이",
  },
  "퀵 정렬(Quick Sort)": {
    pattern: "flow",
    steps: [
      "Low 좌측 탐색",
      "High 우측 탐색",
      "큰·작은 값 교환",
      "Low·High 교차",
      "좌·우 Pivot",
    ],
    labels: ["", "", "반복", "재귀실행"],
    branch: { from: 3, steps: ["피봇·high 교환"], label: "교차 시" },
    hi: "좌·우 Pivot",
    gloss: "Pivot 기준 작은 값·큰 값 분할을 리스트 크기 0이나 1까지 반복",
    note: "표 1열이 순서 번호(1~7)라 박스는 표 2열 첫 줄로 그림",
  },
  "삽입 정렬(Insertion Sort)": {
    pattern: "flow",
    steps: ["처음 A[0]", "A[1] 비교", "A[2] 비교", "나머지 삽입"],
    labels: ["삽입", "삽입", "같은 방식"],
    hi: "A[1] 비교",
    gloss: "비정렬 영역 요소를 하나씩 정렬 영역에 넣어 정렬 영역 확장",
    note: "표 1열이 순번(1~4)이라 박스는 표 2열 첫 줄로 그림",
  },
  "버블 정렬(Bubble Sort)": {
    pattern: "flow",
    steps: ["시작", "인접 원소 비교", "A(4) 확정", "A(3) 확정", "완료"],
    labels: ["", "1회", "2회", "3회"],
    hi: "인접 원소 비교",
    gloss: "진행 방향으로 비교·교환, 정렬 완료는 뒤쪽부터 확정되는 방식",
    note: "표 1열이 순번(1~3)이라 박스는 표 2열 첫 줄로 그림",
  },
  "병합 정렬(Merge Sort)": {
    pattern: "group",
    groups: [
      { name: "분할", items: ["데이터 반 분할", "2 이상 ① 반복"] },
      { name: "정복", items: ["하위 집합 병합", "병합 반복"] },
    ],
    arrows: [[0, 1, "병합"]],
    rows: 2,
    hi: "하위 집합 병합",
    gloss: "반 분할 반복으로 쪼갠 뒤 정렬하며 하나로 병합하는 분할·정복 구조",
    note: "표 1열이 순번(①~④)뿐이라 박스 = 표 2열 첫 줄, 교재 그림의 분할·정복 구분으로 묶음",
  },
  "해시 테이블": {
    pattern: "group",
    groups: [
      { name: "함수", items: ["해시 함수"] },
      { name: "입력", items: ["해시 키"] },
      { name: "저장 공간", items: ["해시 테이블", "버킷", "슬롯"] },
      { name: "충돌", items: ["동거자", "충돌", "오버 플로우"] },
    ],
    arrows: [
      [1, 0],
      [0, 2, "주소값"],
    ],
    rows: 3,
    hi: "해시 테이블",
    gloss: "해시 키를 해시 함수로 주소값 변환해 버킷·슬롯에 접근하는 구조",
  },
  "해싱과 충돌해결방법": {
    pattern: "group",
    groups: [
      { name: "산술 연산", items: ["나눗셈법", "폴딩법", "중간 제곱법"] },
      { name: "진법 변환", items: ["기수 변환법"] },
      { name: "자릿수 분석", items: ["자릿수분석법"] },
      { name: "난수", items: ["무작위 방법"] },
    ],
    rows: 3,
    hi: "나눗셈법",
    gloss: "산술 연산·진법 변환·자릿수 분석·난수로 나눈 홈 주소 결정 분류",
  },
  "동적 계획법(Dynamic Programming)": {
    pattern: "flow",
    steps: ["전제 조건", "① 점화/재귀식", "② Memoization", "③ Bottom-Up"],
    labels: ["", "부분문제 해", "점진적 해결"],
    hi: "② Memoization",
    gloss: "점화식으로 나눈 부분 문제 해를 저장해 상위 문제로 올라가는 흐름",
  },
  "그리디(탐욕) 알고리즘": {
    pattern: "flow",
    steps: ["해 선택", "적합성 검증", "해 검증", "해 도출"],
    labels: ["", "적합", "최종해"],
    loop: true,
    loopLabel: "미적합·해 아님 시 해 선택 반복",
    hi: "해 선택",
    gloss: "적합성·해 검증 실패 시 해 선택 단계로 되돌아가는 반복 구조",
  },
  "허프만(Huffman) 코딩": {
    pattern: "flow",
    steps: ["빈도 내림차순", "최소 빈도 쌍", "쌍별 0·1 배정", "문자 코드 할당"],
    labels: ["", "연결 반복", ""],
    hi: "최소 빈도 쌍",
    gloss: "빈도 낮은 두 문자부터 묶어 트리 생성 후 0·1로 코드 부여",
    note: "표 1열이 순번(1~4)뿐이라 박스 = 표 2열 첫 줄(교재 트리 그림 대신 표 동작 순서)",
  },
  "런랭스(Run Length) 코딩": {
    pattern: "layer",
    layers: [
      {
        name: "평문",
        items: ["AAAABBBBBCCCCCCCCDEEEE", "ABCDDDDDDDDEEEEEEEE"],
      },
      { name: "압축", items: ["4A5B8C1D5E", "ABC*8D*9E"] },
      {
        name: "압축률",
        items: ["22byte/10byte = 2.2%", "19byte/9byte = 2.11%"],
      },
      { name: "적용 방식", items: ["LENGTH→RUN", "반복 자료 적용"] },
    ],
    hi: "압축",
    gloss: "평문을 LENGTH·RUN 순 나열로 압축, 변화 잦으면 압축률 저하",
  },
  "다익스트라(Dijkstra) 알고리즘": {
    pattern: "flow",
    steps: ["d[A]=0", "A→S 편입", "최소 B 선택", "최소 D 선택"],
    branch: {
      from: 3,
      steps: ["최소 C 선택", "최소 F 선택", "최소 E 선택", "A→D→C→F"],
    },
    hi: "A→D→C→F",
    gloss: "출발지 A 초기화 후 최소 노드 S 편입 반복, Q 공집합 시 경로 확정",
    note: "표 1열이 순번(1~8)뿐이라 박스 = 표 2열 첫 줄, 8단계라 두 줄로 꺾음",
  },
  "TF-IDF(Term Frequency - Inverse Document Frequency)": {
    pattern: "flow",
    steps: ["DTM 작성", "TF 계산", "불용어 처리", "IDF 산출", "TF-IDF 계산"],
    hi: "TF-IDF 계산",
    gloss: "타 문서에 흔한 단어 가중치 낮추고 문서 내 빈도 높은 단어 강조 흐름",
    note: "표 1열이 순번(1~5)뿐이라 박스 = 표 2열(절차)",
  },
  "최소 신장 트리(MST, Minimum Spanning Tree)": {
    pattern: "flow",
    steps: ["시작 정점만", "최저 간선 선택", "신장 트리 확장", "n-1 간선 종료"],
    hi: "최저 간선 선택",
    gloss: "시작 정점 출발, 간선 n-1개 될 때까지 인접 정점 붙여 키우는 구조",
    note: "표 1열이 순번(1)~4))뿐이라 박스 = 표 2열, 교재 그림 진행 순(2)→3)→1)→4))으로 배치",
  },
  "트리 순회(Tree Traversal)": {
    pattern: "layer",
    layers: [
      {
        name: "구분",
        items: [
          "전위 순회(Pre-Order)",
          "중위 순회(In-Order)",
          "후위 순회(Post-Order)",
        ],
      },
      {
        name: "노드 방문 순서",
        items: [
          "Root → Left → Right",
          "Left → Root → Right",
          "Left → Right → Root",
        ],
      },
      { name: "수식 표기", items: ["전위 표기", "중위 표기", "후위 표기"] },
    ],
    hi: "노드 방문 순서",
    gloss: "Left는 Right보다 먼저, Root 방문 위치만 앞·가운데·뒤로 바뀌는 구조",
  },
  "그래프 순회(Graph Traversal)": {
    pattern: "tree",
    root: "그래프 순회",
    children: [
      {
        label: "너비 우선 탐색(BFS)",
        children: ["횡방향 탐색", "큐 이용 구현"],
      },
      {
        label: "깊이 우선 탐색(DFS)",
        children: ["종방향 탐색", "스택·백트래킹"],
      },
    ],
    hi: "그래프 순회",
    gloss: "모든 정점을 인접 정점 우선·최대 깊이 우선 두 방식으로 나눈 분류",
    note: "표가 BFS·DFS 비교표(1열 = 비교 항목)라 교재 그림처럼 BFS·DFS로 나누고 박스 = 개념·구현 행 값",
  },
  "빔 탐색(Beam Search)": {
    pattern: "flow",
    steps: [
      "문제 정의",
      "최초 해 선택",
      "부분 해 확장",
      "K개 해 선택",
      "최종 해 선택",
    ],
    labels: ["", "", "③·④ 반복", ""],
    hi: "K개 해 선택",
    gloss: "단계마다 확률 상위 K개만 남기고 나머지 후보 삭제하는 흐름",
    note: "표 1열이 순번(①~⑤)뿐이라 박스 = 표 2열 첫 줄(「문제 정의 →」의 화살표 기호는 뺌)",
  },
};

export const conceptFor = (title?: string | null): ConceptSpec[] => {
  const v = title ? CONCEPT_DIAGRAMS[title] : undefined;
  return !v ? [] : Array.isArray(v) ? v : [v];
};
