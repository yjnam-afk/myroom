/**
 * 답안용 표·개념도 — 토픽 답안지 템플릿(1교시 1~1.5쪽)에 그대로 옮겨 적는 분량.
 *
 * 2026-10-11 — "해설집, 모범답안 참고해서 진짜 답안지처럼". 교재 표를 통째로 싣던 템플릿이
 * 2~3쪽이 되어, 해설집·손글씨 답안처럼 「II. 개념도 + 3단표(4~8행)」「III. 짧은 표(3~5행)」로 줄였다.
 * 칸 글은 교재 표·정의·키워드의 말에서 조사·수식어만 덜어 냈다(지어 넣지 않는다 —
 * 검사: scratchpad ans/check.py 와 같은 규칙, CLAUDE.md 「교재 자료를 옮길 때」).
 * 머리글은 교재 머리글 그대로, 줄 앞 「- 」는 화면(AnswerTable)이 붙인다.
 * 개념도는 교재 슬라이드에서 그림 영역만 잘라 public/concept/answer/ 에 둔다.
 *
 * 키 = 교재 서브노트 제목. 없는 토픽은 교재 표 전체로 그린다.
 */
export type AnswerSheetTable = {
  caption: string;
  headers: string[];
  rows: string[][];
  /** 표 아래 간글 한 줄 */
  gloss?: string;
};
export type AnswerSheet = {
  /** 개념도 그림(public 경로) — 교재 슬라이드에서 잘라 낸 것 */
  diagram?: string[];
  /** [0] = II. 나. 구성요소 표, [1] = III. 비교·활용 표 */
  tables: AnswerSheetTable[];
};

