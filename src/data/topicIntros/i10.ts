import type { AnswerIntro } from "./index";

/** 예전 토픽 답안 서론 세트 — 청크 10 */
export const I: Record<string, AnswerIntro> = {
  "gj-95": {
    lead: "주제 중심 통합 분석 창고, DW",
    defShort: "여러 운영계 데이터를 주제 중심으로 통합·시계열 축적해 보관하는 분석용 통합DB",
    features: ["주제지향성", "시계열 축적", "비휘발성"],
  },
  "gj-96": {
    lead: "단계별 발주 문서 체계, RFI/RFP/Proposal/RFQ",
    defShort: "발주자가 정보 수집과 요구 제시를 하면 공급자가 방안·가격을 내는 발주 문서 체계",
    features: ["단계별 구체화", "공정 경쟁", "책임 명확화"],
  },
  "gj-98": {
    lead: "IT 서비스 관리 인증 국제 표준, ISO 20000",
    defShort: "ITIL 기반 IT 서비스 관리 체계의 수립·운영 수준을 심사해 인증하는 국제 표준",
    features: ["인증 표준", "PDCA 기반", "5대 프로세스"],
  },
  "net-1": {
    lead: "통신의 기본 약속, 네트워크 프로토콜",
    defShort: "시스템 간 데이터 교환의 구문·의미·시간을 규정해 신뢰 통신을 보장하는 통신 규약",
    features: ["구문·의미·시간", "표준화", "상호운용성"],
  },
  "net-100": {
    lead: "이동 단말 측위 기술, 단말 위치 설정",
    defShort: "위성·이동통신·무선랜 등 신호원으로 단말의 지리적 위치를 추정하는 측위 기술",
    features: ["다중 신호원", "삼변측량", "혼합측위"],
  },
  "net-101": {
    lead: "차세대 무선랜 보안 표준, WPA3",
    defShort: "SAE 인증과 관리프레임 보호 의무화로 WPA2 취약점을 보완한 무선랜 보안 표준",
    features: ["SAE 인증", "PMF 필수", "전방향 안전성"],
  },
  "net-103": {
    lead: "기계 간 자동 통신 체계, Machine to Machine",
    defShort: "사람 개입 없이 기계 간 통신망과 ICT로 원격 사물 정보를 수집·제어하는 통신 체계",
    features: ["무인 통신", "원격 제어", "플랫폼 기반"],
  },
  "net-105": {
    lead: "사물인터넷 상호운용의 기반, IoT 표준",
    defShort: "이기종 IoT 기기·플랫폼 간 상호운용을 위해 공통 서비스 계층을 규정한 표준 총칭",
    features: ["상호운용성", "공통 계층", "연합 표준"],
  },
  "net-106": {
    lead: "저사양 IoT용 경량 웹 프로토콜, CoAP",
    defShort: "제약 IoT 기기를 위해 IETF가 표준화한 UDP 기반 경량 REST 프로토콜",
    features: ["UDP 기반", "REST 모델", "DTLS 보안"],
  },
  "net-107": {
    lead: "발행·구독 경량 메시징 프로토콜, MQTT",
    defShort: "브로커를 통해 발행·구독 방식으로 메시지를 신뢰성 있게 전달하는 IoT 프로토콜",
    features: ["발행·구독", "경량 헤더", "QoS 3단계"],
  },
  "net-108": {
    lead: "XML 기반 실시간 메시징 프로토콜, XMPP",
    defShort: "둘 이상 참여자 간 구조화 데이터를 준실시간 교환하는 XML 기반 TCP 프로토콜",
    features: ["XML 스트림", "프레즌스", "서버 연합"],
  },
  "net-109": {
    lead: "경량 IoT 디바이스 관리 표준, LwM2M",
    defShort: "제약 IoT 단말의 오브젝트와 자원을 원격 조회·제어하는 CoAP 기반 관리 표준",
    features: ["CoAP 기반", "객체 모델", "원격 관리"],
  },
  "net-110": {
    lead: "웹 표준 기반 사물 연동 구조, WoT",
    defShort: "사물 기능을 URI·HTTP 표준으로 노출해 이기종 IoT를 연동하는 아키텍처",
    features: ["웹 표준 활용", "사물기술서", "상호운용성"],
  },
  "net-111": {
    lead: "만물 연결의 가치 창출, IoE(Internet of Everything)",
    defShort: "사람·프로세스·데이터·사물을 연결해 효율과 확장성을 높이는 만물인터넷 개념",
    features: ["4대 요소 연결", "가치 창출", "지능형 관리"],
  },
  "net-112": {
    lead: "저전력 장거리 IoT 통신, LoRa(Long Range)",
    defShort: "CSS 확산 변조로 비면허 대역에서 저전력 장거리 통신을 제공하는 LPWAN 기술",
    features: ["CSS 변조", "비면허 대역", "저전력 광역"],
  },
  "net-113": {
    lead: "초협대역 사업자형 LPWAN, SigFox",
    defShort: "초협대역 변조로 메시지를 초저전력·초장거리로 전송하는 사업자 LPWAN 기술",
    features: ["초협대역", "전송 제한", "사업자 운영"],
  },
  "net-114": {
    lead: "이동성 지원 면허대역 IoT 규격, LTE-M",
    defShort: "LTE망 경량화로 중저속 전송과 이동성·음성을 지원하는 면허대역 IoT 규격",
    features: ["이동성 지원", "음성 지원", "저전력"],
  },
  "net-115": {
    lead: "심층 커버리지 협대역 IoT, NB-IoT",
    defShort: "180kHz 협대역으로 초저전력·심층 커버리지를 제공하는 LTE IoT 규격",
    features: ["협대역", "심층 커버리지", "초저전력"],
  },
  "net-116": {
    lead: "연결되는 지능형 차량, IoV",
    defShort: "차량·인프라·클라우드를 상호 연결해 주행 데이터를 수집·활용하는 차량 IoT",
    features: ["V2X 연결", "데이터 활용", "초저지연"],
  },
  "net-119": {
    lead: "차량 통신으로 여는 자율협력주행, V2X",
    defShort: "차량이 인프라·망과 주행정보를 실시간 교환해 자율협력주행을 지원하는 통신기술",
    features: ["사각지대 보완", "실시간 교환", "C-V2X"],
  },
  "net-120": {
    lead: "에너지 최적화 특화 IoT, e-IoT",
    defShort: "생산·전송·소비 전 과정 설비를 연결해 실시간 계측·제어하는 에너지 특화 IoT",
    features: ["실시간 계측", "원격 제어", "수요반응"],
  },
  "net-124": {
    lead: "가장 기본적인 IPv6 전환 기술, Dual Stack",
    defShort: "IPv4·IPv6 스택을 한 노드에 동시 탑재해 두 주소체계를 수용하는 전환 기술",
    features: ["동시 운용", "호환성 우수", "이중 관리"],
  },
  "net-125": {
    lead: "IPv4 백본을 건너는 IPv6 전환, IPv6-in-IPv4 터널링",
    defShort: "IPv6 패킷을 IPv4에 캡슐화해 IPv4 라우팅 영역을 통과시키는 전환 기술",
    features: ["캡슐화", "IPv4 경유", "종단 복원"],
  },
  "net-126": {
    lead: "주소 변환 게이트웨이 전환 기술, 변환(G/W) 관점",
    defShort: "주소·헤더를 변환하는 게이트웨이로 양단 수정 없이 연동하는 IPv6 전환 기술",
    features: ["주소 매핑", "단말 무수정", "DNS64 연계"],
  },
  "net-127": {
    lead: "ARP를 대체하는 IPv6 이웃 탐색, ND(Neighbor Discovery)",
    defShort: "IPv6 노드가 이웃·라우터를 탐색해 주소를 관리하는 ICMPv6 프로토콜",
    features: ["멀티캐스트", "주소해석", "자동설정"],
  },
  "net-128": {
    lead: "IPv6 필수 제어 프로토콜, ICMPv6",
    defShort: "오류 통지·진단·제어와 ND·MLD 전달을 담당하는 IPv6 제어 프로토콜",
    features: ["오류 통지", "PMTUD", "ND 기반"],
  },
  "net-129": {
    lead: "전환기 보안 위협 대응, IPv6의 보안 문제점 해결방안",
    defShort: "IPv6 전환 과정의 듀얼스택·터널링·ND 취약점을 식별·대응하는 보안 체계",
    features: ["RA Guard", "SEND", "IPsec"],
  },
  "net-13": {
    lead: "이기종 망 연결 기술, 인터네트워킹",
    defShort: "서로 다른 구조의 네트워크를 브리지·라우터 등 장비로 연결해 통합 통신하는 기술",
    features: ["이기종 연동", "계층별 장비", "확장성"],
  },
  "net-131": {
    lead: "가중치 기반 공평 스케줄링, WFQ",
    defShort: "플로우 큐에 가중치를 두고 가상 완료시간 순 전송으로 대역폭을 공평 배분하는 기법",
    features: ["가중치 배분", "공평성", "플로우 단위"],
  },
  "net-136": {
    lead: "자원 예약 기반 QoS 보장, IntServ",
    defShort: "RSVP로 종단 간 자원을 플로우 단위로 사전 예약해 절대적 QoS를 보장하는 모델",
    features: ["자원 예약", "수락 제어", "절대적 보장"],
  },
  "net-137": {
    lead: "클래스 기반 차등 QoS, DiffServ",
    defShort: "트래픽을 클래스로 묶어 DSCP 값에 따라 홉 단위 차등 전달하는 확장형 QoS 모델",
    features: ["클래스 기반", "DSCP 마킹", "확장성"],
  },
  "net-138": {
    lead: "레이블 기반 고속 스위칭, MPLS",
    defShort: "IP 조회 대신 고정 레이블로 고속 포워딩과 트래픽 엔지니어링을 하는 스위칭 기술",
    features: ["레이블 교환", "고속 포워딩", "TE 지원"],
  },
  "net-139": {
    lead: "전송망 특화 레이블 스위칭, MPLS-TP",
    defShort: "OAM·보호절체를 강화해 전송망 용도로 규격화한 MPLS 기반 패킷 전달 기술",
    features: ["중앙 관리", "OAM 강화", "보호절체"],
  },
  "net-14": {
    lead: "대표적 유선 LAN 기술, 이더넷(Ethernet)",
    defShort: "CSMA/CD로 매체를 공유해 프레임 단위로 전송하는 802.3 LAN 기술",
    features: ["CSMA/CD", "프레임 전송", "802.3 표준"],
  },
  "net-140": {
    lead: "사용자 체감품질 지표, QoE",
    defShort: "사용자가 서비스에서 총체적으로 경험하고 주관적으로 인지하는 품질의 정량화 지표",
    features: ["주관적 품질", "총체적 경험", "정량화 관리"],
  },
  "net-141": {
    lead: "망 자체의 객관적 성능, NP(Network performance)",
    defShort: "망 설계와 구성요소 특성에 의존하며 QoS 능력을 나타내는 망의 객관적 성능 척도",
    features: ["객관적 성능", "망 의존", "측정 가능"],
  },
  "net-142": {
    lead: "면허 없이 쓰는 공용 대역, ISM Band",
    defShort: "산업·과학·의료 목적으로 지정돼 면허 없이 저출력으로 쓰는 공용 무선 주파수 대역",
    features: ["비면허", "저출력", "공용 대역"],
  },
  "net-144": {
    lead: "IoT 적용성을 높인 BLE, Bluetooth 4.2",
    defShort: "IPv6 연결과 패킷 확장·프라이버시 강화로 IoT 적용성을 높인 BLE 규격",
    features: ["IPSP 지원", "패킷 확장", "프라이버시"],
  },
  "net-145": {
    lead: "거리·속도 확장 BLE, 블루투스(Bluetooth 5.0)",
    defShort: "BLE의 거리·속도·브로드캐스트 용량을 확장해 간섭 회피를 더한 블루투스 규격",
    features: ["거리 4배", "속도 2배", "광고 8배"],
  },
  "net-146": {
    lead: "정밀 거리측정 블루투스, 블루투스(Bluetooth 6)",
    defShort: "위상 기반 채널 사운딩으로 cm급 정밀 거리측정을 지원하는 최신 블루투스 코어 규격",
    features: ["채널 사운딩", "cm급 측위", "효율 향상"],
  },
  "net-147": {
    lead: "초광대역 정밀 측위 기술, UWB",
    defShort: "초광대역 임펄스 신호를 저전력 송신해 고속 전송과 cm급 측위를 제공하는 무선 기술",
    features: ["초광대역", "임펄스", "cm급 측위"],
  },
  "net-148": {
    lead: "저속·저전력 메시 WPAN 표준, Zigbee(Low Data Rate)",
    defShort: "802.15.4 기반의 저속·저전력 메시 네트워킹을 제공하는 WPAN 표준",
    features: ["저속·저전력", "메시 토폴로지", "802.15.4"],
  },
  "net-150": {
    lead: "BLE 기반 실내 위치인식, 비콘(Beacon)",
    defShort: "BLE 광고 패킷을 주기 송출해 신호세기로 근접도를 판단하는 실내 위치인식 기술",
    features: ["BLE 광고", "RSSI 근접", "실내 측위"],
  },
  "net-151": {
    lead: "초근접 기가급 전송 기술, 징(Zing)",
    defShort: "60GHz 대역에서 10cm 이내 초근접으로 기가급 데이터를 전송하는 무선 기술",
    features: ["60GHz", "초근접", "기가급 전송"],
  },
  "net-153": {
    lead: "스마트미터링 무선 메시망, Wi-SUN",
    defShort: "서브기가 대역에서 IPv6 메시망을 구성해 스마트미터링을 수용하는 프로토콜",
    features: ["802.15.4g", "IPv6 메시", "서브기가"],
  },
  "net-154": {
    lead: "셀 밀도로 트래픽 수용, 고밀도화",
    defShort: "기지국·셀 밀도를 높여 주파수 재사용을 극대화해 트래픽을 수용하는 5G 핵심 기술",
    features: ["셀 소형화", "공간 재사용", "간섭 관리"],
  },
  "net-155": {
    lead: "전파를 원하는 방향으로, 빔포밍(Beamforming)",
    defShort: "다수 안테나의 위상·진폭을 조정해 특정 방향으로 전파를 집중시키는 지향성 기술",
    features: ["위상 조정", "지향성", "에너지 집중"],
  },
  "net-159": {
    lead: "유휴 주파수 지능 공유, 인지무선기술(CR)",
    defShort: "전파환경을 인지해 유휴 주파수를 탐지·이용하고 원 사용자 출현 시 회피하는 기술",
    features: ["환경 인지", "유휴 탐지", "즉시 회피"],
  },
  "net-161": {
    lead: "직교 부반송파 병렬 전송, OFDM",
    defShort: "고속 데이터를 직교 부반송파에 나눠 병렬 전송해 주파수 효율을 높인 다중반송파 변조",
    features: ["직교성", "병렬 전송", "다중경로 내성"],
  },
  "net-162": {
    lead: "다중 안테나 공간 다중화, MIMO",
    defShort: "다수 안테나로 공간 자유도를 활용해 전송률과 신뢰도를 함께 높이는 다중안테나 기술",
    features: ["공간 다중화", "다이버시티", "전송률 향상"],
  },
  "net-163": {
    lead: "소프트웨어로 재구성하는 무선, SDR(Radio)",
    defShort: "주파수·변조·출력 등 특성을 HW 교체 없이 SW 변경만으로 재구성하는 무선 기술",
    features: ["SW 재구성", "유연성", "다중 규격"],
  },
  "net-164": {
    lead: "전력 차 중첩 전송, 비직교 다중접속(NOMA)",
    defShort: "동일 자원에 전력 차를 둬 다수 신호를 중첩 전송하고 SIC로 분리하는 다중접속 기술",
    features: ["전력 할당", "중첩 전송", "SIC 분리"],
  },
  "net-166": {
    lead: "주파수 대역 분산 접속, 멀티캐리어(Multi Carrier)",
    defShort: "단말이 여러 주파수 대역 중 상황에 맞게 선택 접속해 트래픽을 나누는 부하분산 기술",
    features: ["대역 선택", "부하 분산", "수용량 확대"],
  },
  "net-167": {
    lead: "반송파 묶어 속도 배가, Carrier Aggregation",
    defShort: "여러 요소 반송파를 묶어 넓은 대역처럼 사용해 전송속도를 높이는 주파수 확장 기술",
    features: ["반송파 결합", "대역 확장", "속도 배가"],
  },
  "net-169": {
    lead: "시분할 이중화 4G 규격, TDD-LTE",
    defShort: "한 주파수 대역을 시간으로 나눠 상향·하향을 번갈아 전송하는 시분할 이중화 규격",
    features: ["시분할", "비대칭 유리", "단일 대역"],
  },
  "net-17": {
    lead: "근거리 통신망의 기본, LAN",
    defShort: "제한된 지역에서 고속·저지연으로 기기를 연결해 자원을 공유하는 근거리 통신망",
    features: ["고속·저지연", "자원 공유", "제한 지역"],
  },
  "net-170": {
    lead: "주파수 분할 이중화 4G 규격, FDD-LTE",
    defShort: "상향과 하향에 다른 주파수 대역을 할당해 동시 송수신하는 주파수 분할 이중화 규격",
    features: ["주파수 분할", "동시 송수신", "대칭 트래픽"],
  },
  "net-174": {
    lead: "비면허 대역 활용 LTE 확장, LTE-U",
    defShort: "면허 대역 앵커로 5GHz 비면허 대역을 보조 활용해 용량을 확장하는 LTE 기술",
    features: ["비면허 활용", "앵커 결합", "용량 확장"],
  },
  "net-179": {
    lead: "공공 전용 LTE 통신망 사업, LTE-X 사업",
    defShort: "재난·철도·해상 등 공공 임무 전용망을 LTE 기반으로 구축하는 통신망 사업군",
    features: ["공공 전용망", "PS-LTE", "임무 특화"],
  },
  "net-187": {
    lead: "기업 전용 Private 5G, 5G 특화망(지역 5G)",
    defShort: "특정 구역에 수요 기업이 전용 주파수를 직접 할당받아 구축·운영하는 5G 자가망",
    features: ["전용 주파수", "자가망", "지역 한정"],
  },
  "net-191": {
    lead: "IMT-2030 6대 시나리오, 6G Usage Scenario",
    defShort: "IMT-2030이 정의한 6G의 6가지 활용 시나리오로 구성된 서비스 청사진",
    features: ["6대 시나리오", "5G 확장", "AI·센싱"],
  },
  "net-192": {
    lead: "통신·센싱 융합 6G 기술, ISAC",
    defShort: "동일 주파수·안테나로 통신과 주변 환경 센싱을 동시 수행하는 통신·센싱 융합 기술",
    features: ["자원 공유", "통신·센싱", "6G 핵심"],
  },
  "net-193": {
    lead: "개방형 무선접속망 구조, O-RAN/AI-RAN",
    defShort: "기지국 HW·SW를 분리하고 인터페이스를 개방·표준화한 다중 벤더 RAN 구조",
    features: ["개방 규격", "다중 벤더", "지능형 제어"],
  },
  "net-194": {
    lead: "집중형 클라우드 기지국 구조, C-RAN",
    defShort: "BBU를 중앙 집중하고 RU만 분산 배치해 프론트홀로 연결하는 집중형 RAN 구조",
    features: ["BBU 집중", "RU 분산", "프론트홀"],
  },
  "net-195": {
    lead: "AI 내재화 무선접속망, AI-RAN(Radio Access Network)",
    defShort: "설계·운용에 AI를 내재화해 성능·효율을 자율 최적화하는 차세대 RAN 개념",
    features: ["AI 내재화", "자율 최적화", "자원 공유"],
  },
  "net-197": {
    lead: "위성-상공-지상 통합망, SATIN",
    defShort: "저궤도 위성·상공·지상망을 하나로 묶어 끊김 없는 커버리지를 제공하는 통합망",
    features: ["3계층 통합", "끊김 없음", "광역 커버"],
  },
  "net-201": {
    lead: "네트워크 통합 관리 시스템, NMS",
    defShort: "망 장비를 SNMP로 감시하며 장애·구성·성능·보안을 통합 관리하는 시스템",
    features: ["SNMP 기반", "중앙 감시", "FCAPS"],
  },
  "net-206": {
    lead: "정적·동적 경로 결정, 라우팅 경로고정",
    defShort: "관리자가 수동 설정하는 정적과 프로토콜이 자동 갱신하는 동적으로 나뉜 라우팅 방식",
    features: ["정적 라우팅", "동적 라우팅", "수동 설정"],
  },
  "net-207": {
    lead: "IGP와 EGP의 구분, 내/외부 라우팅",
    defShort: "AS 내부 경로를 정하는 IGP와 AS 간 정책 교환 EGP로 나뉜 계층 라우팅 체계",
    features: ["IGP", "EGP", "AS 단위"],
  },
  "net-208": {
    lead: "홉 기반 거리 벡터 라우팅, RIP",
    defShort: "홉 카운트 메트릭과 거리 벡터로 인접 라우터와 경로를 교환하는 내부 라우팅 프로토콜",
    features: ["홉 카운트", "거리 벡터", "주기 교환"],
  },
  "net-211": {
    lead: "링크 상태 최단경로 라우팅, Open Shortest Path First",
    defShort: "LSA로 LSDB를 구성하고 SPF로 최단 경로를 찾는 링크 상태 라우팅 프로토콜",
    features: ["링크 상태", "SPF 계산", "영역 분할"],
  },
  "net-22": {
    lead: "저전력 광역 IoT 통신, LPWAN",
    defShort: "저전력·저비용으로 광역에서 소량 데이터를 전송하는 IoT 전용 장거리 무선 기술",
    features: ["저전력", "광역 커버", "소량 데이터"],
  },
  "net-220": {
    lead: "서브기가 스마트홈 메시, Z-Wave",
    defShort: "서브기가 대역에서 저전력·저속으로 홈 기기를 메시로 연결하는 스마트홈 프로토콜",
    features: ["서브기가", "메시 연결", "저전력"],
  },
  "net-221": {
    lead: "지능형 주거 환경, 스마트 홈(Smart Home)",
    defShort: "가전·보안 기기를 홈네트워크로 연결하고 상황을 인지·자동 제어하는 주거 환경",
    features: ["상황 인지", "자동 제어", "에너지 효율"],
  },
  "net-223": {
    lead: "ICT·AI 지능화 농장, 스마트 팜(Smart Farm)",
    defShort: "온실·축사에 ICT·AI를 접목해 생육 환경을 자동 제어해 생산성을 높인 농장",
    features: ["환경 계측", "자동 제어", "생산성 향상"],
  },
  "net-226": {
    lead: "세션 제어 시그널링 프로토콜, SIP",
    defShort: "멀티미디어 세션의 생성·수정·종료를 담당하는 텍스트 기반 시그널링 프로토콜",
    features: ["텍스트 기반", "세션 제어", "RFC 3261"],
  },
  "net-228": {
    lead: "SIP 기반 통합 서비스 제어, IMS",
    defShort: "접속망과 무관하게 SIP로 IP 멀티미디어를 제공하는 통합 서비스 제어 플랫폼",
    features: ["SIP 기반", "접속망 독립", "3GPP 표준"],
  },
  "net-23": {
    lead: "동기식 광전송망 표준, SONET(동기식 관통신망)",
    defShort: "광케이블로 다양한 속도의 신호를 프레임에 동기 다중화해 전송하는 광전송망 기술",
    features: ["동기 다중화", "표준 프레임", "SDH 대응"],
  },
  "net-230": {
    lead: "스스로 구성·최적화하는 망, SON",
    defShort: "기지국이 전파환경을 인지해 설정·최적화·장애 복구를 자동 수행하는 자가구성망",
    features: ["자가 구성", "자가 최적화", "자가 복구"],
  },
  "net-231": {
    lead: "망 임차 이동통신 사업 모델, MVNO",
    defShort: "자체 망 없이 MNO 망을 임차해 자사 브랜드로 이동통신 서비스를 제공하는 사업 모델",
    features: ["망 임차", "도매 대가", "MNO 의존"],
  },
};