export const ANSWER_SHEETS: Record<string, AnswerSheet> = {
  "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)": {
    "diagram": [
      "/concept/answer/nw-transmission-coding.webp"
    ],
    "tables": [
      {
        "caption": "전송 부호화 구성",
        "headers": [
          "구분",
          "분류",
          "설명"
        ],
        "rows": [
          [
            "소스코딩",
            "영상 부호화",
            "영상정보 대상 JPEG·MPEG"
          ],
          [
            "소스코딩",
            "오디오 부호화",
            "PCM·DM 음성 파형 부호화"
          ],
          [
            "소스코딩",
            "무손실 압축 부호화",
            "복원 시 원본 데이터 일치"
          ],
          [
            "소스코딩",
            "손실 압축 부호화",
            "복원 시 원본 데이터 손실"
          ],
          [
            "채널코딩",
            "오류 검출·정정",
            "잉여비트 추가, 잡음 오류 복원"
          ],
          [
            "라인코딩",
            "기저대역 신호",
            "디지털 신호 변환, 수신 동기 재생"
          ]
        ],
        "gloss": "A/D변환 후 소스코딩 압축, 채널코딩 오류제어, 라인코딩 신호 변환"
      }
    ]
  },
  "PCM(Pulse-Code Modulation)": {
    "diagram": [
      "/concept/answer/nw-pcm.webp"
    ],
    "tables": [
      {
        "caption": "동작 원리",
        "headers": [
          "구분",
          "동작",
          "설명"
        ],
        "rows": [
          [
            "송신",
            "표본화",
            "표본간격 PAM 펄스열 추출"
          ],
          [
            "송신",
            "양자화",
            "PAM 진폭 이산값 변환\n레벨 2^n 표본당 비트 n"
          ],
          [
            "송신",
            "부호화",
            "펄스 진폭 크기 2진수 코드 표시"
          ],
          [
            "수신",
            "재생",
            "수신된 디지털 신호 재생"
          ],
          [
            "수신",
            "복호화",
            "PCM신호 PAM신호로 되돌리는 단계"
          ],
          [
            "수신",
            "재구성",
            "PAM 신호를 아날로그 신호로 복원"
          ]
        ],
        "gloss": "송신기 표본화·양자화·부호화, 수신기 재생·복호화·재구성"
      },
      {
        "caption": "나이퀴스트 샘플링 정리",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "개념",
            "fs≥2fm 원신호 복원 가능"
          ],
          [
            "적절한 샘플링",
            "최고주파수 2배 샘플링 조건"
          ],
          [
            "언더샘플링",
            "앨리어싱 발생"
          ]
        ],
        "gloss": "fs≥2fm, 최고주파수 2배 샘플링 시 원신호 복원 가능, 언더샘플링 앨리어싱 발생"
      }
    ]
  },
  "QAM(Quadrature Amplitude Modulation)": {
    "diagram": [
      "/concept/answer/nw-qam.webp"
    ],
    "tables": [
      {
        "caption": "16QAM 성상도",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "X 축",
            "동위상 반송파 I 축 성분"
          ],
          [
            "Y 축",
            "구상 반송파 Q 축 성분"
          ],
          [
            "심볼 코딩",
            "심볼당 n bit 코딩, 16QAM 4비트"
          ],
          [
            "심볼 표현",
            "0000 위상 φ, 진폭 a 이용"
          ],
          [
            "심볼 표현",
            "0011·0001 같은 위상, 다른 진폭"
          ],
          [
            "심볼 표현",
            "0000·1000 다른 위상, 같은 진폭"
          ],
          [
            "16 QAM",
            "진폭 3가지, 위상 12가지 활용"
          ]
        ],
        "gloss": "반송파 진폭과 위상 동시 변화, 16QAM 진폭 3가지·위상 12가지"
      },
      {
        "caption": "QAM 활용 계층적 변조 방식 예 (64QAM)",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "비트 할당",
            "심볼당 6비트 할당\n상위 2비트 QPSK 이용"
          ],
          [
            "신호 상태 좋음",
            "전체 QAM 좌표 6비트 추출"
          ],
          [
            "신호 상태 나쁨",
            "상위 2비트 QPSK 부분만 추출"
          ],
          [
            "적용",
            "DVB-T 표준 디지털 TV 적용"
          ]
        ],
        "gloss": "신호 상태 좋음 6비트 추출, 나쁨 상위 2비트 QPSK 추출"
      }
    ]
  },
  "CSMA/CD": {
    "diagram": [
      "/concept/answer/nw-csma-cd.webp"
    ],
    "tables": [
      {
        "caption": "동작원리",
        "headers": [
          "구분",
          "항목",
          "설명"
        ],
        "rows": [
          [
            "송신 준비",
            "송신 데이터 준비",
            "디바이스 송신 위해 데이터 준비"
          ],
          [
            "채널 감시",
            "채널 Free",
            "데이터 송신 후 채널 감시\n미충돌 시 프레임 전송 완료"
          ],
          [
            "채널 감시",
            "충돌 발생",
            "Jamming Signal 전송\nBack-off 방식 대기·재전송 시도"
          ],
          [
            "채널 감시",
            "채널 Busy",
            "데이터 송신 위해 채널 재탐색 수행"
          ]
        ],
        "gloss": "채널 감시 후 송신, 충돌 발생 시 Jam 신호 전송 후 Back-off 대기"
      },
      {
        "caption": "Persistent 방식 3종",
        "headers": [
          "구분",
          "방식",
          "설명"
        ],
        "rows": [
          [
            "즉시 전송",
            "1-Persistent",
            "회선 휴지 감지 시 즉시 프레임 전송"
          ],
          [
            "지연 전송",
            "Non-Persistent",
            "채널 사용 중 감지 시 임의 시간 지연"
          ],
          [
            "확률 전송",
            "P-Persistent",
            "두 방식 장단점 상호 보완\n확률값 p로 전송여부 결정"
          ]
        ],
        "gloss": "회선 휴지 감지 시 즉시·지연·확률 전송으로 충돌 최소화"
      }
    ]
  },
  "CSMA/CA": {
    "diagram": [
      "/concept/answer/nw-csma-ca.webp"
    ],
    "tables": [
      {
        "caption": "동작 절차",
        "headers": [
          "동작 절차",
          "설명"
        ],
        "rows": [
          [
            "①채널 사용 검사",
            "RTS 보내고 CTS 응답받기\nCTS 응답이 없으면 반복"
          ],
          [
            "②IFS 주기 대기",
            "SIFS, PIFS, DIFS"
          ],
          [
            "③Back off 대기",
            "백오프 후 매체 미사용이면 송출"
          ],
          [
            "④프레임 전송",
            "경쟁 윈도우 후 프레임 송출"
          ],
          [
            "⑤ACK 메시지 수신",
            "프레임 정상 전달 여부 확인"
          ]
        ],
        "gloss": "RTS 보내고 CTS 응답받기, IFS·Back off 대기 후 프레임 전송"
      },
      {
        "caption": "IFS와 Contention window",
        "headers": [
          "항목",
          "설명"
        ],
        "rows": [
          [
            "IFS",
            "휴지 채널 발견 시 즉시 전송 않음\nIFS 일정 시간 기다림"
          ],
          [
            "IFS",
            "멀리 지국 신호 앞부분 도달 여유"
          ],
          [
            "경쟁 윈도우",
            "임의 수 선택해 기다리는 휴지 시간\n휴지 채널 못 찾으면 슬롯 두 배 증가"
          ],
          [
            "경쟁 윈도우",
            "오래 기다린 지국 우선"
          ]
        ],
        "gloss": "휴지 채널 발견 시 즉시 전송 않음, IFS 기다림 후 경쟁 윈도우 대기"
      }
    ]
  },
  "다중화(Multiplexing)": {
    "diagram": [
      "/concept/answer/nw-multiplexing.webp"
    ],
    "tables": [
      {
        "caption": "다중화 종류",
        "headers": [
          "구분",
          "종류",
          "설명"
        ],
        "rows": [
          [
            "주파수 축",
            "FDM",
            "주파수 분할 대역폭 분할 사용"
          ],
          [
            "시간 축",
            "TDM",
            "타임슬롯 분할 회선 시간 분할"
          ],
          [
            "코드 축",
            "CDM",
            "상호 직교 코드 확산 대역 전송"
          ],
          [
            "파장 축",
            "WDM",
            "파장별 광신호 광섬유 다중화"
          ],
          [
            "공간 축",
            "SDM",
            "다수 물리 채널 하나의 논리 채널"
          ]
        ],
        "gloss": "주파수·시간·코드·파장·공간 축 분할로 다수 채널 전송"
      },
      {
        "caption": "다중화 vs 다원접속",
        "headers": [
          "구분",
          "다중화(Multiplexing)",
          "다원접속(Multiple Access)"
        ],
        "rows": [
          [
            "목적",
            "전송매체 효율\n통신비용 절감",
            "자원 공동 이용\n사용자 구분"
          ],
          [
            "송신측",
            "송신 지점 한 곳",
            "송신 지점 여러 곳"
          ],
          [
            "기술유형",
            "FDM·TDM·CDM·WDM·SDM",
            "FDMA·TDMA·CDMA·WDMA"
          ],
          [
            "전파방향",
            "하향 링크 방향",
            "상향 링크 방향"
          ]
        ],
        "gloss": "다중화 단일 송신국 하향 링크, 다원접속 여러 단말기 상향 링크"
      }
    ]
  },
  "서비스 프리미티브(Service Primitive)": {
    "diagram": [
      "/concept/answer/nw-service-primitive.webp"
    ],
    "tables": [
      {
        "caption": "종류",
        "headers": [
          "구분",
          "종류",
          "설명"
        ],
        "rows": [
          [
            "요청 측",
            "요청",
            "상위→하위 데이터 전송 요구\n연결 요청"
          ],
          [
            "응답 측",
            "지시",
            "하위→상위 데이터 도착 알림"
          ],
          [
            "응답 측",
            "응답",
            "상위→하위 지시 처리 통보"
          ],
          [
            "요청 측",
            "확인",
            "하위→상위 응답 도착 알림"
          ]
        ],
        "gloss": "Request, Indication, Response, Confirm 계층간 통신 서비스 기본형식"
      },
      {
        "caption": "표현 사례",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "①서비스 제공 계층",
            "L: Link, N: Network\nT: Transport, S: Session"
          ],
          [
            "② 동작 이름",
            "CONNECT, DATA 등"
          ],
          [
            "③프리미티브 방향",
            "Request, Indication\nResponse, Confirmation"
          ],
          [
            "④파라미터",
            "주소, 사용자 데이터\n원하는 서비스 형태"
          ]
        ],
        "gloss": "T.CONNECT.request 계층·동작·방향·파라미터 표현"
      }
    ]
  },
  "OSI 7 Layer (ISO 7498)": {
    "diagram": [
      "/concept/answer/nw-osi-7layer.webp"
    ],
    "tables": [
      {
        "caption": "계층별 역할과 프로토콜",
        "headers": [
          "계층",
          "상세설명",
          "프로토콜"
        ],
        "rows": [
          [
            "7 Application",
            "사용자 접근 제공\nUI·전자우편·DB 관리",
            "HTTP, SMTP, FTP"
          ],
          [
            "6 Presentation",
            "I/O 데이터 표현 형태 변환\n두 장치 일관 이해",
            "JPEG, MPEG"
          ],
          [
            "5 Session",
            "통신세션 구성\n상호작용 동기화",
            "TLS, SSH, RPC"
          ],
          [
            "4 Transport",
            "제어·에러 관리\n재전송 신뢰 보장",
            "TCP, UDP, RTP"
          ],
          [
            "3 Network",
            "다중 링크 패킷 목적지 전달\n시작~최종 전달 관리",
            "IP, ICMP, OSPF, RIP"
          ],
          [
            "2 Data Link",
            "오류 없이 프레임 장치 간 전달\nMAC 주소 참조 포트 전송",
            "PPP, HDLC, Ethernet"
          ],
          [
            "1 Physical",
            "물리 매체 비트 흐름 전송\n물리적 접속 제어",
            "RS-232C, 광 섬유, DSL"
          ]
        ],
        "gloss": "각 계층마다 특정한 서비스 제공, 이를 위한 각각 프로토콜 존재"
      },
      {
        "caption": "계층별 데이터 단위와 장비",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "데이터 단위",
            "세그먼트·패킷·프레임·비트"
          ],
          [
            "중계 장비",
            "라우터 3계층, 브리지 2계층\n리피터 1계층"
          ],
          [
            "캡슐화/역캡슐화",
            "송신 헤더 부착 하향 캡슐화\n수신 헤더 제거 상향 역캡슐화"
          ]
        ],
        "gloss": "송신 헤더 부착 하향 캡슐화, 수신 헤더 제거 상향 역캡슐화"
      }
    ]
  },
  "HTTP/3": {
    "diagram": [
      "/concept/answer/nw-http3-1.webp",
      "/concept/answer/nw-http3-2.webp"
    ],
    "tables": [
      {
        "caption": "동작 과정",
        "headers": [
          "구분",
          "동작 과정",
          "설명"
        ],
        "rows": [
          [
            "Initial 1-RTT",
            "Inchoate CHLO",
            "암호화되지 않은 CHLO 패킷 전송"
          ],
          [
            "Initial 1-RTT",
            "Rejection",
            "서버 설정·암호화 토큰 포함 패킷"
          ],
          [
            "Initial 1-RTT",
            "Complete CHLO",
            "연결 완료, 이후 암호화 통신 가능"
          ],
          [
            "Successful 0-RTT",
            "Complete CHLO",
            "이전 캐싱된 자격증명 사용\nEncrypted Request 바로 전송"
          ],
          [
            "Rejected 0-RTT",
            "1-RTT Handshake 재수행",
            "캐싱 정보 오래된 경우 수행"
          ]
        ],
        "gloss": "QUIC 기반 Initial 1-RTT Handshake 후 0-RTT로 Encrypted Request 바로 전송"
      },
      {
        "caption": "특징",
        "headers": [
          "특징",
          "설명"
        ],
        "rows": [
          [
            "0-RTT/1-RTT 연결",
            "이전 연결 캐시된 자격 증명 사용"
          ],
          [
            "HOL 블로킹 해결",
            "다중 Stream 제공\n개별 Stream 내 흐름 제어"
          ],
          [
            "멀티 스트리밍 전송",
            "멀티플렉싱 스트림 손실 최소화"
          ],
          [
            "Selective ACK",
            "오류 발생시 재전송 통해 에러 복구"
          ],
          [
            "보안성 강화",
            "1개 패킷으로 암호화된 연결 설정"
          ]
        ],
        "gloss": "UDP와 TLS 1.3 통해 성능·보안 향상, QUIC 기반 연결 및 전송 지연 최소화"
      }
    ]
  },
  "TCP 연결의 설정 및 해제(Handshaking)": {
    "diagram": [
      "/concept/answer/nw-tcp-handshake-1.webp",
      "/concept/answer/nw-tcp-handshake-2.webp"
    ],
    "tables": [
      {
        "caption": "3-way / 4-way handshake",
        "headers": [
          "구분",
          "단계",
          "설명"
        ],
        "rows": [
          [
            "3-way handshake",
            "초기연결시도",
            "서버 포트·클라이언트 ISN 지정\nSYN 세그먼트 전송"
          ],
          [
            "3-way handshake",
            "서버응답",
            "서버 ISN 포함 SYN 세그먼트 응답\n클라이언트 ISN+1 ACK 확인 응답"
          ],
          [
            "3-way handshake",
            "클라이언트 응답",
            "서버 ISN+1 ACK로 확인응답 전송"
          ],
          [
            "4-way handshake",
            "연결종료 요청",
            "Client가 Server에 연결 종료 요청"
          ],
          [
            "4-way handshake",
            "서버 ACK 신호",
            "바로 종료하지 않고 ACK 전송\nCLOSE_WAIT 상태로 넘어감"
          ],
          [
            "4-way handshake",
            "서버 FIN 신호",
            "잔여 작업 종료 후 FIN 전송"
          ],
          [
            "4-way handshake",
            "클라이언트 ACK",
            "서버 FIN 수신 ACK를 서버에 전송\nACK 받으면 서버 종료"
          ]
        ],
        "gloss": "3-way handshake로 TCP 세션 수립, 4-way handshake로 세션 종료"
      }
    ]
  },
  "TCP 혼잡제어": {
    "diagram": [
      "/concept/answer/nw-tcp-congestion.webp"
    ],
    "tables": [
      {
        "caption": "메커니즘 4단계",
        "headers": [
          "구성",
          "설명"
        ],
        "rows": [
          [
            "느린 출발",
            "초기 CWND 전송마다 2배 증가\nACK 수신 실패 시 감소"
          ],
          [
            "혼잡회피",
            "ACK 수신마다 CWND 선형 증가"
          ],
          [
            "빠른 전송",
            "다음 수신할 Sequence Number 알림\n이후 Slow Start로 전송"
          ],
          [
            "빠른 회복",
            "손실 세그먼트 전송 후 혼잡회피"
          ]
        ],
        "gloss": "Slow Start 지수 증가, 혼잡회피 선형 증가로 트래픽 양 유지"
      },
      {
        "caption": "알고리즘 유형",
        "headers": [
          "구분",
          "단계",
          "설명"
        ],
        "rows": [
          [
            "Tahoe 알고리즘",
            "Slow start",
            "임계치까지 윈도우 지수적 증가"
          ],
          [
            "Tahoe 알고리즘",
            "Congestion Avoidance",
            "임계치 도달 후 윈도우 1씩 증가"
          ],
          [
            "Tahoe 알고리즘",
            "Time out",
            "임계치를 줄이고 재시작"
          ],
          [
            "Reno 알고리즘",
            "Fast Recovery",
            "Congestion Avoidance 수행"
          ],
          [
            "New Reno 알고리즘",
            "Partial ACK 도입",
            "패킷 하나 복구에 한번의 RTT"
          ]
        ],
        "gloss": "Tahoe 초기버전, Reno Fast Recovery, New Reno Partial ACK 도입"
      }
    ]
  },
  "TCP 와 UDP 비교": {
    "diagram": [
      "/concept/answer/nw-tcp-udp-1.webp",
      "/concept/answer/nw-tcp-udp-2.webp"
    ],
    "tables": [
      {
        "caption": "TCP와 UDP 비교",
        "headers": [
          "구분",
          "TCP",
          "UDP"
        ],
        "rows": [
          [
            "연결지향",
            "연결지향 방식",
            "비연결 지향"
          ],
          [
            "주요 기능",
            "연결·순서제어\n흐름·혼잡제어",
            "비연결 비신뢰\n빠른 전송·오류 검출"
          ],
          [
            "데이터 순서",
            "순서 유지",
            "순서 미유지"
          ],
          [
            "전송속도",
            "상대적 느림",
            "상대적 빠름"
          ],
          [
            "에러체크",
            "오류제어 재전송",
            "재전송 없음"
          ],
          [
            "헤더크기",
            "20 바이트",
            "8 바이트"
          ],
          [
            "흐름제어",
            "슬라이딩 윈도우",
            "흐름제어 없음"
          ],
          [
            "사용 프로토콜",
            "HTTP, FTP, SMTP",
            "DNS, SNMP, RIP"
          ]
        ],
        "gloss": "TCP 연결지향 순서·흐름·혼잡제어, UDP 비연결 비신뢰 빠른 전송"
      },
      {
        "caption": "TCP 제어 플래그 (6종)",
        "headers": [
          "플래그",
          "설명"
        ],
        "rows": [
          [
            "①URG",
            "긴급 데이터 순서 무관 우선 송신"
          ],
          [
            "②ACK",
            "확인응답 번호 필드 설정"
          ],
          [
            "③PSH",
            "버퍼링 없이 즉시 응용에 전달"
          ],
          [
            "④RST",
            "연결 회선 강제 리셋 요청"
          ],
          [
            "⑤SYN",
            "연결 설정 초기화 순서번호 동기화"
          ],
          [
            "⑥FIN",
            "송신 종료 통보"
          ]
        ],
        "gloss": "TCP 헤더 제어플래그 6종으로 연결 설정·종료 제어"
      }
    ]
  },
  "IPv4와 IPv6 터널링": {
    "diagram": [
      "/concept/answer/nw-ipv4-ipv6-tunneling.webp"
    ],
    "tables": [
      {
        "caption": "유형",
        "headers": [
          "구분",
          "유형",
          "설명"
        ],
        "rows": [
          [
            "병행",
            "듀얼 스택",
            "양쪽 스택 탑재 라우터에 장착\nDNS 지원 필요, 스택 수정 비용"
          ],
          [
            "경유",
            "터널링",
            "IPv4 터널 중간 구간 통과\n패킷 캡슐화 양쪽 망 연결"
          ],
          [
            "변환",
            "주소 변환",
            "주소변환기 양 망 상호 연동\nG/W 연동 스택 수정 불필요"
          ]
        ],
        "gloss": "듀얼 스택 병행, 터널링 경유, 주소 변환으로 IPv4·IPv6 연동"
      },
      {
        "caption": "주소 변환 방식",
        "headers": [
          "구분",
          "방식",
          "설명"
        ],
        "rows": [
          [
            "네트워크 계층",
            "헤더변환 방식",
            "헤더 직접 변환, 양방향 변환"
          ],
          [
            "전송 계층",
            "수송계층 릴레이 방식",
            "전송 계층 중계, 양쪽 연결 중계"
          ],
          [
            "응용 계층",
            "응용계층 게이트웨이 방식",
            "응용 프락시 응용 계층 중계\nHTTP 중계 프로토콜 변환"
          ]
        ],
        "gloss": "주소 변환 헤더변환·수송계층 릴레이·응용계층 게이트웨이 방식"
      }
    ]
  },
  "DNS(Domain Name System)": {
    "diagram": [
      "/concept/answer/nw-dns.webp"
    ],
    "tables": [
      {
        "caption": "동작 원리",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "1",
            "Client 등록된 DNS 서버에 IP 질의\nRecursive Query"
          ],
          [
            "2",
            "등록되지 않은 이름 Root에 질의\nIterative Query"
          ],
          [
            "3",
            "Root DNS서버 TLD DNS서버 IP제공"
          ],
          [
            "4",
            "로컬 DNS서버 TLD DNS서버에 질의"
          ],
          [
            "5",
            ".com DNS서버 test.com 정보 제공"
          ],
          [
            "6",
            "로컬 DNS서버 ns.test.com에 질의"
          ],
          [
            "7",
            "ns.test.com www 호스트명 IP 제공"
          ],
          [
            "8",
            "로컬 DNS서버 Client에 IP 제공"
          ],
          [
            "9",
            "Client 제공받은 IP로 접속"
          ]
        ],
        "gloss": "Client Recursive Query, 로컬 DNS서버 Iterative Query로 IP 변환"
      },
      {
        "caption": "주요 기능",
        "headers": [
          "기능",
          "상세 내용"
        ],
        "rows": [
          [
            "Name Resolution",
            "URL을 IP Address로 변환"
          ],
          [
            "Host Aliasing",
            "단일 IP 호스트에 다양한 별칭 부여"
          ],
          [
            "Load Distribution",
            "단일 URL 복수 IP 설정 부하 분산"
          ]
        ],
        "gloss": "Host Name 또는 URL을 IP Address로 변환, 별칭 부여, 부하 분산"
      }
    ]
  },
  "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)": {
    "diagram": [
      "/concept/answer/nw-routing-1.webp",
      "/concept/answer/nw-routing-2.webp"
    ],
    "tables": [
      {
        "caption": "거리벡터(Distance Vector Routing)",
        "headers": [
          "구분",
          "항목",
          "설명"
        ],
        "rows": [
          [
            "정의",
            "정의",
            "이웃 갱신 정보 주기적 경로 결정\n벨만-포드 홉 수 기반 계산"
          ],
          [
            "동작방식",
            "동작방식 ①",
            "C노드 테이블 정보 수신"
          ],
          [
            "동작방식",
            "동작방식 ②",
            "A노드 비용 고려 정보 반영"
          ],
          [
            "동작방식",
            "동작방식 ③",
            "변경 전후 테이블 정보 비교"
          ],
          [
            "동작방식",
            "동작방식 ④",
            "홉 수 큰 값이면 최소값 갱신\n아니면 유지"
          ],
          [
            "프로토콜",
            "RIP",
            "이웃 경로 비교 적은 값 갱신"
          ],
          [
            "프로토콜",
            "IGRP",
            "전송능력·지연·사용률·신뢰성\n복합 지표 경로, 로드밸런싱"
          ]
        ],
        "gloss": "이웃 라우터 주기적 갱신정보로 홉 수 기반 경로 결정"
      },
      {
        "caption": "링크상태(Link State Routing)",
        "headers": [
          "구분",
          "항목",
          "설명"
        ],
        "rows": [
          [
            "정의",
            "정의",
            "링크 비용 합 최소 경로 계산\n다익스트라 기반"
          ],
          [
            "동작방식",
            "동작방식 ①",
            "이웃 라우터 링크 상태정보 수집"
          ],
          [
            "동작방식",
            "동작방식 ②",
            "링크 정보로 토폴로지 DB 생성"
          ],
          [
            "동작방식",
            "동작방식 ③",
            "목적지 경로 SPF 계산"
          ],
          [
            "동작방식",
            "동작방식 ④",
            "최단 경로 SPF 트리 생성"
          ],
          [
            "동작방식",
            "동작방식 ⑤",
            "SPF 트리 기반 라우팅 테이블 생성"
          ],
          [
            "프로토콜",
            "OSPF",
            "링크 상태 수집 최적 경로 계산"
          ]
        ],
        "gloss": "LSA 수집, 토폴로지 DB, SPF 계산으로 라우팅 테이블 생성"
      }
    ]
  },
  "FEC(Forward Error Correction) / BEC(Backward Error Correction)": {
    "diagram": [
      "/concept/answer/nw-fec-bec-1.webp",
      "/concept/answer/nw-fec-bec-2.webp"
    ],
    "tables": [
      {
        "caption": "FEC (전진 오류 정정)",
        "headers": [
          "분류",
          "기법",
          "설명"
        ],
        "rows": [
          [
            "블록 코드",
            "해밍 코드",
            "패리티 비트 위치로 오류 비트 정정"
          ],
          [
            "블록 코드",
            "RS 코드",
            "비2진 순환부호, 정정능력 우수\n랜덤·연집 오류 모두 정정"
          ],
          [
            "논블록 코드",
            "길쌈 코드",
            "Convolutional Code\n과거 입력신호 함께 활용"
          ],
          [
            "논블록 코드",
            "터보 코드",
            "길쌈부호 조합 랜덤 병렬 연접"
          ]
        ],
        "gloss": "FEC 송신 시 잉여비트 추가, 수신측 자체 오류 복원, 재전송 없음"
      },
      {
        "caption": "BEC (후진 오류 정정)",
        "headers": [
          "분류",
          "기법",
          "설명"
        ],
        "rows": [
          [
            "오류 검출",
            "Parity Check\nBlock Sum",
            "끝에 한 비트 추가, 1의 개수 판단\n이차원 패리티, 가로·세로 검사"
          ],
          [
            "오류 검출",
            "CRC\nCheck Sum",
            "이진 나눗셈 연산 기반 오류 검출\n합계 보수화 전송, 수신 측 합산"
          ],
          [
            "재전송",
            "Stop and Wait\nGo-Back-N",
            "1개 프레임 송신, ACK/NAK 전송\n오류 프레임부터 재전송"
          ],
          [
            "재전송",
            "Selective-Repeat\nAdaptive ARQ",
            "오류 프레임만 재전송\n채널 효율 위해 블록 길이 동적 변경"
          ]
        ],
        "gloss": "BEC 수신측 오류 검출 후 송신측에 통보, 재전송 방식으로 정정"
      }
    ]
  },
  "해밍코드(Hamming code)": {
    "tables": [
      {
        "caption": "송수신, 오류검출 및 정정 절차",
        "headers": [
          "절차",
          "설명"
        ],
        "rows": [
          [
            "1. Parity 수 결정",
            "2^p ≥ d+p+1\n데이터 비트 4 → 패리티 3"
          ],
          [
            "2. Parity 위치 결정",
            "2^0~(p-1) 위치에 삽입\n패리티 4개면 1,2,4,8번째"
          ],
          [
            "3. Parity 값 결정",
            "짝수 패리티 해당 비트 검사\nP1~P8 값 각각 결정"
          ],
          [
            "4. 데이터 위치 지정",
            "전송 데이터 88(1011000)\n비트 위치에 배치"
          ],
          [
            "5. 해밍 코드 생성",
            "1 위치 확인 7, 9, 11\nXOR 연산 결과 0101"
          ],
          [
            "6. 생성 결과",
            "XOR 0101 생성 코드 완성"
          ]
        ],
        "gloss": "Parity bit 수·위치·값 결정 후 XOR 연산으로 해밍 코드 생성"
      },
      {
        "caption": "오류 검출 및 정정",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "7. 패리티 영역 검사",
            "P1~P8 영역 짝수 패리티 검사"
          ],
          [
            "8. 정상 전송 검증",
            "검사결과 0이면 정상 전송"
          ],
          [
            "9. 오류 검출",
            "0 아닌 결과 전송 오류 발생"
          ],
          [
            "10. 오류 정정",
            "검사값 나열 오류 위치 산출\n2진→10진 해당 비트 반전"
          ]
        ],
        "gloss": "P1~P8 검사결과 0이면 정상, 아니면 2진으로 오류정정"
      }
    ]
  },
  "CRC(Cyclic Redundancy Check)": {
    "diagram": [
      "/concept/answer/nw-crc.webp"
    ],
    "tables": [
      {
        "caption": "CRC 처리 과정",
        "headers": [
          "단계",
          "설명",
          "특징 및 관련요소"
        ],
        "rows": [
          [
            "Encoding",
            "Divisor로 나눔\n코드 워드 생성",
            "Divisor 대수다항식 표현\nx⁸+x²+x+1"
          ],
          [
            "Transmission",
            "코드 워드 수신측 전송",
            "비신뢰 전송\n손실·중복 가능"
          ],
          [
            "Decoding",
            "Divisor로 나눔\n나머지 0 → 정상",
            "0 아니면 에러\n재전송 요청"
          ]
        ],
        "gloss": "Divisor 나눗셈 나머지로 에러 검출, 0 아니면 재전송 요청"
      },
      {
        "caption": "CRC 계산 예시",
        "headers": [
          "구분",
          "상세 설명"
        ],
        "rows": [
          [
            "데이터 워드",
            "1011010"
          ],
          [
            "다항식",
            "CRC-8 = X⁸+X²+X+1\n100000111"
          ],
          [
            "코드 워드 계산",
            "XOR 연산 나눗셈\n나머지 10000001"
          ],
          [
            "전송 데이터",
            "101101010000001"
          ]
        ],
        "gloss": "데이터 워드 + CRC 나머지 = 코드 워드, 전송 데이터"
      }
    ]
  },
  "QoS(Quality of Service)": {
    "diagram": [
      "/concept/answer/nw-qos-1.webp",
      "/concept/answer/nw-qos-2.webp"
    ],
    "tables": [
      {
        "caption": "관리 기술",
        "headers": [
          "구분",
          "기술 요소",
          "상세 설명"
        ],
        "rows": [
          [
            "데이터 Path\n매커니즘",
            "분류기·표시기·미터\n폐기처리기·쉐이퍼",
            "라우터 개별 패킷 처리"
          ],
          [
            "트래픽 쉐이핑",
            "Leaky Bucket\nToken Bucket",
            "버킷 속도 평준화\n토큰 유무로 제어"
          ],
          [
            "혼잡제어",
            "RED\nWRED",
            "혼잡 전 랜덤 폐기\n가중치 RED 적용"
          ],
          [
            "수락제어",
            "전송 정책",
            "전송 대상 결정"
          ],
          [
            "큐잉",
            "Priority Queuing\nWFQ",
            "클래스별 FIFO\n가중 RR 방식"
          ]
        ],
        "gloss": "패킷 분류·쉐이핑·혼잡제어·큐잉으로 트래픽 정책별 제어"
      },
      {
        "caption": "주요 지표 [대지터패]",
        "headers": [
          "주요 지표",
          "설명"
        ],
        "rows": [
          [
            "대역폭",
            "최대 데이터 처리 능력"
          ],
          [
            "지연",
            "주파수 따라 겪는 시간 지연"
          ],
          [
            "지터",
            "펄스 파형 시간축 상 흐트러짐"
          ],
          [
            "패킷 손실",
            "패킷 왕복 중 데이터 유실"
          ]
        ],
        "gloss": "대지터패 주요 지표: 대역폭·지연·지터·패킷 손실"
      }
    ]
  },
  "ARP(Address Resolution Protocol)": {
    "diagram": [
      "/concept/answer/nw-arp-1.webp",
      "/concept/answer/nw-arp-2.webp"
    ],
    "tables": [
      {
        "caption": "동작 원리 — MAC Address 요청·회신",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "요청 ①",
            "D의 MAC 필요 IP 인지 상태"
          ],
          [
            "요청 ②",
            "ARP 요청 패킷 생성\n목적지 MAC FF:FF:FF:FF:FF:FF"
          ],
          [
            "요청 ③",
            "브로드캐스트 네트워크 전파"
          ],
          [
            "회신 ①",
            "수신 IP 확인 자기 주소 판단"
          ],
          [
            "회신 ②",
            "ARP 응답 패킷 생성\n출발·목적 주소 반전"
          ],
          [
            "회신 ③",
            "유니캐스트 호스트 A 전달"
          ],
          [
            "회신 ④",
            "캐시 테이블 수정 MAC 등록"
          ]
        ],
        "gloss": "요청은 모두에게 Broadcast, 응답은 요청자에게만 Unicast"
      }
    ]
  },
  "RARP(Reverse Address Resolution Protocol)": {
    "diagram": [
      "/concept/answer/nw-rarp-1.webp",
      "/concept/answer/nw-rarp-2.webp"
    ],
    "tables": [
      {
        "caption": "동작 원리",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "RARP Request",
            "RARP 주소 몰라 Request Broadcast"
          ],
          [
            "RARP Request",
            "모든 컴퓨터 수신, 서버만 응답"
          ],
          [
            "RARP Response",
            "서버 2대 이상이면 모두 응답"
          ],
          [
            "RARP Response",
            "첫 Response만 수신, 나머지 무시"
          ]
        ],
        "gloss": "RARP Request는 broadcast, 서버만 응답하고 Reply는 unicast"
      },
      {
        "caption": "ARP와 RARP 비교",
        "headers": [
          "구분",
          "ARP",
          "RARP"
        ],
        "rows": [
          [
            "변환 방향",
            "IP → MAC",
            "MAC → IP"
          ],
          [
            "상황",
            "상대 IP 인지\nMAC 미인지",
            "자신 MAC 인지\nIP 미인지"
          ],
          [
            "요청",
            "브로드캐스트",
            "브로드캐스트"
          ],
          [
            "응답",
            "유니캐스트\n해당 호스트",
            "유니캐스트\nRARP 서버"
          ]
        ],
        "gloss": "ARP는 IP → MAC, RARP는 MAC → IP 변환, 요청은 모두 브로드캐스트"
      }
    ]
  },
  "DHCP(Dynamic Host Configuration Protocol)": {
    "diagram": [
      "/concept/answer/nw-dhcp-1.webp",
      "/concept/answer/nw-dhcp-2.webp"
    ],
    "tables": [
      {
        "caption": "DHCP IP 할당 과정",
        "headers": [
          "단계",
          "할당 과정",
          "설명"
        ],
        "rows": [
          [
            "①",
            "DISCOVER",
            "Client Broadcast Discover 전송"
          ],
          [
            "②",
            "OFFER",
            "Server Unicast Offer 전송\n제안 IP주소, 임대시간, DNS 정보"
          ],
          [
            "③",
            "REQUEST",
            "Client Broadcast Request 전송\n제안 IP 주소 사용 승인 의사"
          ],
          [
            "④",
            "ACK",
            "Server Unicast Ack 전송\n제안 IP 최종 승인, 할당 종료"
          ]
        ],
        "gloss": "DISCOVER·OFFER·REQUEST·ACK 4단계 할당, UDP 68 → 67"
      },
      {
        "caption": "IP 갱신·해제 과정",
        "headers": [
          "단계",
          "갱신 과정",
          "설명"
        ],
        "rows": [
          [
            "갱신 ①",
            "REQUEST",
            "Client Unicast 연장 의사 전달\n임대시간 50% 남은 시점"
          ],
          [
            "갱신 ②",
            "ACK",
            "Server Unicast Ack 전송\nIP 사용 연장 최종 승인"
          ],
          [
            "해제 ①",
            "RELEASE",
            "Client Unicast 종료 의사 전달\nServer 응답 없이 IP 할당 해제"
          ]
        ],
        "gloss": "임대시간 50% 남은 시점 연장 REQUEST, RELEASE로 해제"
      }
    ]
  },
  "SCTP(Stream Control Transmission Protocol)": {
    "diagram": [
      "/concept/answer/nw-sctp-1.webp",
      "/concept/answer/nw-sctp-2.webp"
    ],
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "기술요소",
          "설명"
        ],
        "rows": [
          [
            "Multi Homing",
            "여러 IP 주소 동시 사용\n장애 시 대체 경로로 세션 유지"
          ],
          [
            "Multi Streaming",
            "하나의 세션, 다양한 응용데이터"
          ],
          [
            "4-way Handshake",
            "세션 초기화 4단계절차 구성\nINIT·INIT-ACK·ECO·ACK 교환"
          ],
          [
            "SACK & HEARTBEAT",
            "SACK 오류 제어\nHEARTBEAT로 가용 IP 파악"
          ],
          [
            "3-way Handshake",
            "3단계 세션종료\n'Half-open Closing' 해결"
          ]
        ],
        "gloss": "Multi Homing으로 세션 유지, SACK·HEARTBEAT로 오류 제어"
      }
    ]
  },
  "C-RAN(Centralized / Cloud RAN)": {
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "구분",
          "기술요소",
          "설명"
        ],
        "rows": [
          [
            "구성 요소",
            "RU",
            "DU 디지털 신호 RF 신호로 변환\n안테나 송·수신 변환 장치"
          ],
          [
            "구성 요소",
            "Centralized DU",
            "클라우드 센터 형태 한 곳에 집중\n셀 간의 간섭 조정 용이"
          ],
          [
            "인터페이스 규격",
            "CPRI",
            "REC와 RE 간 송·수신\nUser Data, 제어/관리, 동기 정보"
          ],
          [
            "인터페이스 규격",
            "OBSAI",
            "개방형 기지국 구조 목표\nRP로 모듈 연결"
          ],
          [
            "인터페이스 규격",
            "ORI",
            "CPRI 호환성 한계 극복\nETSI 주도 표준화"
          ]
        ],
        "gloss": "DU와 RF 분리, DU 중앙 집중 처리와 프론트홀 인터페이스 규격"
      }
    ]
  },
  "O-RAN": {
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구성 요소",
          "기반 기술",
          "설명"
        ],
        "rows": [
          [
            "RIC",
            "RIC near-RT\nRIC non-RT",
            "수집·분석 기반 RAN 제어 최적화"
          ],
          [
            "O-CU",
            "RRC·SDAP·PDCP",
            "RRC·PDCP 실행 중앙 집중 장치\nMidhaul로 여러 O-DU 제어"
          ],
          [
            "O-DU",
            "RLC·MAC·High PHY",
            "O-RU 근처 위치\nRLC·MAC·PHY 일부 실행 분산 장치"
          ],
          [
            "O-RU",
            "DFE·RF FE\nLow PHY·Beamforming",
            "안테나 근처 위치\n무선 신호→디지털 신호 변환"
          ]
        ],
        "gloss": "RIC가 O-CU·O-DU·O-RU 제어하는 RAN 개방형 아키텍처"
      },
      {
        "caption": "아키텍처 인터페이스",
        "headers": [
          "인터페이스",
          "구간"
        ],
        "rows": [
          [
            "A1",
            "RIC non-RT ↔ RIC near-RT"
          ],
          [
            "E2",
            "RIC near-RT ↔ CU/DU"
          ],
          [
            "E1",
            "CU-CP ↔ CU-UP"
          ],
          [
            "F1",
            "CU ↔ O-DU"
          ],
          [
            "Open Front Haul",
            "O-DU ↔ O-RU"
          ]
        ],
        "gloss": "O-RAN 아키텍처 A1·E2·E1·F1·Open Front Haul 인터페이스 구간"
      }
    ]
  },
  "RAN(Radio Access Network) Sharing": {
    "diagram": [
      "/concept/answer/nw-ran-sharing-1.webp",
      "/concept/answer/nw-ran-sharing-2.webp",
      "/concept/answer/nw-ran-sharing-3.webp"
    ],
    "tables": [
      {
        "caption": "공유 방식 비교",
        "headers": [
          "구분",
          "개념"
        ],
        "rows": [
          [
            "MOCN",
            "주파수·기지국·컨트롤러 공유\n코어망 별도"
          ],
          [
            "MORAN",
            "기지국·컨트롤러 공유\n주파수 구분, 코어망 별도"
          ],
          [
            "GWCN",
            "주파수·기지국·컨트롤러 공유\nMME·S-GW 공유, P-GW 별도"
          ]
        ],
        "gloss": "공유 범위 순서: 주파수 분리 MORAN < MOCN < 코어망 공유 GWCN"
      },
      {
        "caption": "공유 방식 비교 — 장단점",
        "headers": [
          "구분",
          "장점",
          "단점"
        ],
        "rows": [
          [
            "MOCN",
            "구현·비용 유리\n공유 비용 절감",
            "차별화 어려움\n공용 RAN 사용"
          ],
          [
            "MORAN",
            "차별화 가능\n대역폭 조절",
            "구현·비용 불리\n절감 효과 저하"
          ],
          [
            "GWCN",
            "비용 유리\n공유 요소 증대",
            "구현 불리\n복잡성 증대"
          ]
        ],
        "gloss": "공유 요소 증대 시 비용 유리, 차별화 어려움, 구현 불리"
      }
    ]
  },
  "5G 특화망": {
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구분",
          "구성 요소",
          "설명"
        ],
        "rows": [
          [
            "무선 자원",
            "5G 주파수",
            "5G 주파수 or 독자 주파수\n4.7GHz, 28GHz"
          ],
          [
            "코어",
            "UPF",
            "패킷 라우팅 및 포워딩\n패킷 검사, QoS 처리"
          ],
          [
            "엣지",
            "MEC",
            "사용자 인접 MEC 서버 처리\n저지연 요구사항 만족"
          ],
          [
            "접속",
            "gNB",
            "5G 무선 네트워크 기지국"
          ]
        ],
        "gloss": "전용 주파수 기반 코어·엣지·접속 구성, OSS가 관리"
      },
      {
        "caption": "기술 요소",
        "headers": [
          "기술",
          "설명"
        ],
        "rows": [
          [
            "SDN",
            "Control·Data Plane 분리 SW 정의"
          ],
          [
            "NFV",
            "장비 네트워크 기능 가상화"
          ],
          [
            "Network Slicing",
            "SDN, NFV 기반 용도별 논리적 분리"
          ],
          [
            "Open RAN",
            "CU/DU/RU 분리, 개방형 표준"
          ],
          [
            "RAN Sharing",
            "사설망과 공중망 간 gNB 공유"
          ]
        ],
        "gloss": "SDN·NFV·Network Slicing·Open RAN 기반 맞춤형 네트워크"
      }
    ]
  },
  "네트워크 슬라이싱": {
    "tables": [
      {
        "caption": "핵심기술 SDN·NFV",
        "headers": [
          "구분",
          "기술 요소",
          "설명"
        ],
        "rows": [
          [
            "SDN",
            "application",
            "Network OS 위 사용자 서비스 지원"
          ],
          [
            "SDN",
            "Control plane",
            "Global View로 전체 망 제어\nOpenflow로 Flow Table 제어"
          ],
          [
            "SDN",
            "Data plane",
            "단순 패킷 포워딩·스위칭만 구현"
          ],
          [
            "NFV",
            "NFVI",
            "물리 HW 자원: 컴퓨팅·저장소·N/W\n가상화·VNF 실행 지원 기능"
          ],
          [
            "NFV",
            "VNFs",
            "응용 지원 S/W 네트워크 기능 집합"
          ],
          [
            "NFV",
            "MANO",
            "물리적·소프트웨어적 자원 관리\nVNF 관리 기능"
          ]
        ],
        "gloss": "SDN 제어 분리와 NFV 가상화로 논리적 네트워크 분리"
      },
      {
        "caption": "슬라이스 예시",
        "headers": [
          "슬라이스",
          "대상 서비스"
        ],
        "rows": [
          [
            "통신/인터넷망",
            "Mobile\n통신, 인터넷"
          ],
          [
            "물류/기후망",
            "Massive IoT\n물류, 기후"
          ],
          [
            "스마트카\n스마트 팩토리",
            "Mission critical\n스마트카, 스마트 팩토리"
          ]
        ],
        "gloss": "물리적 하나의 네트워크, 서로 다른 특성 서비스에 특화된 전용 Slice 제공"
      }
    ]
  },
  "NWDAF(Network Data Analytics Function)": {
    "tables": [
      {
        "caption": "표준 기능",
        "headers": [
          "구분",
          "핵심 기능",
          "설명"
        ],
        "rows": [
          [
            "AnLF",
            "분석 논리 함수\n머신 러닝 기반 추론",
            "분석 정보 도출·분석 서비스 제공\n분석 요청 수집·소비자 응답"
          ],
          [
            "MTLF",
            "모델 학습 논리 함수\n머신 러닝 학습",
            "ML 모델 학습·새 ML 모델 제공\n추론 마이크로서비스 학습·배포"
          ],
          [
            "DCCF",
            "데이터 요청 관리",
            "동일 요청 시 기존 결과 NWDAF 전송\n아니면 OAM/NF 데이터 전송"
          ],
          [
            "ADRF",
            "분석 데이터 저장소",
            "필요한 과거 데이터 저장"
          ],
          [
            "MFAF",
            "메시징 프레임워크 어댑터",
            "수집 데이터 AnLF에 전달"
          ]
        ],
        "gloss": "AnLF 추론·MTLF 학습, DCCF·ADRF·MFAF 데이터 관리"
      }
    ]
  },
  "네트워크 지능": {
    "tables": [
      {
        "caption": "적용 기술",
        "headers": [
          "구분",
          "핵심요소",
          "설명"
        ],
        "rows": [
          [
            "기술요소",
            "인공지능/머신러닝",
            "상태 정보·이벤트·로그 자동 수집\n수집 데이터 분석, 의사결정 지원"
          ],
          [
            "기술요소",
            "빅데이터 분석기술",
            "데이터 수집·분석·통계 정보 제공\n대용량·다양한 유형 데이터 처리"
          ],
          [
            "기술요소",
            "클라우드·엣지 컴퓨팅 기술",
            "가변적 컴퓨팅 자원 할당\n집중형·분산형 HW 플랫폼 제공"
          ],
          [
            "기술요소",
            "SDN/NFV",
            "네트워크 지능 기술 기반 환경 제공\n제어·정책 실시간 적용"
          ],
          [
            "관리요소",
            "폐쇄형 반복 제어",
            "데이터 자동 수집→AI 분석\n피드백 과정 반복 자동 제어"
          ],
          [
            "관리요소",
            "OAM / MANO",
            "의사결정·정책 실시간 적용\n물리자원·가상자원 관리"
          ]
        ],
        "gloss": "AI 기반 자율의사결정과 Closed-loop control로 완전 자동화"
      }
    ]
  },
  "6G": {
    "tables": [
      {
        "caption": "6G 이동통신 비전",
        "headers": [
          "비전",
          "6G 이동통신 기술",
          "기술설명 및 성능 목표"
        ],
        "rows": [
          [
            "초성능",
            "Tbps급 무선통신\nTbps급 광인프라",
            "최대 속도 1Tbps\n체감 1Gbps 이상"
          ],
          [
            "초대역",
            "6G 지원 RF 기술\n주파수 확보",
            "100GHz 이상 대역\n대역폭 수십 GHz"
          ],
          [
            "초현실",
            "초실감 3D 미디어\n방송·통신 융합",
            "실시간 홀로그램\n초실감 통신 구현"
          ],
          [
            "초지능",
            "지능형 무선 엑세스 네트워크",
            "기계 학습 구현\n실시간 요구 적용"
          ],
          [
            "초정밀",
            "종단간 초저지연\n고정밀·고가용",
            "무선 지연 0.1ms\n종단 간 수 ms"
          ],
          [
            "초공간",
            "3차원 이동체\n브로드밴드 무선",
            "지원속도 1000km\n고도 지상 10km"
          ]
        ],
        "gloss": "초성능·초대역·초현실·초지능·초정밀·초공간 비전과 성능 목표"
      },
      {
        "caption": "5G와 차이점 비교",
        "headers": [
          "비교 항목",
          "6G 이동통신",
          "5G 이동통신"
        ],
        "rows": [
          [
            "활용대역",
            "100GHz 이상",
            "100GHz 이하"
          ],
          [
            "최대전송속도",
            "1Tbps",
            "20Gbps"
          ],
          [
            "체감전송속도",
            "1Gbps",
            "100Mbps"
          ],
          [
            "무선구간지연",
            "0.1ms 이하",
            "1ms 이하"
          ],
          [
            "단말기밀도",
            "100만개/km³",
            "100만개/km²"
          ]
        ],
        "gloss": "6G는 5G 대비 최대전송속도 50배, 체감전송속도 10배"
      }
    ]
  },
  "ISAC(Integrated Sensing and Communication)": {
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "계층",
          "핵심 기술",
          "설명"
        ],
        "rows": [
          [
            "응용 서비스",
            "디지털트윈\nSDN, NFV",
            "위치·환경 데이터 기반 트윈 구현\n산업별 맞춤형 가치 서비스 제공"
          ],
          [
            "통합설계/지능화",
            "NWDAF, MEC, Network Slicing\nAI/ML, ZTNA, PQC",
            "AI·MEC 활용 센싱 데이터 분석\n통신·감지 간 자원 활용 최적화"
          ],
          [
            "인프라 및 자원",
            "O-RAN, SDR, XL-MIMO, RIS\nNTN 비지상 네트워크",
            "6G 주파수·지능형 안테나 기술\n신호 전송·고정밀 환경 감지 기반"
          ]
        ],
        "gloss": "응용 서비스, 통합설계/지능화, 인프라 및 자원 계층으로 통신·감지 통합"
      },
      {
        "caption": "ISAC 기술 구현 과제와 해결방안",
        "headers": [
          "항목",
          "기술 구현 과제",
          "해결 방안"
        ],
        "rows": [
          [
            "신호처리",
            "복잡한 신호 처리\n간섭 제어",
            "통합 파형 설계\n신호 재구성 알고리즘 적용"
          ],
          [
            "하드웨어 설계",
            "통신·감지 통합\n단일 칩셋 설계",
            "무선주파수 집적회로 칩셋 설계"
          ],
          [
            "스펙트럼 규제",
            "주파수할당 규제 체계 재검토",
            "Network Slicing 동적 자원 할당"
          ],
          [
            "보안 및 프라이버시",
            "사용자 위치, 민감 정보 보호",
            "물리계층 보안\nSLAM 정보 부분 추출 활용"
          ]
        ],
        "gloss": "통합 파형·단일 칩셋·Network Slicing·물리계층 보안으로 과제 해결"
      }
    ]
  },
  "디지털 트윈 네트워크(Digital Twin Network)": {
    "diagram": [
      "/concept/answer/nw-digital-twin-network.webp"
    ],
    "tables": [
      {
        "caption": "참조 아키텍처 구성요소 — 계층",
        "headers": [
          "계층",
          "설명"
        ],
        "rows": [
          [
            "6G 물리적 네트워크",
            "실제 6G 망 물리적 네트워크\n트윈 계층과 데이터·메시지 교환"
          ],
          [
            "데이터 도메인",
            "데이터 수집·저장·서비스·관리"
          ],
          [
            "모델 도메인",
            "수집 데이터 기반 객체 모델 구성"
          ],
          [
            "관리 도메인",
            "모델 관리·보안 관리 기능 수행"
          ],
          [
            "6G 네트워크\n애플리케이션",
            "인텐트 기반 서비스 모의\n제어 메시지 물리 계층 전송"
          ]
        ],
        "gloss": "물리적 네트워크·디지털 트윈·애플리케이션 계층, 트윈은 데이터·모델·관리 도메인"
      },
      {
        "caption": "디지털 트윈 네트워크 특징",
        "headers": [
          "구분",
          "특징",
          "설명"
        ],
        "rows": [
          [
            "입력",
            "데이터",
            "기본 구성 요소\n통합 저장소, 정확한 모델 제공"
          ],
          [
            "연결",
            "매핑",
            "물리·가상 매핑 양방향 대응\n실시간 상호작용 시뮬레이션 차별"
          ],
          [
            "표현",
            "모델",
            "다양한 모델 트윈 내장\n유연한 결합 망 응용 지원"
          ],
          [
            "연결",
            "인터페이스",
            "물리적 네트워크·가상 트윈 연결\n응용 인터페이스 정보 교환"
          ]
        ],
        "gloss": "데이터 입력, 매핑·인터페이스 연결, 모델 표현 특징"
      }
    ]
  },
  "Hyper-AI 네트워크": {
    "tables": [
      {
        "caption": "추진방향",
        "headers": [
          "목표",
          "추진방향",
          "설명"
        ],
        "rows": [
          [
            "네트워크 전면 구축",
            "이동통신 인프라 고도화",
            "'30년 6G 상용화 목표\n지능형 기지국 AI-RAN 구축"
          ],
          [
            "네트워크 전면 구축",
            "광통신망 대용량·지능화",
            "백본망 용량 4배 이상 확대\n운영 지능화·자동화"
          ],
          [
            "네트워크 전면 구축",
            "국제망 경쟁력 강화",
            "해저케이블 용량 2배 이상 확대\n저궤도 위성통신 핵심기술 확보"
          ],
          [
            "산업 1등 국가",
            "기술 개발",
            "6G 핵심기술 R&D\n표준특허 점유율 30% 목표"
          ],
          [
            "산업 1등 국가",
            "수요 창출",
            "5대 분야 선도 실증\n산업 초기 수요 창출"
          ],
          [
            "산업 1등 국가",
            "제도 개선",
            "6G·AI-RAN R&D·투자 세제 혜택\n6G 주파수 전략 수립"
          ]
        ],
        "gloss": "초지능·초성능 네트워크 전면 구축과 6G·AI네트워크 산업 1등 국가 양대 목표"
      },
      {
        "caption": "향후 추진과제",
        "headers": [
          "구분",
          "As-Is",
          "최종 목표"
        ],
        "rows": [
          [
            "6G 표준",
            "5G 표준특허 2위",
            "2030 6G 표준특허 30% 선점"
          ],
          [
            "글로벌 시장진출",
            "글로벌 RAN시장 점유율 5%",
            "2030 글로벌 RAN시장 점유율 20%"
          ],
          [
            "기업 육성",
            "매출액 1,000억원 기업 10개",
            "2030 매출액 5,000억 기업 5개 육성"
          ]
        ],
        "gloss": "2030 6G 표준특허 30% 선점, 점유율 1위 국가 최종 목표"
      }
    ]
  },
  "비지상네트워크(NTN, Non-Terrestrial Networks)": {
    "diagram": [
      "/concept/answer/nw-ntn.webp"
    ],
    "tables": [
      {
        "caption": "구성요소",
        "headers": [
          "구분",
          "내역",
          "설명"
        ],
        "rows": [
          [
            "구성요소",
            "사용자 단말",
            "5G 스마트폰·태블릿·IoT 기기"
          ],
          [
            "구성요소",
            "피더 링크",
            "위성과 게이트웨이 사이 링크"
          ],
          [
            "구성요소",
            "서비스 링크",
            "단말과 위성 사이 링크\n3GPP 정의 NR 기반"
          ],
          [
            "구성요소",
            "위성 간 링크",
            "위성 간 링크"
          ],
          [
            "구성요소",
            "Transparent 위성\nRegenerative 위성",
            "정지궤도·저궤도 등 위성 활용"
          ],
          [
            "구성요소",
            "고고도 플랫폼",
            "성층권 비행선·드론 집중 서비스"
          ],
          [
            "구성요소",
            "드론",
            "저고도 운용, 한시적 서비스"
          ]
        ],
        "gloss": "위성·고고도 플랫폼·드론을 서비스 링크·피더 링크로 연동"
      },
      {
        "caption": "기술요소",
        "headers": [
          "구분",
          "내역",
          "설명"
        ],
        "rows": [
          [
            "기술요소",
            "전송 기술",
            "위성·HAPS·드론과 지상 간 통신\n빔포밍, MIMO"
          ],
          [
            "기술요소",
            "네트워크 제어",
            "NTN 네트워크 관리 및 자원 할당"
          ],
          [
            "기술요소",
            "보안",
            "인증, 암호화"
          ],
          [
            "기술요소",
            "위치 추적",
            "위성·HAPS·드론 위치 파악·추적"
          ]
        ],
        "gloss": "NTN 통신 위한 전송·네트워크 제어·보안·위치 추적 기술"
      }
    ]
  },
  "Wi-Fi 7(IEEE 802.11be)": {
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "구분",
          "기술 요소",
          "설명"
        ],
        "rows": [
          [
            "MAC",
            "AP간 다중협력통신",
            "시간·주파수·공간 유연성 개선"
          ],
          [
            "MAC",
            "채널당 최대 320MHz 대역폭",
            "비연속 스펙트럼 효율적 이용"
          ],
          [
            "MAC",
            "16x16 MIMO",
            "16개 공간 스트림 용량 증대"
          ],
          [
            "MAC",
            "하이브리드 ARQ",
            "추가 패리티 통한 재전송 프로토콜"
          ],
          [
            "PHY",
            "혼합 빔포밍",
            "320MHz 광대역을 협대역으로 나눔\n프리코딩 수행"
          ],
          [
            "PHY",
            "4096 QAM",
            "12bit 반송파 변조\n기존 1024 QAM 대비 20% 향상"
          ]
        ],
        "gloss": "MAC 다중협력통신·320MHz 대역폭, PHY 4096 QAM 변조"
      },
      {
        "caption": "Wi-Fi 6와 Wi-Fi 7 비교",
        "headers": [
          "구분",
          "Wi-Fi 6",
          "Wi-Fi 7"
        ],
        "rows": [
          [
            "최대 속도",
            "9.6Gbps",
            "30Gbps"
          ],
          [
            "최대 대역폭",
            "160MHz",
            "320MHz"
          ],
          [
            "지원 주파수",
            "2.4 5GHz",
            "2.4 5GHz\n6GHz 추가"
          ],
          [
            "표준 기술명",
            "11ax HEW",
            "11be EHT"
          ],
          [
            "Modulation",
            "1024 QAM",
            "4096 QAM"
          ]
        ],
        "gloss": "Wi-Fi 6 대비 최대 속도·대역폭 증가, 6GHz 추가 운영"
      }
    ]
  },
  "Wi-Fi 8(IEEE 802.11bn)": {
    "tables": [
      {
        "caption": "성능 스펙",
        "headers": [
          "구분",
          "성능Spec",
          "설명"
        ],
        "rows": [
          [
            "최대 PHY 속도",
            "100Gbps",
            ""
          ],
          [
            "주파수 대역(GHz)",
            "2.4, 5, 6",
            ""
          ],
          [
            "최대 대역폭(MHz)",
            "320",
            ""
          ],
          [
            "변조",
            "4096 QAM",
            "직교 진폭 변조"
          ],
          [
            "MU-MIMO",
            "UL & DL",
            "다중 사용자 다중 입력 다중 출력"
          ],
          [
            "OFDMA",
            "다중",
            "직교 주파수 분할 다중 접속"
          ],
          [
            "멀티 AP 협력",
            "지원",
            ""
          ],
          [
            "DSO/NPCA",
            "지원",
            "동적 스펙트럼 최적화\n네트워크 성능 및 혼잡 방지"
          ]
        ],
        "gloss": "100Gbps 최대 PHY 속도, 멀티 AP 협력·DSO/NPCA 지원"
      },
      {
        "caption": "Wi-Fi 버전별 비교",
        "headers": [
          "구분",
          "Wi-Fi 7(802.11be)",
          "Wi-Fi 8 예정(802.11bn)"
        ],
        "rows": [
          [
            "최대 PHY 속도",
            "46Gbps",
            "100Gbps"
          ],
          [
            "대상 대기 시간",
            "제한적",
            "협조적"
          ],
          [
            "멀티 AP 협력",
            "–",
            "Yes"
          ],
          [
            "DSO/NPCA",
            "–",
            "Yes"
          ],
          [
            "dRU",
            "–",
            "Yes"
          ]
        ],
        "gloss": "Wi-Fi 8 예정, 멀티 AP 협력·DSO/NPCA·dRU 지원, 협조적 대기 시간"
      }
    ]
  },
  "Passive WiFi": {
    "diagram": [
      "/concept/answer/nw-passive-wifi.webp"
    ],
    "tables": [
      {
        "caption": "구성요소",
        "headers": [
          "구성요소",
          "주요 기술",
          "상세 내용"
        ],
        "rows": [
          [
            "Plugged-In Device",
            "RF Transfer",
            "RF 입출력 안테나 신호 처리"
          ],
          [
            "Plugged-In Device",
            "RF Calibration",
            "안테나 소자 특성 차이 보상\n채널 간 진폭·위상 차이 보정"
          ],
          [
            "Plugged-In Device",
            "MAC",
            "사용자 DB 유지\n주소 채널 설정"
          ],
          [
            "Passive Device",
            "후방산란",
            "방사 신호 반사\n초저전력 통신"
          ],
          [
            "Wifi Receiver",
            "",
            "스마트 기기로 와이파이 수신"
          ]
        ],
        "gloss": "Plugged-In Device RF 분리, Passive Device 후방산란 전달"
      }
    ]
  },
  "SDN(Software Defined Network)": {
    "diagram": [
      "/concept/answer/nw-sdn-1.webp",
      "/concept/answer/nw-sdn-2.webp"
    ],
    "tables": [
      {
        "caption": "SDN 구성 요소",
        "headers": [
          "구성 요소",
          "설명",
          "비고"
        ],
        "rows": [
          [
            "Application",
            "사용자 서비스 지원",
            "SDN Application Logic"
          ],
          [
            "Interface",
            "Data·Control Plane 간 연계",
            "OpenFlow"
          ],
          [
            "Control Plane",
            "제어 기능 중앙집중화",
            "SDN Control Logic\nACL, Routing, 인증"
          ],
          [
            "Data Plane",
            "패킷 포워딩·스위칭",
            "Forward Engine"
          ]
        ],
        "gloss": "Control Plane과 Data Plane 분리, OpenFlow로 연계"
      },
      {
        "caption": "기존 장비 vs SDN 장비",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "기존 네트워크 장비",
            "SW HW 통합 스위치 내 공존\n라우팅 QoS 포워딩 내장"
          ],
          [
            "SDN 네트워크 장비",
            "컨트롤러 분리, API 연결\n스위치 포워딩"
          ],
          [
            "전체 구조",
            "제어 데이터면 계층 분리 구조\nOpen API 개방형 연결"
          ]
        ],
        "gloss": "제어 기능 컨트롤러 분리, 스위치는 패킷 포워딩 수행"
      }
    ]
  },
  "IoT Matter": {
    "diagram": [
      "/concept/answer/nw-iot-matter.webp"
    ],
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "계층",
          "기술요소",
          "설명"
        ],
        "rows": [
          [
            "Application",
            "Matter Application",
            "스마트홈 디바이스 연동문제 해결"
          ],
          [
            "Transport",
            "TCP/IP",
            "연결지향 신뢰성 있는 전송계층"
          ],
          [
            "Transport",
            "UDP",
            "대량 데이터 전송 비연결지향"
          ],
          [
            "Network",
            "IPv6",
            "IoT 기기별 IP 주소 제공\n128bit 주소체계"
          ],
          [
            "Radio",
            "Wi-Fi",
            "밀집 환경 기기간 영향 최소화\n동영상 등 고속 통신 디바이스용"
          ],
          [
            "Radio",
            "Thread",
            "Mesh 지원 SPOF 방지\n배터리 저전력 디바이스용"
          ],
          [
            "Radio",
            "BLE",
            "디바이스 provisioning 용도"
          ]
        ],
        "gloss": "IPv6 기반 Wi-Fi·Thread 위 Matter 응용계층 통합 표준"
      }
    ]
  },
  "오픈플로우(OpenFlow)": {
    "diagram": [
      "/concept/answer/nw-openflow.webp"
    ],
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구분",
          "구성요소",
          "설명"
        ],
        "rows": [
          [
            "Controller",
            "OpenFlow Controller",
            "다수 논리 Switch 제어 소프트웨어"
          ],
          [
            "Protocol",
            "Controller-to-Switch",
            "Switch 제어"
          ],
          [
            "Protocol",
            "Asynchronous",
            "상태 변경 Update"
          ],
          [
            "Protocol",
            "Symmetric",
            "요청 없이 전송"
          ],
          [
            "Switch",
            "OpenFlow Channel",
            "컨트롤러 연결 제어 통로 제공"
          ],
          [
            "Switch",
            "Flow Table",
            "다수 Flow entry, 파이프라인 처리"
          ],
          [
            "Switch",
            "Group Table",
            "액션 버킷 실행 집합 정의"
          ]
        ],
        "gloss": "Controller와 Switch가 OpenFlow Protocol로 통신"
      }
    ]
  },
  "SD-WAN(Software Defined-Wide Area Network)": {
    "diagram": [
      "/concept/answer/nw-sdwan.webp"
    ],
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "구분",
          "기술요소",
          "설명"
        ],
        "rows": [
          [
            "장비 측면",
            "SD-WAN Controller",
            "네트워크 토폴로지 관리\nQoS·액세스 정책 설정·배포"
          ],
          [
            "장비 측면",
            "SD-WAN CPE",
            "오버레이 망 라우팅·터널링 엔진\n방화벽·보안·암호화"
          ],
          [
            "경로 제어",
            "Dynamic Path Switching",
            "동적 경로 전환, 저하 경로 회피"
          ],
          [
            "경로 제어",
            "Packet Duplication",
            "패킷 중복 전송, 유실 대비"
          ],
          [
            "경로 제어",
            "트래픽 스티어링",
            "트래픽 식별 앱별 경로 설정"
          ],
          [
            "회선 결합",
            "Link Aggregation",
            "다중 회선 결합 대역폭 확장"
          ],
          [
            "망 분리",
            "Network Segmentation",
            "VLAN 분리 논리적 망 분리"
          ]
        ],
        "gloss": "SD-WAN Controller 정책 설정, CPE 오버레이 망 트래픽 제어"
      }
    ]
  },
  "SDR(Software Defined Radio)": {
    "diagram": [
      "/concept/answer/nw-sdr.webp"
    ],
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "구분",
          "핵심 기술",
          "설명"
        ],
        "rows": [
          [
            "소자 기술",
            "A/D, D/A 변환기",
            "고속 샘플링 고해상도 변환"
          ],
          [
            "소자 기술",
            "광대역 RF",
            "광대역 송수신 무선 주파수 처리"
          ],
          [
            "소자 기술",
            "Digital IF",
            "RF·기저대역 중간 주파수 전환"
          ],
          [
            "소자 기술",
            "FPGA, DSP",
            "프로그래밍 가능 논리 소자\n디지털 신호 처리"
          ],
          [
            "소자 기술",
            "SDR 프로세서",
            "SDR 전용 프로세서 제작 기술"
          ],
          [
            "소프트웨어 기술",
            "SCA",
            "SDR SW 구조"
          ],
          [
            "소프트웨어 기술",
            "미들웨어",
            "컴포넌트 기반 재구성성 충족"
          ],
          [
            "소프트웨어 기술",
            "RTOS",
            "실시간 OS 신호 처리 지원"
          ]
        ],
        "gloss": "소자·소프트웨어 기술로 무선 특성 소프트웨어 변경"
      },
      {
        "caption": "기술 요소 — 통신 기술 / 시스템 기술",
        "headers": [
          "구분",
          "핵심 기술",
          "설명"
        ],
        "rows": [
          [
            "통신 기술",
            "네트워크 기술",
            "네트워크 간 Handover\n네트워크 탐지"
          ],
          [
            "통신 기술",
            "다운로드 기술",
            "OTA 다운로드 프로토콜"
          ],
          [
            "통신 기술",
            "보안 및 인증",
            "프로토콜 불법 사용 방지\n도청 및 간섭 방지"
          ],
          [
            "시스템 기술",
            "HW Platform",
            "SDR 테스트 베드, 스마트 안테나"
          ],
          [
            "시스템 기술",
            "Smart Antenna",
            "스마트 안테나 API 표준 기술"
          ]
        ],
        "gloss": "SW 다운로드·보안 통신 기술과 HW Platform 시스템 기술"
      }
    ]
  },
  "CDN(Contents Delivery Network)": {
    "diagram": [
      "/concept/answer/nw-cdn.webp"
    ],
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구성",
          "설명"
        ],
        "rows": [
          [
            "CDN SP",
            "CDN 사업 총괄 수행 사업자"
          ],
          [
            "CP",
            "콘텐츠 제공 사업자"
          ],
          [
            "ISP",
            "CDN 서비스 대상 사용자 보유 업체"
          ],
          [
            "User",
            "서비스 사용자"
          ],
          [
            "POP",
            "모든 CDN 제공자 PoP 통해 서비스"
          ],
          [
            "IX",
            "ISP간 연동 제공 접속포인트"
          ]
        ],
        "gloss": "CP 콘텐츠를 ISP 노드 POP 서버 Cache에 복제 저장하여 제공"
      },
      {
        "caption": "기술 요소",
        "headers": [
          "기술요소",
          "설명"
        ],
        "rows": [
          [
            "Caching 기술",
            "자주 찾는 페이지 복사·저장"
          ],
          [
            "Load Balancing",
            "서버별 트래픽 분산 성능 향상"
          ],
          [
            "Request Routing",
            "가장 인접한 Cache Server 선택"
          ],
          [
            "콘텐츠 배포",
            "분산 CDN서버 동일 콘텐츠 배포"
          ],
          [
            "동기화 기술",
            "콘텐츠 변경 즉시 분산 서버 반영"
          ]
        ],
        "gloss": "Caching·Load Balancing·동기화로 콘텐츠 효율적 전달"
      }
    ]
  },
  "망 중립성(Network Neutrality)": {
    "diagram": [
      "/concept/answer/nw-net-neutrality.webp"
    ],
    "tables": [
      {
        "caption": "기본 원칙",
        "headers": [
          "기본 원칙",
          "설명"
        ],
        "rows": [
          [
            "트래픽 관리 투명성",
            "트래픽 관리 방침 공개\n관리 조치 사실·영향 이용자 고지"
          ],
          [
            "차단금지",
            "합법 콘텐츠 통신사 차단 금지"
          ],
          [
            "불합리한 차별 금지",
            "유형·제공주체 불합리 차별 금지"
          ],
          [
            "합리적 트래픽 관리",
            "보안·혼잡·법령 예외 트래픽 관리"
          ]
        ],
        "gloss": "망 중립성 가이드라인 투명성·차단금지·차별금지 원칙"
      },
      {
        "caption": "3대 원칙",
        "headers": [
          "원칙",
          "핵심",
          "분류"
        ],
        "rows": [
          [
            "비차별성 확립",
            "트래픽 이용 차별",
            "트래픽 차별 금지\n이용자 권리 보호"
          ],
          [
            "상호접속 허용",
            "일방적 차단 금지",
            "서비스 이용 보장\n컨텐츠 차단 금지"
          ],
          [
            "접근성 제공",
            "자유로운 이용",
            "정책 투명성 보장\n디바이스 접근"
          ]
        ],
        "gloss": "비차별성 확립·상호접속 허용·접근성 제공 원칙"
      }
    ]
  },
  "인텐트 기반 네트워킹(Intent-Based Networking)": {
    "diagram": [
      "/concept/answer/nw-ibn.webp"
    ],
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "구분",
          "기술 요소",
          "설명"
        ],
        "rows": [
          [
            "의도 명령",
            "NMS, User",
            "서비스 목적 위한 선언적 명령"
          ],
          [
            "의도 번역",
            "Translation·Optimization",
            "High-level Policy\n음성·텍스트 형태 의도 번역"
          ],
          [
            "의도 번역",
            "LLM",
            "컴퓨터 스크립트 형태 자동 번역"
          ],
          [
            "의도 적용",
            "Activation·Configuration",
            "Low-level Policy\n인프라 요청 네트워크 서비스 수행"
          ],
          [
            "의도 적용",
            "Virtual Machine·Container",
            "가상화 시스템 활성화"
          ],
          [
            "의도 모니터링",
            "Monitoring·Assurance",
            "네트워크 모니터링 데이터 수집\n데이터 분석 및 정합성 검증"
          ],
          [
            "의도 검정 및 재설정",
            "Validation",
            "서비스 의도대로 동작 여부 검정"
          ],
          [
            "의도 검정 및 재설정",
            "feedback",
            "정책 보완 및 새로운 정책 생성"
          ]
        ],
        "gloss": "의도 명령·번역·적용·모니터링·검정 Closed-Loop 수행"
      },
      {
        "caption": "IBN을 위한 요건",
        "headers": [
          "요건",
          "설명"
        ],
        "rows": [
          [
            "변환과 검증",
            "의도를 정책으로 변환, 실행 검증"
          ],
          [
            "자동 수행",
            "개입 최소화 자동 작업 수행"
          ],
          [
            "상황 인식",
            "모니터링, 데이터 수집\n네트워크 특정 상태 유지"
          ],
          [
            "동적인 최적화",
            "의도대로 유지 방법 판단\n조정 작업 자동 실행"
          ]
        ],
        "gloss": "의도 정책화와 자동 수행·상황 인식·동적인 최적화"
      }
    ]
  },
  "무선 충전 기술": {
    "diagram": [
      "/concept/answer/nw-wireless-charging.webp"
    ],
    "tables": [
      {
        "caption": "무선 충전 기술 방식",
        "headers": [
          "구분",
          "방식",
          "설명"
        ],
        "rows": [
          [
            "근거리",
            "자기유도",
            "수신코일 통과 유도전류 충전\n전기차·모바일"
          ],
          [
            "중거리",
            "자기공명",
            "동일 공진주파수 코일 간 공진 발생\n가전·노트북"
          ],
          [
            "원거리",
            "전자기파",
            "마이크로파 변환 전력 직접 전송\n위성·우주 발전"
          ],
          [
            "전파",
            "RF",
            "비콘 위치 인지 지향 집중 충전"
          ],
          [
            "빛",
            "적외선",
            "적외선 빔 인체 무해 방식"
          ],
          [
            "음파",
            "초음파",
            "초음파 변환 에너지·데이터 전송"
          ]
        ],
        "gloss": "전기 에너지를 자기장·전자기파 형태로 변형하여 무선 전송"
      },
      {
        "caption": "무선 충전 기술 방식 비교",
        "headers": [
          "구분",
          "자기유도방식",
          "자기공명방식",
          "전자기파 방식"
        ],
        "rows": [
          [
            "전송거리",
            "근접형(수Cm)",
            "중거리(수m)",
            "장거리(수Km)"
          ],
          [
            "효율",
            "75% 이상",
            "40~60%",
            "5% 이내"
          ],
          [
            "인체유해성",
            "무해",
            "무해",
            "유해"
          ],
          [
            "주요사용분야",
            "교통카드, 모바일",
            "가전기기",
            "우주비행체, 위성"
          ],
          [
            "장점",
            "고효율",
            "이동성",
            "고출력"
          ]
        ],
        "gloss": "자기유도 고효율, 자기공명 이동성, 전자기파 고출력"
      }
    ]
  },
  "Sliding Window & 네이글(Nagle's) 알고리즘": {
    "diagram": [
      "/concept/answer/nw-sliding-window-1.webp",
      "/concept/answer/nw-sliding-window-2.webp"
    ],
    "tables": [
      {
        "caption": "동작 매커니즘",
        "headers": [
          "구분",
          "동작 방식",
          "설명"
        ],
        "rows": [
          [
            "Sliding Window",
            "Window 열림",
            "오른쪽 경계가 오른쪽으로 이동\n데이터 전송량 증가"
          ],
          [
            "Sliding Window",
            "Window 닫힘",
            "왼쪽 경계가 오른쪽으로 이동\n전송의 정상 완료"
          ],
          [
            "Sliding Window",
            "Window 축소",
            "오른쪽 경계가 왼쪽으로 이동\n윈도우 크기 변경"
          ],
          [
            "네이글 알고리즘",
            "수신 Window Size만큼 전송",
            "Window Size < MSS 시 바로 전송"
          ],
          [
            "네이글 알고리즘",
            "송신 데이터 종료 시 즉시 전송",
            "패킷 없으면 현재 buffer data 전송"
          ],
          [
            "네이글 알고리즘",
            "데이터 축적 후 전송",
            "Ack 올 때까지 buffer에 축적\nack 수신 시 buffer data 송신"
          ]
        ],
        "gloss": "윈도우 경계 이동 흐름제어와 작은 패킷 모아서 전송"
      }
    ]
  },
  "BGP(Border Gateway Protocol)": {
    "diagram": [
      "/concept/answer/nw-bgp.webp"
    ],
    "tables": [
      {
        "caption": "기술 요소",
        "headers": [
          "구분",
          "기술 요소",
          "설명"
        ],
        "rows": [
          [
            "경로 속성",
            "Next-Hop",
            "BGP 정보 전송 라우터 IP 주소"
          ],
          [
            "경로 속성",
            "Local Preference",
            "외부로 나가는 경로 우선 순위 값\n기본값 100"
          ],
          [
            "경로 속성",
            "AS-Path",
            "목적지 도착 시 경유 AS 번호\n개수 작을수록 짧은 경로로 선택"
          ],
          [
            "경로 속성",
            "MED",
            "인입 경로 다중일 경우 우선 순위 값"
          ],
          [
            "프로토콜 메시지",
            "Open",
            "TCP 179번 포트 회선 연결 시도\nBGP Neighbor 설정"
          ],
          [
            "프로토콜 메시지",
            "Update",
            "BGP 정보 교환·갱신\n도달 가능성 정보 전송"
          ],
          [
            "프로토콜 메시지",
            "Notification",
            "문제 발생·이웃관계 단절 알림"
          ],
          [
            "프로토콜 메시지",
            "Keepalive",
            "BGP Neighbor Health Check 메시지"
          ]
        ],
        "gloss": "경로 속성으로 경로 선택, Open·Update 메시지로 정보 교환"
      }
    ]
  },
  "IPv6": {
    "diagram": [
      "/concept/answer/nw-ipv6.webp"
    ],
    "tables": [
      {
        "caption": "헤더 상세 설명 — 기본 헤더",
        "headers": [
          "필드",
          "크기",
          "설명"
        ],
        "rows": [
          [
            "버전",
            "4bit",
            "IP 버전 표시"
          ],
          [
            "트래픽 클래스",
            "8bit",
            "우선순위 요청"
          ],
          [
            "플로우 레이블",
            "20bit",
            "QoS 구분 표시"
          ],
          [
            "페이로드 길이",
            "16bit",
            "데이터 길이 표시"
          ],
          [
            "다음 헤더",
            "8bit",
            "다음 헤더 유형"
          ],
          [
            "홉 제한",
            "8bit",
            "포워딩 제한 표시"
          ],
          [
            "송신지 주소",
            "128bit",
            "송신지 주소 표시"
          ],
          [
            "수신지 주소",
            "128bit",
            "수신지 주소 표시"
          ]
        ],
        "gloss": "기본헤더 40B 고정 길이, 128bit 송신지·수신지 주소"
      },
      {
        "caption": "표기법",
        "headers": [
          "기법",
          "설명"
        ],
        "rows": [
          [
            "기본 원칙",
            "8개 필드 16진수 4자리\n콜론 구분"
          ],
          [
            "0 억제 표기법",
            "0000 → 0"
          ],
          [
            "0 압축 표기법",
            "0000:0000 → ::"
          ],
          [
            "혼합 표기법",
            "앞 96bit 콜론 16진 표기\n뒤 32bit 10진수 표기법"
          ]
        ],
        "gloss": "8개 필드 16진수 표기, 0 억제·0 압축·혼합 표기법"
      }
    ]
  },
  "선형 자료구조와 비선형 자료구조": {
    "diagram": [
      "/concept/answer/ds-linear-nonlinear-1.webp",
      "/concept/answer/ds-linear-nonlinear-2.webp"
    ],
    "tables": [
      {
        "caption": "선형·비선형 자료구조",
        "headers": [
          "구분",
          "구조",
          "설명"
        ],
        "rows": [
          [
            "순차 저장",
            "Array",
            "같은 데이터형 동일 크기 순차 나열"
          ],
          [
            "연결 저장",
            "Linked List",
            "노드가 데이터와 포인터 가짐"
          ],
          [
            "제한 접근",
            "Stack (LIFO)",
            "한쪽 끝에서만 삽입·삭제\nLIFO 후입선출 구조"
          ],
          [
            "제한 접근",
            "Queue (FIFO)",
            "한쪽 삽입, 다른 한쪽 삭제\nFIFO 선입선출 구조"
          ],
          [
            "계층",
            "Tree",
            "나무 가지처럼 연결된 계층적 구조\n순환이 없는 연결 그래프"
          ],
          [
            "망",
            "Graph",
            "정점 집합 V, 간선 집합 E\nG = (V, E)"
          ]
        ],
        "gloss": "데이터 사이의 대응 구조에 따라 선형, 비선형 자료구조로 분류"
      },
      {
        "caption": "선형·비선형 비교",
        "headers": [
          "구분",
          "선형 자료구조",
          "비선형 자료구조"
        ],
        "rows": [
          [
            "대응 구조",
            "1:1 대응 구조",
            "1:N 또는 M:N 구조"
          ],
          [
            "설명",
            "구조가 간단\naccess 속도가 빠름",
            "자료 간의 관계를 표현"
          ],
          [
            "구조",
            "Array, Linked List\nStack, Queue",
            "Tree, Graph"
          ]
        ],
        "gloss": "선형은 1:1 대응 구조, 비선형은 1:N 또는 M:N 구조로 관계"
      }
    ]
  },
  "링크드 리스트(Linked List)": {
    "diagram": [
      "/concept/answer/ds-linked-list.webp"
    ],
    "tables": [
      {
        "caption": "유형",
        "headers": [
          "구분",
          "유형",
          "설명"
        ],
        "rows": [
          [
            "단방향",
            "Singly Linked List",
            "데이터와 다음 노드 포인터 구성\n마지막 노드 포인터는 Null"
          ],
          [
            "양방향",
            "Double Linked List",
            "이전/다음 노드 포인터, Data 소유\n전/후방 어느 쪽으로도 순환 가능"
          ],
          [
            "단방향",
            "Singly Circular Linked List",
            "마지막 Node가 처음 노드 가리킴"
          ],
          [
            "양방향",
            "Double Circular Linked List",
            "처음과 마지막 노드가 서로 가리킴"
          ]
        ],
        "gloss": "노드가 데이터와 포인터를 가지고 한 줄로 연결되는 유형"
      },
      {
        "caption": "구성요소",
        "headers": [
          "구성요소",
          "개념",
          "설명"
        ],
        "rows": [
          [
            "Head",
            "시작점",
            "처음 접근 주소\n시작을 알리는 노드"
          ],
          [
            "Tail",
            "종료점",
            "끝을 알리는 노드"
          ],
          [
            "Node",
            "실제 데이터",
            "자료 저장소와 다음 노드 포인터"
          ]
        ],
        "gloss": "Head 시작점, Tail 종료점, Node 실제 데이터 저장"
      }
    ]
  },
  "Stack": {
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "TOP",
            "삽입·삭제 일어나는 리스트 끝\n스택 포인터"
          ],
          [
            "Bottom",
            "TOP의 반대쪽 리스트의 끝\nBottom 삽입, 삭제 일어나지 않음"
          ],
          [
            "PUSH",
            "스택에서 값을 삽입하는 것\noverflow: 스택 포인터 > 스택 크기"
          ],
          [
            "POP",
            "스택에서 값을 삭제하는 것\nUnderflow: Top pointer 주소 = 0"
          ]
        ],
        "gloss": "리스트의 한쪽 끝 TOP에서 삽입, 삭제 이루어지는 LIFO 구조"
      },
      {
        "caption": "연산",
        "headers": [
          "구분",
          "항목",
          "설명"
        ],
        "rows": [
          [
            "연산",
            "push(item)",
            "최상단에 추가"
          ],
          [
            "연산",
            "pop()",
            "최상단 제거 반환"
          ],
          [
            "발생 예외",
            "Overflow",
            "기억장소 꽉 참"
          ],
          [
            "발생 예외",
            "Underflow",
            "SP 주소 0"
          ]
        ],
        "gloss": "스택 연산과 발생 예외 Overflow, Underflow"
      }
    ]
  },
  "Queue": {
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "Front",
            "줄의 맨 앞을 전단"
          ],
          [
            "Rear",
            "맨 뒤를 후단"
          ],
          [
            "Enqueue",
            "후단에 데이터를 삽입하는 작업"
          ],
          [
            "Dequeue",
            "전단의 데이터를 삭제하는 작업"
          ],
          [
            "isFull",
            "큐가 가득 차 있는지 판단"
          ],
          [
            "isEmpty",
            "큐가 공백 큐인지 확인"
          ]
        ],
        "gloss": "후단 Rear에서 삽입, 전단 Front에서 삭제하는 FIFO 구조"
      },
      {
        "caption": "유형 [선순링덱]",
        "headers": [
          "구분",
          "유형",
          "설명"
        ],
        "rows": [
          [
            "배열 기반",
            "선형 큐",
            "배열 선형 사용 큐 구현"
          ],
          [
            "배열 기반",
            "순환 큐",
            "논리적 원형 배열 순환 사용\n끝↔시작 연결 전단·후단 관리"
          ],
          [
            "연결 기반",
            "LinkedList 큐",
            "연결 리스트 구현 큐"
          ],
          [
            "양단 접근",
            "덱",
            "양끝 삽입·삭제 모두 가능"
          ]
        ],
        "gloss": "배열 기반·연결 기반·양단 접근 큐 유형 [선순링덱]"
      }
    ]
  },
  "이진 탐색 트리(Binary Search Tree)": {
    "tables": [
      {
        "caption": "성질",
        "headers": [
          "번호",
          "설명"
        ],
        "rows": [
          [
            "1)",
            "좌측 서브 트리 노드보다 작은 값"
          ],
          [
            "2)",
            "우측 서브 트리 노드보다 큰 값"
          ],
          [
            "3)",
            "중복 노드 없음 유일한 키 값"
          ],
          [
            "4)",
            "재귀적 성질 좌우도 이진 탐색"
          ]
        ],
        "gloss": "좌측 서브 트리는 작은 값, 우측 서브 트리는 큰 값"
      },
      {
        "caption": "데이터 탐색 매커니즘",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "1",
            "노드 존재 해당 노드 리턴\n노드 미존재 NULL 리턴"
          ],
          [
            "2",
            "루트 노드 비교 일치 시 루트 리턴"
          ],
          [
            "3",
            "검색 값<루트 좌측 재귀 검색"
          ],
          [
            "4",
            "검색 값≥루트 우측 재귀 검색"
          ]
        ],
        "gloss": "루트 노드와 비교 후 좌측·우측 재귀 검색"
      }
    ]
  },
  "AVL 트리": {
    "diagram": [
      "/concept/answer/ds-avl.webp"
    ],
    "tables": [
      {
        "caption": "트리 회전",
        "headers": [
          "회전 타입",
          "설명"
        ],
        "rows": [
          [
            "LL",
            "왼쪽-왼쪽으로 치우친 경우\n오른쪽으로 한 번 회전하여 균형"
          ],
          [
            "RR",
            "오른쪽-오른쪽으로 치우친 경우\n왼쪽으로 한 번 회전하여 균형"
          ],
          [
            "LR",
            "왼쪽-오른쪽으로 치우친 경우\nLL 회전 후 RR 회전"
          ],
          [
            "RL",
            "오른쪽-왼쪽으로 치우친 경우\nRR 회전 후 LL 회전"
          ]
        ],
        "gloss": "LL, RR, LR, RL 회전으로 Balance factor 절대값 1 이하"
      },
      {
        "caption": "추가 순서 예",
        "headers": [
          "단계",
          "동작"
        ],
        "rows": [
          [
            "(1)~(3)",
            "9, 4, 3 삽입\nBF +2 발생"
          ],
          [
            "(4)",
            "LL 회전\n4가 루트"
          ],
          [
            "(5)~(6)",
            "12, 14 삽입\n9의 BF −2 발생"
          ],
          [
            "(7)",
            "RR 회전\n12가 서브트리 루트"
          ],
          [
            "(8)~(9)",
            "10 삽입 BF −2\nRL 회전 9가 루트"
          ]
        ],
        "gloss": "9 → 4 → 3 → 12 → 14 → 10 추가 순서 회전"
      }
    ]
  },
  "힙(Heap)": {
    "diagram": [
      "/concept/answer/ds-heap-1.webp",
      "/concept/answer/ds-heap-2.webp"
    ],
    "tables": [
      {
        "caption": "Min-Heap 삽입 연산",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "1",
            "2, 6, 4, 9, 7 순서대로 삽입"
          ],
          [
            "2",
            "새로운 노드 1 추가\n완전 이진 트리 유지, 4 왼쪽 삽입"
          ],
          [
            "3",
            "1<4 비교 1과 4 치환"
          ],
          [
            "4",
            "1<2 비교 1과 2 치환"
          ],
          [
            "5",
            "삽입 완료 1이 루트 위치"
          ]
        ],
        "gloss": "새로운 노드 추가 후 비교 치환, 1이 루트 위치"
      },
      {
        "caption": "최대 힙과 최소 힙",
        "headers": [
          "구분",
          "개념",
          "노드"
        ],
        "rows": [
          [
            "최대 힙",
            "완전 이진 트리\n우선순위 큐 적합",
            "자손보다 큰 값"
          ],
          [
            "최소 힙",
            "완전 이진 트리",
            "자손보다 작은 값"
          ]
        ],
        "gloss": "최대 힙 자손보다 큰 값, 최소 힙 자손보다 작은 값"
      }
    ]
  },
  "B-Tree(Balanced Tree)": {
    "tables": [
      {
        "caption": "구조와 특징",
        "headers": [
          "구분",
          "항목",
          "설명"
        ],
        "rows": [
          [
            "구조",
            "Root node",
            "최소 2개 자식\n최소 1개 값"
          ],
          [
            "구조",
            "Internal node",
            "최대 m개 자식\n차수 m 기준"
          ],
          [
            "구조",
            "Leaf node",
            "최하위 노드\n동일 레벨"
          ],
          [
            "특징",
            "자식노드 수",
            "리프·루트 제외 최소 m/2개"
          ],
          [
            "특징",
            "균등 탐색 속도",
            "시간 복잡도 O(logN) 일정"
          ],
          [
            "특징",
            "효율성",
            "트리 높이 감소"
          ],
          [
            "유형",
            "B+ Tree",
            "인덱스 세트·순차세트 구성"
          ],
          [
            "유형",
            "B* Tree",
            "리프·루트 제외 노드 2/3 이상 채움"
          ]
        ],
        "gloss": "자식 노드 최대 숫자가 2보다 큰 이진 트리의 확장형"
      },
      {
        "caption": "삽입/삭제 연산",
        "headers": [
          "연산",
          "설명"
        ],
        "rows": [
          [
            "삽입",
            "리프 삽입 정렬 키 오름차순 채움\n가득 시 분할 중간 키 부모 승격"
          ],
          [
            "삭제",
            "삽입과 동일 리프에서 시작\n후행 키 교환 리프 이동 후 삭제"
          ]
        ],
        "gloss": "가득 시 분할, 중간 키 부모 승격으로 균형 유지"
      }
    ]
  },
  "방향성 비순환 그래프(DAG, Directed Acyclic Graph)": {
    "tables": [
      {
        "caption": "위상 정렬",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "절차",
            "진입차수 0 정점 큐 삽입\n간선 제거 반복 정점 소진 시 완료"
          ],
          [
            "설명",
            "유향 그래프 정렬 변 방향 순서 나열\nDFS·큐 활용 대표적 정렬 방법"
          ],
          [
            "진입 차수",
            "정점 유입 간선 수"
          ],
          [
            "진출 차수",
            "정점 유출 간선 수"
          ]
        ],
        "gloss": "진입차수 0 정점 큐 삽입, 간선 제거 반복하는 위상 정렬"
      },
      {
        "caption": "위상정렬 실시 과정 및 결과",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "진입차수 표 작성",
            "정점별 진입차수 기입"
          ],
          [
            "큐 삽입·간선 제거",
            "진입차수 0 정점 큐 삽입\n연결 간선 제거 진입차수 재계산"
          ],
          [
            "정점 제거 확인",
            "제거 완료 확인 모든 정점 소진"
          ],
          [
            "결과 값",
            "4 → 1 → 6 → 2 → 3 → 5"
          ]
        ],
        "gloss": "위상정렬 결과 값 4 → 1 → 6 → 2 → 3 → 5"
      }
    ]
  },
  "알고리즘 성능평가": {
    "tables": [
      {
        "caption": "성능 평가 유형",
        "headers": [
          "구분",
          "유형",
          "설명"
        ],
        "rows": [
          [
            "성능분석",
            "알고리즘 복잡도 분석",
            "직접 구현 않고 수행 시간 분석\n연산 횟수 측정 비교"
          ],
          [
            "성능측정",
            "수행시간 측정",
            "실제 수행시간 측정\n실제 구현물 필요"
          ],
          [
            "효율성 평가",
            "시간 복잡도",
            "단위 연산 횟수로 수행시간 평가\n3가지 점근적 표현법"
          ],
          [
            "효율성 평가",
            "공간 복잡도",
            "수행에 필요한 메모리 양 평가\n고정 공간 + 가변 공간의 합"
          ]
        ],
        "gloss": "알고리즘 성능을 시간 및 공간 지표를 기준으로 판단"
      },
      {
        "caption": "점근적 성능 표기법",
        "headers": [
          "표기법",
          "설명"
        ],
        "rows": [
          [
            "O Notation",
            "점근적 상한선\n입력 최악일 때 기준 효율성 평가"
          ],
          [
            "Ω Notation",
            "점근적 하한선\n입력 최상일 때 기준 효율성 평가"
          ],
          [
            "Θ Notation",
            "상·하한 교집합\n하한인 동시에 상한 표시"
          ]
        ],
        "gloss": "점근적 상한선·하한선·교집합 표기법"
      }
    ]
  },
  "빅오 표기법(O-Notation)": {
    "tables": [
      {
        "caption": "유형",
        "headers": [
          "유형",
          "설명",
          "사례"
        ],
        "rows": [
          [
            "O(1)",
            "상수형\n입력 크기 무관",
            "해시 함수"
          ],
          [
            "O(log N)",
            "로그형\n나눠 하나만 처리",
            "이진탐색"
          ],
          [
            "O(N)",
            "선형\n하나씩 모두 처리",
            "단순탐색"
          ],
          [
            "O(N log N)",
            "분할·합병형\n분할 후 합병",
            "퀵 정렬"
          ],
          [
            "O(N²)",
            "제곱형\n2중 loop",
            "버블 정렬"
          ],
          [
            "O(N³)",
            "세제곱형\n3중 loop",
            "Finding the Shortest Path"
          ],
          [
            "O(2ⁿ)",
            "지수형\n모든 해법 검사",
            "Dynamic Programming"
          ]
        ],
        "gloss": "시간 복잡도 상한 점근 표기법 유형과 사례"
      }
    ]
  },
  "퀵 정렬(Quick Sort)": {
    "diagram": [
      "/concept/answer/al-quick-sort.webp"
    ],
    "tables": [
      {
        "caption": "수행 절차",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "1",
            "Low는 왼쪽부터 Pivot보다 큰 값"
          ],
          [
            "2",
            "High는 우측서 Pivot보다 작은 값"
          ],
          [
            "3",
            "큰 값과 작은 값의 위치 교환"
          ],
          [
            "4",
            "다시 좌측 큰 값, 우측 작은 값 탐색"
          ],
          [
            "5",
            "교차 시 Pivot과 high 값 교환"
          ],
          [
            "6",
            "Pivot 기준 좌측 작은 값, 우측 큰 값"
          ],
          [
            "7",
            "좌·우 Pivot 다시 잡고 재귀실행"
          ]
        ],
        "gloss": "Low·High 탐색 후 위치 교환, Pivot 기준 재귀실행"
      },
      {
        "caption": "동작 원리",
        "headers": [
          "원리",
          "설명"
        ],
        "rows": [
          [
            "1) 비교 정렬",
            "원소 간 비교만으로 정렬"
          ],
          [
            "2) 분할과 정복",
            "Pivot 기준 리스트 분할 정렬"
          ],
          [
            "3) 재귀적 수행",
            "부분 리스트 재귀 분할·정렬 반복"
          ],
          [
            "시간복잡도",
            "평균 O(n logn), 최악 O(n²)"
          ]
        ],
        "gloss": "분할과 정복에 기반한 비교 정렬, 재귀적 수행"
      }
    ]
  },
  "삽입 정렬(Insertion Sort)": {
    "tables": [
      {
        "caption": "삽입 정렬 과정",
        "headers": [
          "순번",
          "과정 설명"
        ],
        "rows": [
          [
            "1",
            "처음 A[0]는 정렬된 데이터로 취급"
          ],
          [
            "2",
            "A[1]을 정렬된 데이터와 비교 삽입"
          ],
          [
            "3",
            "A[2]를 A[0], A[1]과 비교 삽입"
          ],
          [
            "4",
            "같은 방식 나머지 삽입 정렬 완성"
          ]
        ],
        "gloss": "앞에서부터 정렬된 데이터와 비교 삽입"
      },
      {
        "caption": "수행 개념도",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "Step 1",
            "정렬 영역·비정렬 영역 구분\n자신이 들어갈 위치 검색"
          ],
          [
            "Step 2",
            "해당 위치 이후 값을 Shift"
          ],
          [
            "Step 3",
            "해당 위치로 삽입"
          ]
        ],
        "gloss": "자신이 들어갈 위치 검색 후 Shift, 삽입"
      }
    ]
  },
  "버블 정렬(Bubble Sort)": {
    "tables": [
      {
        "caption": "버블 정렬 과정",
        "headers": [
          "순번",
          "과정 설명"
        ],
        "rows": [
          [
            "1",
            "인접 원소 순서로 비교\n앞쪽 값이 뒤쪽보다 크면 교환"
          ],
          [
            "2",
            "1회 후 A(4)는 가장 큰 값\n2회는 A(1)~A(3)만 비교 반복"
          ],
          [
            "3",
            "2회 후 A(3)·A(4) 정렬 완료\nA(1)과 A(2)만 비교"
          ]
        ],
        "gloss": "이웃 요소들끼리 비교 후 교환을 통해 정렬"
      },
      {
        "caption": "예시 (7, 5, 3, 2)",
        "headers": [
          "회차",
          "과정",
          "결과"
        ],
        "rows": [
          [
            "1회",
            "7 5 3 2 → 5 7 3 2\n→ 5 3 7 2 → 5 3 2 7",
            "5 3 2 [7]"
          ],
          [
            "2회",
            "5 3 2 7 → 3 5 2 7\n→ 3 2 5 7",
            "3 2 [5 7]"
          ],
          [
            "3회",
            "3 2 5 7 → 2 3 5 7",
            "[2 3 5 7]"
          ]
        ],
        "gloss": "1회 후 가장 큰 값 맨 뒤 확정"
      }
    ]
  },
  "병합 정렬(Merge Sort)": {
    "diagram": [
      "/concept/answer/al-merge-sort.webp"
    ],
    "tables": [
      {
        "caption": "수행 절차",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "①",
            "정렬할 데이터를 반으로 나눔"
          ],
          [
            "②",
            "하위 집합 크기 2 이상이면 ① 반복"
          ],
          [
            "③",
            "하위 데이터 집합 둘을 하나로 병합\n병합 시 원소 순서 맞춰 정렬"
          ],
          [
            "④",
            "집합이 하나 될 때까지 ③ 반복"
          ]
        ],
        "gloss": "두 개로 분할 반복 후 병합 반복하는 수행 절차"
      }
    ]
  },
  "해시 테이블": {
    "tables": [
      {
        "caption": "구성 요소",
        "headers": [
          "구분",
          "구성 요소",
          "설명"
        ],
        "rows": [
          [
            "함수",
            "해시 함수",
            "키 값 레코드 주소로 사상\n단방향 함수 고정길이 변환"
          ],
          [
            "입력",
            "해시 키",
            "해시함수 입력 레코드 키 값"
          ],
          [
            "저장 공간",
            "해시 테이블",
            "키 연산 직접 접근 배열 구조"
          ],
          [
            "저장 공간",
            "버킷",
            "하나의 주소 파일 한 구역\n버킷 크기 = 주소당 레코드 수"
          ],
          [
            "저장 공간",
            "슬롯",
            "레코드 1개 공간, n개 슬롯=버킷"
          ],
          [
            "충돌",
            "동거자",
            "같은 주소로 변환된 레코드"
          ],
          [
            "충돌",
            "충돌",
            "다른 레코드 같은 주소 반환"
          ],
          [
            "충돌",
            "오버 플로우",
            "버킷 가득 참, 빈자리 없는 과잉"
          ]
        ],
        "gloss": "해시함수로 레코드 주소 계산하는 저장 공간과 충돌 요소"
      }
    ]
  },
  "해싱과 충돌해결방법": {
    "tables": [
      {
        "caption": "해싱 기법",
        "headers": [
          "구분",
          "기법",
          "설명"
        ],
        "rows": [
          [
            "산술 연산",
            "나눗셈법",
            "나머지 연산자 % 테이블 주소 계산\n양의 정수로 나눔 나머지=홈 주소"
          ],
          [
            "산술 연산",
            "폴딩법",
            "키 동일 길이 여러 부분 분할\n덧셈·XOR 결과=홈 주소"
          ],
          [
            "산술 연산",
            "중간 제곱법",
            "레코드 키 제곱\n중간 몇 비트=홈 주소"
          ],
          [
            "진법 변환",
            "기수 변환법",
            "키 타 진법으로 간주 변환\n10진→7진 변환 값=홈 주소"
          ],
          [
            "자릿수 분석",
            "자릿수 분석법",
            "자리별 분포 조사 고른 자릿수 선택\n자릿수→홈 주소"
          ],
          [
            "난수",
            "무작위 방법",
            "난수 발생 이용 난수를 홈 주소로"
          ]
        ],
        "gloss": "키 값 해시함수 적용해 홈 주소 계산하는 해싱 기법"
      },
      {
        "caption": "충돌 해결방법",
        "headers": [
          "구분",
          "해결 방법",
          "설명"
        ],
        "rows": [
          [
            "개방 주소법",
            "선형 조사법",
            "충돌 시 다음 주소로 이동"
          ],
          [
            "개방 주소법",
            "이차 조사법",
            "충돌 시 제곱 간격 다음 주소 이동"
          ],
          [
            "개방 주소법",
            "이중 해싱법",
            "충돌 시 제2 해시 함수로 주소 결정"
          ],
          [
            "폐쇄 주소법",
            "해시 체이닝",
            "충돌 레코드 연결 리스트로 연결"
          ],
          [
            "폐쇄 주소법",
            "병합 체이닝",
            "빈 슬롯 저장 후 포인터로 연결"
          ]
        ],
        "gloss": "개방 주소법 주소 이동, 폐쇄 주소법 포인터 연결 해결 방법"
      }
    ]
  },
  "동적 계획법(Dynamic Programming)": {
    "tables": [
      {
        "caption": "전제 조건과 동작 원리",
        "headers": [
          "원리",
          "설명"
        ],
        "rows": [
          [
            "전제 조건",
            "최적성 원리 관계식 도출 가능\n점화·재귀식 인접 항 함수 관계"
          ],
          [
            "① 점화/재귀식",
            "점화/재귀 관계식 도출\n부분 문제로 분할"
          ],
          [
            "② Memoization",
            "최소 문제 해 계산\n테이블 저장"
          ],
          [
            "③ Bottom-Up",
            "저장된 부분 문제 해 활용\n최종 최적해 도출"
          ]
        ],
        "gloss": "최적성 원리 문제 점화관계 도출, Memoization 활용 동작 원리"
      },
      {
        "caption": "접근방법",
        "headers": [
          "구분",
          "접근방법",
          "설명"
        ],
        "rows": [
          [
            "하향식",
            "Top Down",
            "메모이제이션 재귀 방식\n저장 내역 참조"
          ],
          [
            "상향식",
            "Bottom Up",
            "타뷸레이션 반복문 방식\n테이블 순차 채움"
          ]
        ],
        "gloss": "메모이제이션 재귀·타뷸레이션 반복문 두 접근방법"
      }
    ]
  },
  "그리디(탐욕) 알고리즘": {
    "diagram": [
      "/concept/answer/al-greedy.webp"
    ],
    "tables": [
      {
        "caption": "수행 절차 [해적검]",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "해 선택",
            "부분해 집합에 더할 다음 항목 선택\n현 상태 부분 최적화 기준 만족"
          ],
          [
            "적합성 검증",
            "새 부분해 집합 제약조건 위반 검사\n현 집합이 해가 될 가능성 검사"
          ],
          [
            "해 검증",
            "새 집합이 문제의 해인지 검사\n해 아니면 (1) 단계로 반복"
          ],
          [
            "해 도출",
            "최종해 도출"
          ]
        ],
        "gloss": "선택 시마다 순간 최적의 해 선택해 최종 해 도출 절차"
      },
      {
        "caption": "최적해 미도출 사례",
        "headers": [
          "항목",
          "설명"
        ],
        "rows": [
          [
            "거스름돈",
            "800원"
          ],
          [
            "동전의 종류",
            "500·400·100·50·10원\n400원 동전 새로 생긴 경우"
          ],
          [
            "최종해",
            "500원: 1개, 100원: 3개"
          ],
          [
            "실제 최적의 해",
            "400원: 2개"
          ]
        ],
        "gloss": "그리디 사용 시 최적해 미도출 사례"
      }
    ]
  },
  "허프만(Huffman) 코딩": {
    "diagram": [
      "/concept/answer/al-huffman.webp"
    ],
    "tables": [
      {
        "caption": "알고리즘 동작",
        "headers": [
          "순번",
          "설명"
        ],
        "rows": [
          [
            "1",
            "모든 문자 빈도수 내림차순 정렬"
          ],
          [
            "2",
            "적은 빈도수 두 문자 연결\n모든 문자 연결 반복"
          ],
          [
            "3",
            "쌍별 0·1 배정, 높은 쪽 0 배정"
          ],
          [
            "4",
            "각 문자에 코드 할당"
          ]
        ],
        "gloss": "빈도수 정렬 후 적은 두 문자 연결 반복, 문자별 코드 할당"
      },
      {
        "caption": "사례",
        "headers": [
          "과정",
          "설명"
        ],
        "rows": [
          [
            "데이터",
            "AAAAABABCCCDBBBCDA"
          ],
          [
            "발생확률 계산",
            "A 7/18, B 5/18\nC 4/18, D 2/18"
          ],
          [
            "각 문자에 코드 할당",
            "A: 0, B: 10\nC: 110, D: 111"
          ],
          [
            "데이터 압축",
            "아스키 1Byte × 18 = 18Byte\n35bit로 압축"
          ]
        ],
        "gloss": "AAAAABABCCCDBBBCDA 18Byte를 35bit로 압축 사례"
      }
    ]
  },
  "런랭스(Run Length) 코딩": {
    "tables": [
      {
        "caption": "예제",
        "headers": [
          "구분",
          "예제 1",
          "예제 2"
        ],
        "rows": [
          [
            "평문",
            "AAAABBBBBCCCCCCCCDEEEE\n22byte",
            "ABCDDDDDDDDEEEEEEEE\n19byte"
          ],
          [
            "압축",
            "4A5B8C1D5E\n10byte",
            "ABC*8D*9E\n9Byte"
          ],
          [
            "압축률",
            "22byte/10byte = 2.2%",
            "19byte/9byte = 2.11%"
          ],
          [
            "적용 방식",
            "LENGTH, RUN 순서\n변화 잦으면 압축률 저하",
            "유일 자료 그대로\n반복 자료만 적용"
          ]
        ],
        "gloss": "같은 값 연속을 개수와 반복 값으로 표현한 예제"
      }
    ]
  },
  "다익스트라(Dijkstra) 알고리즘": {
    "diagram": [
      "/concept/answer/al-dijkstra.webp"
    ],
    "tables": [
      {
        "caption": "수행 과정",
        "headers": [
          "#",
          "단계 내용",
          "설명"
        ],
        "rows": [
          [
            "1",
            "d[A]=0\n타 노드 ∞",
            "출발지 초기화\n미방문 무한대"
          ],
          [
            "2",
            "A→S 편입\nd[B]=10 d[C]=30 d[D]=15",
            "출발지 방문\n이웃 거리 측정"
          ],
          [
            "3",
            "최소 B 선택\nd[E]=20",
            "가중치 최저\nB 이웃 갱신"
          ],
          [
            "4",
            "최소 D 선택\nd[C]=20 d[F]=35",
            "가중치 최저\n30→20 갱신"
          ],
          [
            "5",
            "최소 C 선택\nd[F]=25",
            "가중치 최저\n35→25 갱신"
          ],
          [
            "6",
            "최소 F 선택",
            "미방문 이웃 무"
          ],
          [
            "7",
            "최소 E 선택\nQ=∅",
            "마지막 방문\n공집합 도달"
          ],
          [
            "8",
            "A→D→C→F",
            "탐색 종료\n최단 경로 25"
          ]
        ],
        "gloss": "가중치 최저 노드 선택, 이웃 거리 갱신 수행 과정"
      }
    ]
  },
  "TF-IDF(Term Frequency - Inverse Document Frequency)": {
    "tables": [
      {
        "caption": "산출 절차",
        "headers": [
          "순서",
          "절차",
          "설명"
        ],
        "rows": [
          [
            "1",
            "DTM 작성",
            "문서 행렬 표현"
          ],
          [
            "2",
            "단어빈도 계산",
            "특정 문서 내 단어 등장 빈도 수치\n단어 수 정규화"
          ],
          [
            "3",
            "불용어 처리",
            "조사·시제 제거"
          ],
          [
            "4",
            "역문서빈도 산출",
            "타 문서 등장도\n흔한 단어 가중치 낮춤"
          ],
          [
            "5",
            "TF-IDF 계산",
            "TF와 IDF 곱해 산출"
          ]
        ],
        "gloss": "DTM 작성, TF·IDF 계산 후 곱해 산출하는 절차"
      },
      {
        "caption": "정의",
        "headers": [
          "구분",
          "설명"
        ],
        "rows": [
          [
            "TF",
            "단어빈도, 문서 내 등장 빈도\n높을수록 해당 문서 중요"
          ],
          [
            "IDF",
            "역문서 빈도, 흔한 단어 낮은 값\nDF 역수, 높으면 중요 단어"
          ],
          [
            "TF-IDF",
            "TF × IDF\n흔한 단어 IDF 0, 중요도 탈락"
          ]
        ],
        "gloss": "문서 내 등장 빈도 TF와 역문서 빈도 IDF 정의"
      }
    ]
  },
  "최소 신장 트리(MST, Minimum Spanning Tree)": {
    "diagram": [
      "/concept/answer/al-mst-1.webp",
      "/concept/answer/al-mst-2.webp"
    ],
    "tables": [
      {
        "caption": "프림(Prim) 알고리즘",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "1)",
            "시작 정점서 신장 트리 단계적 확장"
          ],
          [
            "2)",
            "시작 정점만 신장 트리 집합 포함"
          ],
          [
            "3)",
            "인접 정점 중 최저 간선 정점 선택"
          ],
          [
            "4)",
            "트리가 n-1개 간선 가지면 종료"
          ]
        ],
        "gloss": "정점 중심으로 최저 간선 정점 선택해 트리 확장"
      },
      {
        "caption": "크루스칼(Kruscal) 알고리즘",
        "headers": [
          "순서",
          "설명"
        ],
        "rows": [
          [
            "1)",
            "사이클 없는 최소비용 간선 선택"
          ],
          [
            "2)",
            "간선들 가중치 오름차순 정렬"
          ],
          [
            "3)",
            "사이클 없는 간선 MST 집합에 추가"
          ],
          [
            "4)",
            "사이클 형성 시 그 간선 제외"
          ]
        ],
        "gloss": "간선 중심으로 가중치 낮은 간선부터 골라 MST 추가"
      }
    ]
  },
  "트리 순회(Tree Traversal)": {
    "diagram": [
      "/concept/answer/al-tree-traversal.webp"
    ],
    "tables": [
      {
        "caption": "유형",
        "headers": [
          "구분",
          "전위 순회(Pre-Order)",
          "중위 순회(In-Order)",
          "후위 순회(Post-Order)"
        ],
        "rows": [
          [
            "노드 방문 순서",
            "Root → Left → Right",
            "Left → Root → Right",
            "Left → Right → Root"
          ],
          [
            "수식 표기",
            "전위 표기",
            "중위 표기",
            "후위 표기"
          ]
        ],
        "gloss": "Root·Left·Right 노드 방문 순서로 전위·중위·후위 구분"
      }
    ]
  },
  "그래프 순회(Graph Traversal)": {
    "diagram": [
      "/concept/answer/al-graph-traversal-1.webp",
      "/concept/answer/al-graph-traversal-2.webp"
    ],
    "tables": [
      {
        "caption": "너비 우선 탐색(BFS)과 깊이 우선 탐색(DFS) 비교",
        "headers": [
          "구분",
          "너비 우선 탐색(BFS)",
          "깊이 우선 탐색(DFS)"
        ],
        "rows": [
          [
            "개념",
            "횡방향 탐색\n인접 정점 우선",
            "종방향 탐색\n최대한 깊게 탐색"
          ],
          [
            "구현",
            "큐 이용 구현",
            "스택 이용 구현, 백트래킹"
          ],
          [
            "장점",
            "넓은 그래프 유리",
            "깊은 그래프 유리"
          ],
          [
            "단점",
            "깊은 그래프 느림",
            "넓은 그래프 느림"
          ]
        ],
        "gloss": "횡방향 큐 이용 BFS와 종방향 스택 이용 DFS 비교"
      },
      {
        "caption": "BFS 동작 예 (큐 활용)",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "1",
            "노드1을 큐에 삽입\nQueue: [1]"
          ],
          [
            "2",
            "노드1의 너비는 2와 3\nQueue: [2, 3]"
          ],
          [
            "3",
            "노드2의 너비는 4와 5\nQueue: [3, 4, 5]"
          ],
          [
            "4",
            "이어서 6, 7 방문\nQueue: [5, 6, 7]"
          ]
        ],
        "gloss": "큐에 인접 정점 삽입해 너비 우선 방문하는 BFS 동작 예"
      }
    ]
  },
  "빔 탐색(Beam Search)": {
    "diagram": [
      "/concept/answer/al-beam-search-1.webp",
      "/concept/answer/al-beam-search-2.webp"
    ],
    "tables": [
      {
        "caption": "알고리즘 수행절차",
        "headers": [
          "No",
          "수행 절차",
          "수행 항목"
        ],
        "rows": [
          [
            "①",
            "문제 정의",
            "조건·제약 확인"
          ],
          [
            "②",
            "최초 K개 해 선택",
            "Beam Size K개 확률 기반 최초 해\n만족 K개 확인"
          ],
          [
            "③",
            "부분 해 확장",
            "새 부분 해 제약조건 여부\n확률 기반 Score"
          ],
          [
            "④",
            "K개 해 선택",
            "최고 확률 K개 해\n나머지 후보 삭제, ③·④ 반복"
          ],
          [
            "⑤",
            "최종 해 선택",
            "확률 점수 최고 해 선택"
          ]
        ],
        "gloss": "Beam Size K개 확률 기반 해 선택·확장 반복, 최종 해 선택"
      },
      {
        "caption": "자연어 처리의 Beam Search 활용 사례 (Beam size = 2)",
        "headers": [
          "단계",
          "설명"
        ],
        "rows": [
          [
            "1단계",
            "<S>에서 I(0.4), the(0.3) 유지"
          ],
          [
            "2단계",
            "I → am(0.8) / do(0.5)\nthe → cat(0.4) / dog(0.6)"
          ],
          [
            "3단계",
            "am → cat(1.0) / dog(0.8)\ndog → barked(0.9) / sleep(0.7)"
          ],
          [
            "최종",
            "\"I am cat\"(1.0) 선택\n\"the dog barked\"(0.9) 미선택"
          ]
        ],
        "gloss": "Beam size = 2, 상위 2개 유지 자연어 처리 활용 사례"
      }
    ]
  }
};

export const answerSheetFor = (title?: string | null): AnswerSheet | undefined =>
  title ? ANSWER_SHEETS[title] : undefined;
