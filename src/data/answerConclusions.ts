import type { ConcPattern } from "@/lib/answerGuide";

/**
 * 토픽 답안지 템플릿 3단락(결론 = 차별화 단락) 내용 — 1교시 지침 V36.
 *
 * 2026-10-11 "3단락 도형·그래프·리스트 다 제대로 들어간 게 없는데?" — 템플릿이 결론 자리를 빈칸 안내로만
 * 그렸다. 3단락은 교재 밖 차별화 요소(최신 기술·표준 / 정량 수치 / 실제 적용 사례 / 견해)를 쓰는 자리라
 * 교재 서브노트로는 채울 수 없어, 토픽마다 표준 번호·실제 적용·수치를 확인해 적었다(sources 에 근거).
 * 2단락(답안용 표·개념도)에 나온 이름은 다시 쓰지 않는다. 키 = 서브노트 제목. 없는 토픽은 빈칸 안내.
 */
export type ConcBox = { label: string; role: string };
export type AnswerConclusion = {
  concTitle: string;
  kind: string;
  form: "도형" | "그래프" | "리스트";
  pattern?: ConcPattern;
  boxes?: ConcBox[];
  hi?: number;
  group?: string;
  arrows?: string[];
  graph?: {
    x: string;
    y: string;
    series: { name: string; pts: [number, number][]; hi?: boolean }[];
    labels: string[];
  };
  items?: { kw: string; desc: string; hi?: boolean }[];
  gloss: string;
  diff: string[];
  sources: string[];
};

export const ANSWER_CONCLUSIONS: Record<string, AnswerConclusion> = {
  "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)": {
    "concTitle": "하이브리드 기술",
    "kind": "「A와 B」 두 기법",
    "form": "도형",
    "pattern": "hybrid",
    "boxes": [
      {
        "label": "소스코딩",
        "role": "압축 효율"
      },
      {
        "label": "채널코딩",
        "role": "오류 내성"
      },
      {
        "label": "JSCC",
        "role": "결합 부호화"
      },
      {
        "label": "시맨틱 통신",
        "role": "의미 전달"
      }
    ],
    "hi": 2,
    "gloss": "분리 설계 지연 한계, JSCC 결합으로 6G 의미 통신 대응",
    "diff": [
      "최신 기술: Deep JSCC(소스·채널 결합 부호화, 2019 IEEE TCCN)",
      "표준: 5G NR 채널코딩 데이터 LDPC·제어 Polar(3GPP TS 38.212)",
      "견해: 섀넌 분리 정리는 무한 블록 길이 가정 — 저지연·저SNR 에서는 결합 설계가 유리"
    ],
    "sources": [
      "C. E. Shannon, A Mathematical Theory of Communication, 1948 (source-channel separation)",
      "E. Bourtsoulatze, D. B. Kurka, D. Gündüz, Deep Joint Source-Channel Coding for Wireless Image Transmission, IEEE TCCN 2019",
      "3GPP TS 38.212 (NR multiplexing and channel coding: LDPC/Polar)"
    ]
  },
  "PCM(Pulse-Code Modulation)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "리스트",
    "items": [
      {
        "kw": "G.711",
        "desc": "전화 음성 64kbps",
        "hi": true
      },
      {
        "kw": "CD-DA",
        "desc": "44.1kHz·16비트 LPCM",
        "hi": false
      },
      {
        "kw": "E1·T1",
        "desc": "64kbps 채널 TDM",
        "hi": false
      },
      {
        "kw": "ADPCM",
        "desc": "G.726 32kbps 압축",
        "hi": false
      }
    ],
    "gloss": "8kHz·8비트 64kbps 기준, ADPCM으로 대역 절반 절감",
    "diff": [
      "표준: ITU-T G.711 — 8,000표본/s × 8비트 = 64kbit/s(μ-law/A-law)",
      "수치: CD-DA 44.1kHz·16비트, E1 2.048Mbit/s(32×64k)·T1 1.544Mbit/s(24채널)",
      "표준: ITU-T G.726 ADPCM 32kbit/s — G.711 대비 절반"
    ],
    "sources": [
      "ITU-T G.711",
      "IEC 60908 (Compact Disc Digital Audio, Red Book)",
      "ITU-T G.704/G.732 (E1 2048 kbit/s), ANSI T1.403 (T1 1544 kbit/s)",
      "ITU-T G.726"
    ]
  },
  "QAM(Quadrature Amplitude Modulation)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "그래프",
    "graph": {
      "x": "Wi-Fi 세대",
      "y": "심볼당 비트",
      "series": [
        {
          "name": "Wi-Fi 최고 차수 QAM",
          "pts": [
            [
              4,
              6
            ],
            [
              5,
              8
            ],
            [
              6,
              10
            ],
            [
              7,
              12
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "Wi-Fi 5 256QAM",
        "Wi-Fi 6 1024QAM",
        "Wi-Fi 7 4096QAM"
      ]
    },
    "gloss": "고차 QAM 높은 SNR 필요 한계, 근거리 고속 링크 활용",
    "diff": [
      "표준: IEEE 802.11n 64QAM → 802.11ac 256QAM → 802.11ax 1024QAM → 802.11be 4096QAM",
      "수치: 4096QAM 심볼당 12비트 — 1024QAM(10비트) 대비 이론 속도 20% 향상",
      "견해: 차수가 오를수록 성상점 간격이 좁아져 고SNR 근거리에서만 효과"
    ],
    "sources": [
      "IEEE 802.11ac-2013, IEEE 802.11ax-2021, IEEE 802.11be (Wi-Fi 7)",
      "Wi-Fi Alliance Wi-Fi CERTIFIED 7 (2024-01) — 4096-QAM 선택 기능",
      "https://en.wikipedia.org/wiki/IEEE_802.11be-2024"
    ]
  },
  "CSMA/CD": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "충돌 도메인",
        "role": "반이중 한계"
      },
      {
        "label": "스위치 전이중",
        "role": "충돌 제거"
      },
      {
        "label": "802.3ae",
        "role": "전이중 전용"
      },
      {
        "label": "802.3cg PLCA",
        "role": "순번 송신"
      }
    ],
    "hi": 0,
    "gloss": "공유 매체 충돌 한계, 10GbE부터 전이중 전용으로 대체",
    "diff": [
      "표준: IEEE 802.3x(1997) 전이중, 802.3ae(2002) 10GbE 는 전이중만 정의 — CSMA/CD 미사용",
      "최신 표준: IEEE 802.3cg-2019 10BASE-T1S PLCA — 차량 멀티드롭(최대 8노드) 라운드로빈 송신",
      "견해: 충돌 감지는 현재 차량·산업 멀티드롭 구간에만 남음"
    ],
    "sources": [
      "IEEE 802.3x-1997",
      "IEEE 802.3ae-2002",
      "IEEE 802.3cg-2019 Clause 147/148 (PLCA)",
      "https://blog.teledynelecroy.com/2022/08/physical-layer-collision-avoidance-in.html"
    ]
  },
  "CSMA/CA": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "리스트",
    "items": [
      {
        "kw": "OFDMA",
        "desc": "802.11ax 다중 사용자 동시",
        "hi": true
      },
      {
        "kw": "BSS Coloring",
        "desc": "OBSS 간섭 공간 재사용",
        "hi": false
      },
      {
        "kw": "MLO",
        "desc": "802.11be 다중 링크 동시",
        "hi": false
      }
    ],
    "gloss": "밀집 환경 경쟁 지연 한계, OFDMA 스케줄 접속으로 해소",
    "diff": [
      "표준: IEEE 802.11ax(Wi-Fi 6) OFDMA·트리거 기반 상향 다중 접속, BSS Coloring 공간 재사용",
      "최신 표준: IEEE 802.11be(Wi-Fi 7) Multi-Link Operation — 인증 필수 기능",
      "견해: 경쟁 기반 접속은 단말 밀집 시 백오프 지연이 커져 AP 스케줄링 병행 필요"
    ],
    "sources": [
      "IEEE 802.11ax-2021",
      "IEEE 802.11be (Wi-Fi 7), Wi-Fi Alliance Wi-Fi CERTIFIED 7"
    ]
  },
  "다중화(Multiplexing)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "도형",
    "pattern": "branch",
    "boxes": [
      {
        "label": "다중화",
        "role": "자원 분할"
      },
      {
        "label": "OFDM",
        "role": "LTE·5G 전송"
      },
      {
        "label": "DWDM",
        "role": "광 백본"
      },
      {
        "label": "MIMO",
        "role": "공간 다중화"
      }
    ],
    "hi": 0,
    "gloss": "주파수 자원 한계, OFDM·MIMO 결합으로 주파수 효율 향상",
    "diff": [
      "표준: 5G NR CP-OFDM(하향·상향)·DFT-s-OFDM(상향) — 3GPP TS 38.211",
      "표준: DWDM 주파수 격자 ITU-T G.694.1",
      "사례: LTE·5G MIMO 공간 다중화로 동일 대역 다중 스트림"
    ],
    "sources": [
      "3GPP TS 38.211",
      "ITU-T G.694.1",
      "3GPP TS 36.211 (LTE OFDMA, MIMO)"
    ]
  },
  "서비스 프리미티브(Service Primitive)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "도형",
    "pattern": "branch",
    "boxes": [
      {
        "label": "서비스 프리미티브",
        "role": "계층 간 규약"
      },
      {
        "label": "확인형 서비스",
        "role": "연결 설정"
      },
      {
        "label": "비확인형 서비스",
        "role": "데이터 전송"
      },
      {
        "label": "제공자 개시형",
        "role": "장애 통보"
      }
    ],
    "hi": 0,
    "gloss": "CONNECT 확인형·DATA 비확인형, 서비스 성격별 조합 선택",
    "diff": [
      "표준: ITU-T X.210(OSI 서비스 정의 규약) — 확인형·비확인형·제공자 개시형 서비스 분류",
      "사례: IEEE 802.2 LLC 비연결형 DL-UNITDATA 는 요청·지시 2종만 사용",
      "견해: 3GPP 계층 규격도 같은 request/indication 표기를 써 계층 인터페이스 설계 기준"
    ],
    "sources": [
      "ITU-T X.210 (OSI Layer Service Definition Conventions)",
      "https://www.itu.int/dms_pubrec/itu-t/rec/x/T-REC-X.210-198811-S!!TOC-HTM-E.htm",
      "IEEE 802.2 (LLC)",
      "https://www.itecspec.com/3gpp/23.041/s/9.2.0"
    ]
  },
  "OSI 7 Layer (ISO 7498)": {
    "concTitle": "표준화 동향",
    "kind": "표준·규격 기술",
    "form": "도형",
    "pattern": "contain",
    "boxes": [
      {
        "label": "7498-1 기본 모델",
        "role": "계층 정의"
      },
      {
        "label": "7498-2 보안 구조",
        "role": "보안 서비스"
      },
      {
        "label": "7498-3 명명·주소",
        "role": "이름 체계"
      },
      {
        "label": "7498-4 관리 체계",
        "role": "망 관리"
      }
    ],
    "hi": 0,
    "group": "ISO/IEC 7498",
    "gloss": "참조 모델로 정착, 실구현은 TCP/IP 4계층 주도",
    "diff": [
      "표준: ISO/IEC 7498-1(=ITU-T X.200) 기본 모델, 7498-2 보안 구조(=X.800), 7498-3 명명·주소, 7498-4 관리 체계",
      "표준: 인터넷 4계층 RFC 1122/1123",
      "견해: OSI 는 참조·교육 모델, 실제 망은 TCP/IP 가 사실상 표준"
    ],
    "sources": [
      "ISO/IEC 7498-1:1994 / ITU-T X.200",
      "ISO 7498-2:1989 / ITU-T X.800",
      "ISO/IEC 7498-3",
      "ISO/IEC 7498-4:1989",
      "RFC 1122, RFC 1123"
    ]
  },
  "HTTP/3": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "기존 기술의 개선판",
    "form": "그래프",
    "graph": {
      "x": "전송 스택",
      "y": "연결 RTT",
      "series": [
        {
          "name": "최초 연결",
          "pts": [
            [
              1,
              3
            ],
            [
              2,
              2
            ],
            [
              3,
              1
            ]
          ],
          "hi": true
        },
        {
          "name": "재연결",
          "pts": [
            [
              1,
              2
            ],
            [
              2,
              1
            ],
            [
              3,
              0
            ]
          ]
        }
      ],
      "labels": [
        "TCP+TLS1.2 3-RTT",
        "TCP+TLS1.3 2-RTT",
        "QUIC 1-RTT"
      ]
    },
    "gloss": "TCP+TLS 대비 연결 RTT 단축, 웹사이트 36% 사용",
    "diff": [
      "표준: RFC 9114(HTTP/3, 2022)·RFC 9000(QUIC, 2021)·RFC 9001(QUIC-TLS)",
      "수치: 연결 수립 TCP+TLS1.2 3-RTT → TCP+TLS1.3 2-RTT → QUIC 1-RTT(재연결 0-RTT)",
      "사례: W3Techs 2025-11 기준 전체 웹사이트 35.9% 가 HTTP/3 사용"
    ],
    "sources": [
      "RFC 9114, RFC 9000, RFC 9001",
      "RFC 8446 (TLS 1.3 1-RTT), RFC 5246 (TLS 1.2 2-RTT)",
      "https://w3techs.com/technologies/breakdown/ce-http3/ranking"
    ]
  },
  "TCP 연결의 설정 및 해제(Handshaking)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "도형",
    "pattern": "pairs",
    "boxes": [
      {
        "label": "SYN Flooding",
        "role": "자원 고갈"
      },
      {
        "label": "SYN Cookie",
        "role": "상태 미저장"
      },
      {
        "label": "1-RTT 지연",
        "role": "왕복 대기"
      },
      {
        "label": "TCP Fast Open",
        "role": "데이터 동봉"
      }
    ],
    "hi": 1,
    "gloss": "반개방 자원 고갈, SYN Cookie·TFO로 보안·지연 개선",
    "diff": [
      "표준: RFC 4987 — SYN Flooding 공격과 SYN Cookie 등 완화 기법",
      "표준: RFC 7413 TCP Fast Open — 재연결 시 SYN 에 데이터 실어 1-RTT 절감",
      "견해: 핸드셰이크 지연은 QUIC 처럼 전송·암호 결합으로 근본 해소"
    ],
    "sources": [
      "RFC 4987",
      "RFC 7413"
    ]
  },
  "TCP 혼잡제어": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "그래프",
    "graph": {
      "x": "연도",
      "y": "초기 윈도우(MSS)",
      "series": [
        {
          "name": "초기 윈도우",
          "pts": [
            [
              1988,
              1
            ],
            [
              1999,
              2
            ],
            [
              2002,
              4
            ],
            [
              2013,
              10
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "RFC 2581 IW 2",
        "RFC 3390 IW≤4",
        "RFC 6928 IW 10"
      ]
    },
    "gloss": "느린 출발 지연 한계, IW10·CUBIC으로 고대역 대응",
    "diff": [
      "표준: 초기 윈도우 1 → RFC 2581 2 → RFC 3390 최대 4 → RFC 6928 10 세그먼트",
      "최신 표준: RFC 9438 CUBIC(2023) — Linux·Windows·Apple 기본 혼잡제어",
      "사례: Google BBR — 손실 대신 대역폭·RTT 측정 기반 제어"
    ],
    "sources": [
      "RFC 2581, RFC 3390, RFC 6928",
      "https://www.rfc-editor.org/rfc/rfc9438",
      "N. Cardwell et al., BBR: Congestion-Based Congestion Control, ACM Queue 2016"
    ]
  },
  "TCP 와 UDP 비교": {
    "concTitle": "융합 방안",
    "kind": "비교형",
    "form": "도형",
    "pattern": "hybrid",
    "boxes": [
      {
        "label": "TCP",
        "role": "신뢰 전송"
      },
      {
        "label": "UDP",
        "role": "경량 전송"
      },
      {
        "label": "QUIC",
        "role": "UDP 신뢰화"
      },
      {
        "label": "HTTP/3",
        "role": "웹 전송"
      }
    ],
    "hi": 2,
    "gloss": "TCP 신뢰성·UDP 경량성 결합, QUIC으로 지연 단축",
    "diff": [
      "표준: RFC 9000 QUIC — UDP 위 재전송·혼잡제어·TLS 1.3 통합",
      "표준: RFC 9114 HTTP/3 — QUIC 기반 웹 전송",
      "사례: W3Techs 2025-11 기준 웹사이트 35.9% HTTP/3 사용"
    ],
    "sources": [
      "RFC 9000",
      "RFC 9114",
      "https://w3techs.com/technologies/breakdown/ce-http3/ranking"
    ]
  },
  "IPv4와 IPv6 터널링": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "기존 기술의 개선판",
    "form": "리스트",
    "items": [
      {
        "kw": "464XLAT",
        "desc": "RFC 6877 IPv6 전용망",
        "hi": true
      },
      {
        "kw": "NAT64",
        "desc": "DNS64 연동 IPv4 접속",
        "hi": false
      },
      {
        "kw": "DS-Lite",
        "desc": "IPv6 망 위 IPv4 전달",
        "hi": false
      }
    ],
    "gloss": "이중 망 운영 부담, IPv6 전용망+464XLAT로 단일화",
    "diff": [
      "표준: 464XLAT RFC 6877, NAT64 RFC 6146·DNS64 RFC 6147, DS-Lite RFC 6333",
      "사례: T-Mobile US IPv6 전용 이동망에 464XLAT 적용",
      "사례: Apple App Store 2016-06 부터 IPv6 전용(NAT64) 망 지원 의무화"
    ],
    "sources": [
      "RFC 6877",
      "RFC 6146, RFC 6147",
      "RFC 6333",
      "Apple Developer News, Supporting IPv6-only Networks (2016)"
    ]
  },
  "DNS(Domain Name System)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "리스트",
    "items": [
      {
        "kw": "DNSSEC",
        "desc": "서명 검증 위조 방지",
        "hi": true
      },
      {
        "kw": "DoT",
        "desc": "RFC 7858 TLS 암호 질의",
        "hi": false
      },
      {
        "kw": "DoH",
        "desc": "RFC 8484 HTTPS 질의",
        "hi": false
      }
    ],
    "gloss": "평문 UDP 위조·도청 취약, DNSSEC 서명·DoH로 보완",
    "diff": [
      "표준: DNSSEC RFC 4033~4035 — 루트 존 2010-07 서명",
      "표준: DNS over TLS RFC 7858, DNS over HTTPS RFC 8484",
      "사례: 2008 Kaminsky 캐시 포이즈닝 취약점 공개로 DNSSEC 확산"
    ],
    "sources": [
      "RFC 4033, RFC 4034, RFC 4035",
      "RFC 7858",
      "RFC 8484",
      "IANA/ICANN Root Zone DNSSEC (2010)"
    ]
  },
  "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "무한 카운팅",
        "role": "수렴 지연"
      },
      {
        "label": "Split Horizon",
        "role": "역방향 차단"
      },
      {
        "label": "Poison Reverse",
        "role": "무한값 통보"
      },
      {
        "label": "Hold-down",
        "role": "갱신 보류"
      }
    ],
    "hi": 0,
    "gloss": "RIP 16홉 무한대 루프 한계, Split Horizon으로 억제",
    "diff": [
      "수치: RIP 최대 15홉 — 16을 무한대로 보아 count-to-infinity 제한(RFC 2453)",
      "표준: RFC 2453 Split Horizon·Poisoned Reverse, Triggered Update",
      "견해: 대규모 망은 링크상태 OSPF(RFC 2328) Area 계층화로 수렴 단축"
    ],
    "sources": [
      "RFC 2453 (RIP Version 2)",
      "RFC 1058 (RIP v1, hold-down 설명)",
      "RFC 2328 (OSPF Version 2)"
    ]
  },
  "FEC(Forward Error Correction) / BEC(Backward Error Correction)": {
    "concTitle": "하이브리드 기술",
    "kind": "「A와 B」 두 기법",
    "form": "도형",
    "pattern": "hybrid",
    "boxes": [
      {
        "label": "FEC",
        "role": "자체 정정"
      },
      {
        "label": "BEC",
        "role": "재전송 정정"
      },
      {
        "label": "HARQ",
        "role": "결합 복호"
      },
      {
        "label": "5G NR",
        "role": "LDPC 결합"
      }
    ],
    "hi": 2,
    "gloss": "FEC 오버헤드·ARQ 지연 상충, HARQ로 5G 신뢰성 확보",
    "diff": [
      "최신 기술: HARQ — 오류 패킷 버리지 않고 재전송분과 결합 복호(Chase·IR)",
      "수치: LTE HARQ 프로세스 8개 → 5G NR Rel-15 최대 16개 병렬",
      "표준: 5G NR LDPC + 중복 버전(RV) 증분 재전송 — 3GPP TS 38.212/38.214"
    ],
    "sources": [
      "3GPP TS 38.212, TS 38.214",
      "https://platform.commit.tu-berlin.de/en/book/cm/chapter/ch14/section/s05"
    ]
  },
  "해밍코드(Hamming code)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "그래프",
    "graph": {
      "x": "패리티 비트 수 p",
      "y": "부호율(%)",
      "series": [
        {
          "name": "해밍 부호율",
          "pts": [
            [
              3,
              57
            ],
            [
              4,
              73
            ],
            [
              5,
              84
            ],
            [
              6,
              90
            ],
            [
              7,
              94
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "(7,4) 57%",
        "(15,11) 73%",
        "(63,57) 90%"
      ]
    },
    "gloss": "1비트 정정 한계, SECDED (72,64)로 ECC 메모리 활용",
    "diff": [
      "수치: 부호율 (2^p−1−p)/(2^p−1) — (7,4) 57% → (63,57) 90%",
      "사례: ECC 메모리 SECDED (72,64) — 64비트당 8검사비트, 1비트 정정·2비트 검출",
      "표준: JEDEC DDR5(JESD79-5) 온다이 ECC 탑재"
    ],
    "sources": [
      "R. W. Hamming, Error Detecting and Error Correcting Codes, Bell System Technical Journal, 1950",
      "부호율은 2^p ≥ d+p+1 에서 계산",
      "JEDEC JESD79-5 (DDR5)"
    ]
  },
  "CRC(Cyclic Redundancy Check)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "리스트",
    "items": [
      {
        "kw": "IEEE 802.3",
        "desc": "CRC-32 FCS 오류 검출",
        "hi": false
      },
      {
        "kw": "5G NR",
        "desc": "CRC-24 전송블록 검사",
        "hi": true
      },
      {
        "kw": "iSCSI·SCTP",
        "desc": "CRC-32C 무결성 검사",
        "hi": false
      },
      {
        "kw": "USB",
        "desc": "CRC-5·16 패킷 검사",
        "hi": false
      }
    ],
    "gloss": "n차 CRC는 n비트 이하 집단 오류 모두 검출, 유무선·저장 표준 채택",
    "diff": [
      "최신 표준: 5G NR 채널 코딩(3GPP TS 38.212)이 CRC-24A/B/C·CRC-16·11·6 사용",
      "적용 사례: Ethernet FCS CRC-32(IEEE 802.3), iSCSI·SCTP CRC-32C, USB CRC-5/16",
      "정량: n차 생성 다항식은 길이 n 이하 버스트 오류를 100% 검출(CRC-32 → 32비트)"
    ],
    "sources": [
      "IEEE Std 802.3 §3.2.9 Frame Check Sequence(CRC-32)",
      "3GPP TS 38.212 §5.1 CRC calculation",
      "RFC 3720(iSCSI CRC32C), RFC 3309·RFC 9260(SCTP CRC32c)",
      "USB 2.0 Specification §8.3.5(CRC5/CRC16)",
      "Peterson & Brown, 'Cyclic Codes for Error Detection', Proc. IRE 1961"
    ]
  },
  "QoS(Quality of Service)": {
    "concTitle": "문제점과 해결방안",
    "kind": "QoS·보안 등 세부 기법",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "Bufferbloat",
        "role": "큐 지연 증가"
      },
      {
        "label": "L4S",
        "role": "저지연 전송"
      },
      {
        "label": "DetNet",
        "role": "결정적 전송"
      },
      {
        "label": "TSN 802.1Qbv",
        "role": "게이트 제어"
      },
      {
        "label": "5G 5QI",
        "role": "흐름 등급화"
      }
    ],
    "hi": 0,
    "gloss": "평균 지연 보장 한계, L4S·DetNet으로 지연 상한 보장 필요",
    "diff": [
      "최신 표준: IETF L4S 구조(RFC 9330, 2023)·DetNet 구조(RFC 8655, 2019)",
      "IEEE 802.1Qbv TSN 시간 인지 쉐이퍼, 3GPP 5G QoS 흐름 5QI(TS 23.501 §5.7)",
      "견해: Best Effort 큐 지연(Bufferbloat)은 대역폭 증설로 해결 안 돼 지연 상한 기술 필요"
    ],
    "sources": [
      "RFC 9330 L4S Architecture(2023.1)",
      "RFC 8655 Deterministic Networking Architecture(2019.10)",
      "IEEE Std 802.1Qbv-2015",
      "3GPP TS 23.501 §5.7 QoS model"
    ]
  },
  "ARP(Address Resolution Protocol)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "리스트",
    "items": [
      {
        "kw": "ARP 스푸핑",
        "desc": "인증 없는 응답 위조",
        "hi": false
      },
      {
        "kw": "DAI",
        "desc": "IP·MAC 바인딩 검증",
        "hi": true
      },
      {
        "kw": "정적 ARP",
        "desc": "게이트웨이 고정 등록",
        "hi": false
      },
      {
        "kw": "IPv6 SEND",
        "desc": "NDP 암호 서명 보호",
        "hi": false
      }
    ],
    "gloss": "인증 없는 응답 위조 한계, DAI·SEND로 주소 무결성 확보 필요",
    "diff": [
      "대응 기법: 스위치 DAI(Dynamic ARP Inspection) — DHCP Snooping 바인딩으로 ARP 검증",
      "표준: IPv6는 ARP 대신 NDP(RFC 4861), 보안 확장 SEND(RFC 3971)",
      "견해: 비인증 구조라 단말 아닌 스위치 단 검증이 현실적"
    ],
    "sources": [
      "RFC 826 ARP",
      "RFC 4861 Neighbor Discovery for IPv6",
      "RFC 3971 SEcure Neighbor Discovery(SEND)",
      "Cisco Catalyst 'Configuring Dynamic ARP Inspection' 설정 가이드"
    ]
  },
  "RARP(Reverse Address Resolution Protocol)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "RARP",
        "role": "IP만 획득"
      },
      {
        "label": "BOOTP",
        "role": "Relay 중계"
      },
      {
        "label": "DHCP",
        "role": "임대 자동화"
      },
      {
        "label": "IPv6 SLAAC",
        "role": "무상태 구성"
      }
    ],
    "hi": 2,
    "arrows": [
      "라우터 통과",
      "동적 임대",
      "IPv6 확장"
    ],
    "gloss": "IP만 주고 라우터 못 넘는 한계, BOOTP·DHCP로 대체",
    "diff": [
      "표준 계보: RARP RFC 903(1984) → BOOTP RFC 951(1985)·Relay RFC 1542 → DHCP RFC 2131(1997)",
      "최신: IPv6는 SLAAC(RFC 4862)·DHCPv6(RFC 8415)로 자동 구성",
      "견해: L2 Broadcast 한정이라 서브넷마다 서버가 필요한 구조적 한계"
    ],
    "sources": [
      "RFC 903 RARP",
      "RFC 951 BOOTP",
      "RFC 1542 BOOTP Relay",
      "RFC 2131 DHCP",
      "RFC 4862 IPv6 SLAAC",
      "RFC 8415 DHCPv6"
    ]
  },
  "DHCP(Dynamic Host Configuration Protocol)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "도형",
    "pattern": "pairs",
    "boxes": [
      {
        "label": "Starvation",
        "role": "IP 풀 고갈"
      },
      {
        "label": "Port Security",
        "role": "MAC 수 제한"
      },
      {
        "label": "Rogue 서버",
        "role": "위조 응답"
      },
      {
        "label": "DHCP Snooping",
        "role": "신뢰 포트"
      }
    ],
    "hi": 3,
    "gloss": "인증 없는 할당 한계, Snooping으로 위조 서버 차단",
    "diff": [
      "공격 사례: 위조 MAC 대량 요청 DHCP Starvation, 가짜 게이트웨이 배포 Rogue DHCP 서버",
      "대응 기법: 스위치 DHCP Snooping 신뢰/비신뢰 포트, Port Security MAC 수 제한",
      "최신 표준: DHCPv6(RFC 8415), 견해: 프로토콜 인증보다 L2 스위치 방어가 현실적"
    ],
    "sources": [
      "RFC 2131 DHCP",
      "RFC 8415 DHCPv6",
      "Cisco Catalyst 'Configuring DHCP Snooping'·'Port Security' 설정 가이드"
    ]
  },
  "SCTP(Stream Control Transmission Protocol)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "리스트",
    "items": [
      {
        "kw": "NAT 통과",
        "desc": "방화벽·NAT 미지원",
        "hi": false
      },
      {
        "kw": "RFC 6951",
        "desc": "UDP 캡슐화 전송",
        "hi": true
      },
      {
        "kw": "RFC 8261",
        "desc": "DTLS 위 WebRTC 채널",
        "hi": false
      },
      {
        "kw": "5G NGAP",
        "desc": "gNB↔AMF 시그널링",
        "hi": false
      }
    ],
    "gloss": "NAT·방화벽 통과 한계, UDP·DTLS 캡슐화로 WebRTC 확산",
    "diff": [
      "표준: SCTP over UDP(RFC 6951), SCTP over DTLS(RFC 8261), 기본 규격 RFC 9260(2022)이 RFC 4960 대체",
      "적용 사례: WebRTC 데이터 채널(RFC 8831), 5G NGAP·LTE S1AP 전송(3GPP TS 38.412)",
      "견해: 미들박스 미지원이 인터넷 확산 한계, 캡슐화로 우회"
    ],
    "sources": [
      "RFC 6951",
      "RFC 8261",
      "RFC 8831",
      "RFC 9260",
      "3GPP TS 38.412 NG signalling transport(SCTP)"
    ]
  },
  "C-RAN(Centralized / Cloud RAN)": {
    "concTitle": "적용 사례",
    "kind": "국내외 상용화가 진행 중인 기술",
    "form": "리스트",
    "items": [
      {
        "kw": "KT CCC",
        "desc": "'11 3G 품질 개선",
        "hi": true
      },
      {
        "kw": "SKT A-SCAN",
        "desc": "'12 분당 LTE 상용",
        "hi": false
      },
      {
        "kw": "China Mobile",
        "desc": "창사 C-RAN 시험망",
        "hi": false
      },
      {
        "kw": "eCPRI",
        "desc": "프론트홀 대역 절감",
        "hi": false
      }
    ],
    "gloss": "KT·SKT '11~'12 상용 적용, 프론트홀 부담은 eCPRI로 완화",
    "diff": [
      "적용 사례: KT CCC(2011.2 WCDMA)·LTE WARP(2012.1) — DU 집중·RU 분산",
      "적용 사례: SKT Advanced-SCAN 분당 LTE 상용망(2012), China Mobile 창사 C-RAN 시험",
      "견해: CPRI 광 프론트홀 비용이 확산 한계 → eCPRI·기능 분할로 대역 절감"
    ],
    "sources": [
      "디지털타임스 '3G·LTE 등 세계 최고 스마트 모바일 인프라'(KT CCC 2011.2)",
      "Samsung Newsroom 'KT·인텔 세계 최초 LTE CCC 솔루션 시연'(MWC 2011)",
      "Wikipedia 'C-RAN'(KT CCC, SKT SCAN/Advanced-SCAN)",
      "ZTE Technologies 2012-1 'China Mobile: Successful C-RAN Trial in Changsha'",
      "eCPRI Specification V1.0(2017)"
    ]
  },
  "O-RAN": {
    "concTitle": "적용 사례",
    "kind": "국내외 상용화가 진행 중인 기술",
    "form": "그래프",
    "graph": {
      "x": "CAPEX → OPEX",
      "y": "상대 비용(%)",
      "series": [
        {
          "name": "기존 RAN",
          "pts": [
            [
              1,
              100
            ],
            [
              2,
              100
            ]
          ]
        },
        {
          "name": "Rakuten Open vRAN",
          "pts": [
            [
              1,
              60
            ],
            [
              2,
              70
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "CAPEX 40%↓",
        "OPEX 30%↓",
        "AT&T 트래픽 70% 목표('26)"
      ]
    },
    "gloss": "Rakuten CAPEX 40%·OPEX 30% 절감, 통합 비용 관건",
    "diff": [
      "적용 사례·정량: Rakuten Mobile 완전 가상화 Open RAN — 기존 RAN 대비 CAPEX 40%·OPEX 30% 절감(LightCounting 2021, New Street Research 사이트 기준 검증)",
      "적용 사례: AT&T–Ericsson 5년 약 140억 달러 Open RAN 계약, 2026년 말 트래픽 70% 개방형 플랫폼",
      "견해: 멀티벤더 통합·검증(SI) 비용과 광 프론트홀 부담이 확산 한계"
    ],
    "sources": [
      "LightCounting Research Note 2021.8 (Rakuten open vRAN capex 40%·opex 30%)",
      "Fierce Network 'Analysts confirm Rakuten Mobile's network saves 40% capex on per site basis'",
      "Fierce Network 'AT&T awards $14 billion open RAN contract to Ericsson'",
      "RCR Wireless 'AT&T aims for 70% of traffic to traverse open network platform'"
    ]
  },
  "RAN(Radio Access Network) Sharing": {
    "concTitle": "적용 사례",
    "kind": "국내외 상용화가 진행 중인 기술",
    "form": "도형",
    "pattern": "branch",
    "boxes": [
      {
        "label": "RAN Sharing",
        "role": "인프라 공유"
      },
      {
        "label": "농어촌 5G",
        "role": "3사 공동망"
      },
      {
        "label": "영국 SRN",
        "role": "4G 95% 달성"
      },
      {
        "label": "TS 23.251",
        "role": "공유 구조"
      }
    ],
    "hi": 0,
    "gloss": "농어촌 5G 공동망 '24.4 완료, 중복투자 줄여 커버리지 확대",
    "diff": [
      "국내 사례: 농어촌 5G 공동이용 — 2022.7 1단계 개시, 2024.4 3단계 상용화로 5G 전국망 완료(SKT·KT·LGU+)",
      "해외 사례: 영국 Shared Rural Network(약 £1bn, 공공 £501m+사업자 £532m) — 4G 국토 95% 목표 2025년 조기 달성",
      "표준: 3GPP TS 23.251 Network sharing 구조",
      "견해: 공유 확대로 사업자 품질 차별화 약화 → 슬라이스·SLA 분리 필요"
    ],
    "sources": [
      "과기정통부 보도(뉴스서울 2024.4.18) 농어촌 5G 공동이용 3단계 상용화",
      "트위그 2022.7.20 1단계 1차 상용화(149개 읍면)",
      "ISPreview 2025.6 'SRN project delivers 95 percent UK cover of 4G'",
      "GOV.UK 'Shared Rural Network' 보도자료",
      "3GPP TS 23.251 Network sharing; Architecture and functional description"
    ]
  },
  "5G 특화망": {
    "concTitle": "적용 사례",
    "kind": "국내외 상용화가 진행 중인 기술",
    "form": "그래프",
    "graph": {
      "x": "연도",
      "y": "이음5G 기업 수",
      "series": [
        {
          "name": "이음5G",
          "pts": [
            [
              2021,
              1
            ],
            [
              2023,
              30
            ],
            [
              2024,
              36
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "'21.12 1호 네이버클라우드",
        "'24.12 36개 기업 76곳"
      ]
    },
    "gloss": "'24년 말 36개 기업 76곳 도입, 단말·장비 생태계 확대 필요",
    "diff": [
      "적용 사례: 2021.12 네이버클라우드 이음5G 1호 주파수 할당",
      "정량: 2023년 말 30개 기업·기관 54곳 → 2024.12 36개 기업 76곳",
      "견해: 전용 단말·장비 부족이 확산 한계, 인증·생태계 지원 필요"
    ],
    "sources": [
      "아주경제 2023.7.9 이음5G 기사(2021.12 네이버클라우드 1호)",
      "과기정통부 보도(뉴스서울) '이음5G, 디지털 강자로 확산 가속화'(2024.12, 36개 기업 76개 지역)",
      "과기정통부 보도(뉴스서울) 이음5G 2023년 말 30개 기업·기관 54개소"
    ]
  },
  "네트워크 슬라이싱": {
    "concTitle": "표준화 동향",
    "kind": "표준·규격 기술",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "네트워크 슬라이싱",
        "role": "Rel-15 도입"
      },
      {
        "label": "Rel-16 NSSAA",
        "role": "개별 인증"
      },
      {
        "label": "Rel-17 NSAC",
        "role": "UE 수 제한"
      },
      {
        "label": "T-Priority",
        "role": "재난망 상용"
      }
    ],
    "hi": 0,
    "arrows": [
      "인증 강화",
      "접속 제어",
      "상용 서비스"
    ],
    "gloss": "Rel-17 접속 제어까지 표준화, T-Mobile 재난 슬라이스 상용",
    "diff": [
      "표준: 3GPP Rel-15 S-NSSAI·NSSF, Rel-16 NSSAA(슬라이스별 인증), Rel-17 NSACF(슬라이스별 UE·PDU 세션 수 제어)",
      "적용 사례: T-Mobile T-Priority(2024.9 발표) 5G SA 기반 세계 최초 재난 대응 슬라이스",
      "견해: E2E SLA 보장 위해 RAN·코어 슬라이스 연동 필요"
    ],
    "sources": [
      "3GPP TS 23.501 §5.15(Network slicing, NSSAA·NSAC)",
      "3GPP TS 23.502 §4.2.9 NSSAA procedure",
      "T-Mobile Newsroom 2024.9.18 'T-Priority featuring the world's first network slice for first responders'"
    ]
  },
  "NWDAF(Network Data Analytics Function)": {
    "concTitle": "표준화 동향",
    "kind": "표준·규격 기술",
    "form": "리스트",
    "items": [
      {
        "kw": "Rel-15",
        "desc": "슬라이스 부하 분석 도입",
        "hi": false
      },
      {
        "kw": "Rel-16 eNA",
        "desc": "TS 23.288 분석 체계",
        "hi": false
      },
      {
        "kw": "Rel-18 FL",
        "desc": "다중 NWDAF 연합 학습",
        "hi": true
      },
      {
        "kw": "Rel-19 VFL",
        "desc": "NWDAF·AF 수직 연합",
        "hi": false
      }
    ],
    "gloss": "Rel-18 연합 학습으로 원본 공유 없이 학습, 데이터 편중 대응 필요",
    "diff": [
      "표준: Rel-16 eNA로 TS 23.288 분석 프레임워크 정립",
      "최신 표준: Rel-18 eNA Phase 3(TR 23.700-81) 다중 NWDAF 연합 학습, Rel-19 NWDAF·AF 수직 연합 학습(TR 23.700-84)",
      "견해: 사업자 간 데이터 편중·모델 드리프트 감시 필요"
    ],
    "sources": [
      "3GPP TS 23.501(Rel-15) NWDAF slice load",
      "3GPP TS 23.288 Architecture enhancements for 5G System to support network data analytics services",
      "3GPP TR 23.700-81(Rel-18 eNA Ph3)",
      "3GPP TS 23.288 V19.1.0 §5.4 Vertical Federated Learning, TR 23.700-84"
    ]
  },
  "네트워크 지능": {
    "concTitle": "표준화 동향",
    "kind": "일반 기술",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "L2 부분 자율",
        "role": "일부 자동화"
      },
      {
        "label": "L3 조건부 자율",
        "role": "도메인 자율"
      },
      {
        "label": "L4 고도 자율",
        "role": "예측 대응"
      },
      {
        "label": "L5 완전 자율",
        "role": "전 영역 자율"
      }
    ],
    "hi": 2,
    "arrows": [
      "상황 인지",
      "도메인 확장",
      "전 영역"
    ],
    "gloss": "TM Forum L0~L5 자율 단계, L4 이상은 인텐트 관리 필요",
    "diff": [
      "표준: TM Forum Autonomous Networks L0~L5, 3GPP TS 28.100(Rel-17) 자율 네트워크 등급",
      "표준화 기구: ETSI ZSM·ENI ISG(2017 설립)",
      "견해: L4 이상은 운용자 의도(인텐트)를 정책으로 바꾸는 관리 필요"
    ],
    "sources": [
      "3GPP TS 28.100 Levels of autonomous network(Rel-17)",
      "TM Forum IG1218/IG1230 Autonomous Networks",
      "ETSI ISG ZSM·ENI"
    ]
  },
  "6G": {
    "concTitle": "표준화 동향",
    "kind": "표준·규격 기술",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "ITU M.2160",
        "role": "비전 제시"
      },
      {
        "label": "Rel-20 연구",
        "role": "요구 정의"
      },
      {
        "label": "WRC-27",
        "role": "주파수 확정"
      },
      {
        "label": "Rel-21 규격",
        "role": "6G 표준 완성"
      }
    ],
    "hi": 3,
    "arrows": [
      "연구 착수",
      "대역 확보",
      "규격 동결"
    ],
    "gloss": "Rel-21 '29.3 규격 완료 목표, 7~8GHz 대역 확보가 관건",
    "diff": [
      "표준: ITU-R M.2160(2023.11) IMT-2030 프레임워크 6대 시나리오(AI·통신, 센싱 통합 포함)",
      "3GPP Rel-20 6G 연구(TR 38.914 2026.6 승인) → Rel-21 Stage-3 2028.12·ASN.1 2029.3 동결",
      "WRC-27 의제 1.7: 4.4~4.8·7.125~8.4·14.8~15.35GHz IMT 검토",
      "견해: 상용 일정에 맞춰 중대역 주파수 선확보 필요"
    ],
    "sources": [
      "ITU-R Recommendation M.2160-0(2023.11)",
      "3GPP News 'Rel-21 timeline'(TSG#112, 2026.6)",
      "Light Reading 'It's official – 6G specs are set for early 2029'",
      "3GPP Release 20 page",
      "WRC-27 Agenda item 1.7(ITU-R Resolution 256)"
    ]
  },
  "ISAC(Integrated Sensing and Communication)": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "6G·AI 등 신기술",
    "form": "도형",
    "pattern": "beforeAfter",
    "boxes": [
      {
        "label": "분리형 레이더",
        "role": "별도 장비"
      },
      {
        "label": "ISAC",
        "role": "자원 공유"
      },
      {
        "label": "Wi-Fi 센싱",
        "role": "동작 감지"
      },
      {
        "label": "NR UAV 센싱",
        "role": "드론 탐지"
      }
    ],
    "hi": 1,
    "gloss": "레이더 별도 구축 한계, 802.11bf·NR 센싱으로 표준화 진행",
    "diff": [
      "표준: IEEE 802.11bf(2025.5 승인) WLAN 센싱 — 동작·제스처 감지",
      "3GPP Rel-19 TR 38.901 ISAC 채널 모델 추가, 후속 NR 센싱 연구(TR 38.765, UAV 대상)",
      "ETSI ISG ISAC(2023 설립) GR ISC 002(2025.8) 채널 모델 보고서",
      "견해: 레이더·통신 장비 이중 투자 절감"
    ],
    "sources": [
      "IEEE Std 802.11bf-2025(승인 2025.5.28)",
      "NIST 802.11bf 소개",
      "3GPP TR 38.901 Rel-19 ISAC channel model, draft TR 38.765",
      "ETSI GR ISC 002 V1.1.1(2025-08)"
    ]
  },
  "디지털 트윈 네트워크(Digital Twin Network)": {
    "concTitle": "구현 과제와 해결방안",
    "kind": "6G·AI 등 신기술",
    "form": "도형",
    "pattern": "pairs",
    "boxes": [
      {
        "label": "수집 부하",
        "role": "망 대역 소모"
      },
      {
        "label": "gNMI 텔레메트리",
        "role": "구독형 수집"
      },
      {
        "label": "모델 정확도",
        "role": "실망 괴리"
      },
      {
        "label": "GNN RouteNet",
        "role": "지연 예측"
      }
    ],
    "hi": 1,
    "gloss": "실시간 수집 부하·모델 오차 한계, 텔레메트리·GNN으로 극복 필요",
    "diff": [
      "표준: ITU-T Y.3090(2022.2) DTN 요구사항·구조, 3GPP TR 28.915(Rel-19) 네트워크 디지털 트윈 관리 연구",
      "최신 기술: OpenConfig gNMI 스트리밍 텔레메트리, GNN 기반 RouteNet 지연·지터 예측",
      "견해: 수집 주기와 트윈 정확도 간 상충 조정 필요"
    ],
    "sources": [
      "ITU-T Y.3090(2022-02) Digital twin network – Requirements and architecture",
      "3GPP TR 28.915 Study on management aspect of Network Digital Twin(Rel-19)",
      "OpenConfig gNMI Specification",
      "Rusek et al., 'RouteNet: Leveraging Graph Neural Networks for Network Modeling and Optimization in SDN', IEEE JSAC 2020"
    ]
  },
  "Hyper-AI 네트워크": {
    "concTitle": "도입 시 제언",
    "kind": "정책·전략",
    "form": "리스트",
    "items": [
      {
        "kw": "Pre-6G 시연",
        "desc": "'26 조기 기술 검증",
        "hi": false
      },
      {
        "kw": "LA 올림픽",
        "desc": "'28 6G 시범 서비스",
        "hi": true
      },
      {
        "kw": "전력 효율",
        "desc": "GPU 기지국 전력 관리",
        "hi": false
      },
      {
        "kw": "보안 내재화",
        "desc": "AI 망 공격면 관리",
        "hi": false
      }
    ],
    "gloss": "'26년 2,900억 투입, LA 올림픽 시범으로 조기 검증 필요",
    "diff": [
      "정책: 2025.12.18 과학기술관계장관회의 발표, 2026년 이행 예산 2,900억원(전년 대비 18%↑)",
      "실제 일정: 2026 프리-6G 시연, 2028 LA 올림픽 연계 6G 시범 서비스",
      "견해: GPU 기지국 전력·보안 관리 병행 필요"
    ],
    "sources": [
      "뉴시스 2025.12.17 '6G도 세계 1등… 2030년 상용화하고 표준특허 30% 확보 도전'",
      "아이뉴스24 하이퍼 AI 네트워크 전략 기사(2025.12)",
      "메트로경제 2025.12.22 AI-RAN 기사"
    ]
  },
  "비지상네트워크(NTN, Non-Terrestrial Networks)": {
    "concTitle": "적용 사례",
    "kind": "국내외 상용화가 진행 중인 기술",
    "form": "리스트",
    "items": [
      {
        "kw": "Rel-17",
        "desc": "NR NTN 첫 표준화",
        "hi": false
      },
      {
        "kw": "T-Satellite",
        "desc": "위성 직결 문자 상용",
        "hi": true
      },
      {
        "kw": "iPhone SOS",
        "desc": "위성 긴급 구조 메시지",
        "hi": false
      },
      {
        "kw": "음영 해소",
        "desc": "지상망 연동 필수",
        "hi": false
      }
    ],
    "gloss": "지상망 음영 한계, 위성 직결 상용화로 커버리지 확장",
    "diff": [
      "표준: 3GPP Release 17 에서 NR·NB-IoT NTN 첫 규격화(투명 중계), Rel-18 에서 Ka 대역·지상-위성 이동성 강화",
      "사례: T-Mobile T-Satellite(Starlink Direct to Cell) 2025-07-23 상용 개시 — 일반 스마트폰 위성 문자",
      "사례: Apple iPhone 14 위성 긴급 SOS(2022, Globalstar)",
      "견해: 위성 단독이 아닌 지상망 연동(TN-NTN)으로 음영 해소가 핵심"
    ],
    "sources": [
      "https://www.3gpp.org/specifications-technologies/releases/release-17",
      "https://techblog.comsoc.org/?p=1074975 (NTN Rel-17/18)",
      "https://www.satelliteinternet.com/resources/t-mobile-starlink-satellite-launch-date/",
      "Apple iPhone 14 Emergency SOS via satellite(2022.11, Globalstar) — 일반 지식, 웹 미확인"
    ]
  },
  "Wi-Fi 7(IEEE 802.11be)": {
    "concTitle": "표준화 동향",
    "kind": "표준·규격 기술",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "Wi-Fi 6E",
        "role": "대역 개방"
      },
      {
        "label": "Wi-Fi 7",
        "role": "MLO 도입"
      },
      {
        "label": "802.11bn",
        "role": "신뢰성 강화"
      }
    ],
    "hi": 1,
    "arrows": [
      "대역 확장",
      "UHR 진화"
    ],
    "gloss": "2024.9 IEEE 승인, MLO로 다중 대역 동시 전송",
    "diff": [
      "표준: IEEE 802.11be-2024 IEEE SA 승인 2024-09-26, 발행 2025-07-22",
      "기술: MLO(Multi-Link Operation) — 한 장치가 여러 대역·채널로 동시 송수신(2단락에 없음)",
      "국내: 과기정통부 2020-10 6GHz 대역 1.2GHz 폭 비면허 공급(미국 이어 세계 2번째)",
      "후속: 802.11bn(UHR, Wi-Fi 8)으로 속도→신뢰성 중심 전환"
    ],
    "sources": [
      "https://standards.ieee.org/ieee/802.11/7516/ (802.11be-2024, Board Approval 2024-09-26, Published 2025-07-22)",
      "https://devopedia.org/ieee-802-11be (MLO)",
      "https://m.boannews.com/html/detail.html?idx=91797 (6GHz 1.2GHz 비면허, 2020.10.15)"
    ]
  },
  "Wi-Fi 8(IEEE 802.11bn)": {
    "concTitle": "표준화 동향",
    "kind": "표준·규격 기술",
    "form": "리스트",
    "items": [
      {
        "kw": "TGbn",
        "desc": "UHR 표준 작업반",
        "hi": false
      },
      {
        "kw": "D1.0",
        "desc": "2025.7 초안 투표 승인",
        "hi": false
      },
      {
        "kw": "2028 승인",
        "desc": "IEEE 최종 승인 목표",
        "hi": true
      },
      {
        "kw": "WFA 인증",
        "desc": "2027 말 인증 예상",
        "hi": false
      }
    ],
    "gloss": "속도 경쟁 한계, UHR로 신뢰성 중심 전환·2028 표준",
    "diff": [
      "표준 일정: TGbn D1.0 생성·투표 승인 2025-07(공식 일정표), 최종 WG·SASB 승인 2028년 목표(3~5월, 일부 9월)",
      "인증: Wi-Fi Alliance 인증 2027년 말 예상(삼성 리서치)",
      "견해: 최대 속도는 Wi-Fi 7 과 같은 대역폭·변조 — 신뢰성·지연 개선이 차별점"
    ],
    "sources": [
      "https://grouper.ieee.org/groups/802/11/Reports/tgbn_update.htm",
      "https://research.samsung.com/blog/IEEE-802-11bn-Ultra-High-Reliability-UHR-Wi-Fi-8"
    ]
  },
  "Passive WiFi": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "기존 기술의 개선판",
    "form": "그래프",
    "graph": {
      "x": "전송률(Mbps)",
      "y": "소비 전력(µW)",
      "series": [
        {
          "name": "Passive Wi-Fi(UW 시제품)",
          "pts": [
            [
              1,
              14.5
            ],
            [
              11,
              59.2
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "1Mbps 14.5µW",
        "11Mbps 59.2µW",
        "기존 칩 대비 1/10,000"
      ]
    },
    "gloss": "기존 칩 대비 전력 1만분의 1, 802.11bp로 표준화",
    "diff": [
      "수치: UW NSDI 2016 — 802.11b 1Mbps 14.5µW·11Mbps 59.2µW, 기존 Wi-Fi 칩 대비 10,000배·BLE/ZigBee 대비 1,000배 낮음",
      "표준: IEEE 802.11bp(AMP, Ambient Power) — 2.4GHz 후방산란 MAC/PHY 모드 규격화 진행",
      "표준: 3GPP Release 19 Ambient IoT(무전원 IoT) 연구·규격"
    ],
    "sources": [
      "https://netlab.cs.washington.edu/?p=662",
      "https://www.usenix.org/conference/nsdi16/technical-sessions/presentation/kellogg",
      "https://mentor.ieee.org/802.11/dcn/24/11-24-1613-14-00bp-specification-framework-for-tgbp.docx",
      "https://www.3gpp.org/DynaReport/SpecVsWi--22840.htm"
    ]
  },
  "SDN(Software Defined Network)": {
    "concTitle": "적용 사례",
    "kind": "인프라·솔루션 도입",
    "form": "리스트",
    "items": [
      {
        "kw": "Google B4",
        "desc": "링크 이용률 100% 근접",
        "hi": true
      },
      {
        "kw": "AT&T",
        "desc": "2020 75% 가상화 목표",
        "hi": false
      },
      {
        "kw": "ONAP",
        "desc": "ECOMP 오픈소스화",
        "hi": false
      }
    ],
    "gloss": "WAN 저이용 한계, 중앙 TE로 링크 이용률 100% 근접",
    "diff": [
      "사례: Google B4(SIGCOMM 2013) — 데이터센터 간 WAN 에 중앙 TE 적용, 링크 이용률 100% 근접",
      "사례: AT&T Domain 2.0 — 2020년까지 네트워크 기능 75% SW 가상화 목표(2019년 65.5%)",
      "오픈소스: AT&T ECOMP 가 ONAP 으로 편입"
    ],
    "sources": [
      "https://www.cs.princeton.edu/courses/archive/fall13/cos597E/papers/b4.pdf",
      "https://www.fierce-network.com/telecom/at-t-target-for-virtualizing-75-its-network-by-2020",
      "https://www.fierce-network.com/telecom/at-t-homestretch-virtualization-goal"
    ]
  },
  "IoT Matter": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "기존 기술의 개선판",
    "form": "도형",
    "pattern": "beforeAfter",
    "boxes": [
      {
        "label": "Zigbee·Z-Wave",
        "role": "생태계 분절"
      },
      {
        "label": "Matter",
        "role": "통합 표준"
      },
      {
        "label": "Multi-Admin",
        "role": "다중 플랫폼"
      },
      {
        "label": "Matter 1.4",
        "role": "에너지 연동"
      }
    ],
    "hi": 1,
    "gloss": "생태계 분절 한계, Multi-Admin으로 다중 플랫폼 동시 제어",
    "diff": [
      "표준 단체: CSA 는 Zigbee Alliance 가 2021년 이름을 바꾼 단체",
      "버전: Matter 1.3(2024) 냉장고·로봇청소기 등 가전 추가, Matter 1.4(2024-11-07) 태양광·배터리·히트펌프·EVSE 와 Enhanced Multi-Admin",
      "견해: 한 기기를 여러 생태계(Apple·Google·Amazon·SmartThings)가 동시에 제어 — 제조사 종속 해소"
    ],
    "sources": [
      "https://csa-iot.org/newsroom/matter-1-4-enables-more-capable-smart-homes/",
      "https://www.silabs.com/blog/matter-1-4-continues-the-csas-commitment-to-unifying-the-home"
    ]
  },
  "오픈플로우(OpenFlow)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "고정 파서",
        "role": "필드 한정"
      },
      {
        "label": "P4",
        "role": "파서 정의"
      },
      {
        "label": "P4Runtime",
        "role": "엔트리 제어"
      },
      {
        "label": "ONOS",
        "role": "분산 제어"
      }
    ],
    "hi": 0,
    "gloss": "고정 파서 한계, P4로 패킷 처리까지 프로그래밍",
    "diff": [
      "한계: OpenFlow 는 버전마다 매치 필드·파서가 고정 — 새 헤더는 표준 개정 필요(긴 표준화 주기)",
      "대안: P4 로 파서·테이블을 정의, P4Runtime 은 포워딩 플레인 종류와 무관한 제어 API(ONF)",
      "공개 최신판은 OpenFlow 1.5.1(1.6 은 ONF 회원 한정)",
      "견해: 컨트롤러 단일 장애는 ONOS 같은 분산 컨트롤러로 보완"
    ],
    "sources": [
      "https://en.wikipedia.org/wiki/OpenFlow",
      "https://www.sdxcentral.com/news/the-promise-of-p4-runtime-and-how-its-propelling-the-onf/",
      "https://research.cec.sc.edu/files/cyberinfra/files/lab6_SDN.pdf"
    ]
  },
  "SD-WAN(Software Defined-Wide Area Network)": {
    "concTitle": "도입 시 제언",
    "kind": "인프라·솔루션 도입",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "MEF 70",
        "role": "표준 선정"
      },
      {
        "label": "SD-WAN",
        "role": "지점 전환"
      },
      {
        "label": "SASE",
        "role": "보안 통합"
      },
      {
        "label": "ZTNA",
        "role": "접근 검증"
      }
    ],
    "hi": 2,
    "arrows": [
      "서비스 정의",
      "WAN 통합",
      "접근 통제"
    ],
    "gloss": "MPLS 비용 한계, MEF 70 기반 전환 후 SASE로 보안 통합",
    "diff": [
      "표준: MEF 70(2019-08) 첫 SD-WAN 서비스 속성 표준, 현행 MEF 70.2(2023-10)",
      "동향: Gartner 2019 SASE 제시 — SD-WAN + SWG·CASB·FWaaS·ZTNA 클라우드 보안 통합",
      "견해: MPLS 일괄 교체보다 병행 운용 후 단계 전환"
    ],
    "sources": [
      "https://www.mplify.net/resources/mef-70-2-sd-wan-service-attributes-and-service-framework/",
      "https://techblog.comsoc.org/2022/12/29/have-we-come-full-circle-from-sd-wan-to-sase-to-sse-mefs-sd-wan-and-sase-standards-dont-address-interoperability/"
    ]
  },
  "SDR(Software Defined Radio)": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "도형",
    "pattern": "branch",
    "boxes": [
      {
        "label": "SDR",
        "role": "SW 재구성"
      },
      {
        "label": "TMMR",
        "role": "전술 무전"
      },
      {
        "label": "JTRS",
        "role": "미군 통합"
      },
      {
        "label": "GNU Radio",
        "role": "공개 개발"
      }
    ],
    "hi": 0,
    "gloss": "대역별 무전기 한계, SW 재구성으로 다대역 통합 운용",
    "diff": [
      "국내: TMMR(차기 군 무전기, ADD·LIG넥스원) — SW 로 HF·VHF·UHF 다대역 운용, 2020-04 방추위 1.2조 원 양산 승인, 2023-12 2차 양산 8,566억 원",
      "해외: 미국 JTRS 사업 — SDR 공통 SW 구조 표준화",
      "오픈소스: GNU Radio 로 SDR 신호 처리 SW 공개 개발"
    ],
    "sources": [
      "https://www.janes.com/defence-news/c4isr-command-tech/latest/lig-nex1-delivers-initial-batch-of-tmmrs-to-south-korean-military",
      "https://www.etoday.co.kr/news/view/1684565",
      "JTRS·GNU Radio — 일반 지식, 웹 미확인"
    ]
  },
  "CDN(Contents Delivery Network)": {
    "concTitle": "적용 사례",
    "kind": "인프라·솔루션 도입",
    "form": "리스트",
    "items": [
      {
        "kw": "Open Connect",
        "desc": "ISP 내장 캐시 무상",
        "hi": true
      },
      {
        "kw": "Workers",
        "desc": "엣지 서버리스 실행",
        "hi": false
      },
      {
        "kw": "멀티 CDN",
        "desc": "장애 대비 이중화",
        "hi": false
      }
    ],
    "gloss": "백본 부하 한계, Open Connect는 트래픽 95% ISP 직결",
    "diff": [
      "사례: Netflix Open Connect — 자격 ISP 에 캐시 장비(OCA) 무상 제공, 2018년 전 세계 트래픽 약 95% 를 ISP 직접 연결로 전달",
      "사례: Cloudflare Workers — CDN 엣지에서 코드 실행(엣지 컴퓨팅)",
      "견해: 단일 CDN 장애 대비 멀티 CDN 이중화 필요"
    ],
    "sources": [
      "https://openconnect.netflix.com/en/",
      "https://blog.apnic.net/2018/06/20/netflix-content-distribution-through-open-connect/",
      "Cloudflare Workers(2017 공개) — 일반 지식, 웹 미확인"
    ]
  },
  "망 중립성(Network Neutrality)": {
    "concTitle": "도입 시 제언",
    "kind": "정책·전략",
    "form": "리스트",
    "items": [
      {
        "kw": "美 FCC",
        "desc": "2025 법원 규칙 무효",
        "hi": false
      },
      {
        "kw": "서비스 안정성",
        "desc": "CP 망 품질 의무화",
        "hi": false
      },
      {
        "kw": "SKB·넷플릭스",
        "desc": "2023 소송 취하·제휴",
        "hi": false
      },
      {
        "kw": "특수 서비스",
        "desc": "슬라이싱 기준 정립",
        "hi": true
      }
    ],
    "gloss": "망 이용대가 분쟁, 5G 특수 서비스 기준 정립 필요",
    "diff": [
      "해외: 미 연방 제6항소법원 2025-01-02 FCC 2024 망 중립성 규칙 무효(정보 서비스 판단)",
      "국내: 전기통신사업법 개정 시행령 2020-12-10 시행 — 대형 CP 서비스 안정성 의무",
      "사례: SK브로드밴드·넷플릭스 2023-09-18 망 사용료 소송 상호 취하·전략적 제휴",
      "견해: 5G 네트워크 슬라이싱 등 특수 서비스와 망 중립성 경계 기준 필요"
    ],
    "sources": [
      "https://www.gibsondunn.com/sixth-circuit-strikes-down-fcc-net-neutrality-order/",
      "https://www.dailian.co.kr/news/view/941826/",
      "https://www.segye.com/view/20230918505519"
    ]
  },
  "인텐트 기반 네트워킹(Intent-Based Networking)": {
    "concTitle": "구현 과제와 해결방안",
    "kind": "6G·AI 등 신기술",
    "form": "도형",
    "pattern": "pairs",
    "boxes": [
      {
        "label": "의도 표현 상이",
        "role": "벤더 종속"
      },
      {
        "label": "TS 28.312",
        "role": "의도 모델"
      },
      {
        "label": "오설정 전파",
        "role": "장애 확산"
      },
      {
        "label": "Y.3090 DTN",
        "role": "사전 검증"
      }
    ],
    "hi": 1,
    "gloss": "용어·모델 불일치 한계, 표준 모델·디지털 트윈 검증 필요",
    "diff": [
      "표준: 3GPP TS 28.312(Rel-17, 2022) 이동망 의도 기반 관리 서비스(Intent MnS)",
      "표준: IRTF RFC 9315(2022-10) IBN 개념·용어 정의",
      "표준: ITU-T Y.3090(2022-02) 디지털 트윈 네트워크 요구사항·구조 — 적용 전 가상 검증",
      "견해: 의도 오해석이 실망에 퍼지지 않게 트윈에서 먼저 검증"
    ],
    "sources": [
      "https://www.etsi.org/deliver/etsi_ts/128300_128399/128312/17.01.01_60/ts_128312v170101p.pdf",
      "https://www.rfc-editor.org/rfc/rfc9315",
      "https://www.itu.int/rec/T-REC-Y.3090-202202-I/en"
    ]
  },
  "무선 충전 기술": {
    "concTitle": "활용 방안",
    "kind": "일반 기술",
    "form": "그래프",
    "graph": {
      "x": "SAE J2954 전력 등급",
      "y": "최대 전력(kW)",
      "series": [
        {
          "name": "전기차 무선 충전(SAE J2954)",
          "pts": [
            [
              1,
              3.7
            ],
            [
              3,
              11
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "WPT1 3.7kW",
        "WPT3 11kW"
      ]
    },
    "gloss": "단거리 한계, SAE J2954 11kW로 전기차 무선 충전",
    "diff": [
      "표준: SAE J2954(2020) 전기차 무선 충전 WPT1 3.7kW ~ WPT3 11kW(WPT2 는 7kW·7.7kW 로 출처마다 달라 뺌)",
      "표준: WPC Qi2(2023, 자석 정렬 MPP 15W) → Qi2 25W(2025, iPhone 17 지원)",
      "견해: 주차 정렬·이물질 감지가 상용화 관건"
    ],
    "sources": [
      "https://www.sae.org/site/news/2020/10/new-sae-wireless-charging-standard-is-ev-game-changer",
      "https://insideevs.com/news/450548/sae-j2954-wireless-charging-standard/",
      "https://www.chargewithqi.com/blog/what-is-qi2-25w/"
    ]
  },
  "Sliding Window & 네이글(Nagle's) 알고리즘": {
    "concTitle": "하이브리드 기술",
    "kind": "「A와 B」 두 기법",
    "form": "도형",
    "pattern": "hybrid",
    "boxes": [
      {
        "label": "Sliding Window",
        "role": "수신측 조절"
      },
      {
        "label": "네이글",
        "role": "송신측 축적"
      },
      {
        "label": "SWS 회피",
        "role": "양측 결합"
      },
      {
        "label": "QUIC 흐름제어",
        "role": "스트림 단위"
      }
    ],
    "hi": 2,
    "gloss": "Delayed ACK 겹침 최대 500ms 지연, NODELAY로 해소",
    "diff": [
      "표준: RFC 1122 SWS 회피 — 수신측(Clark, RFC 813)·송신측(Nagle, RFC 896) 결합",
      "수치: Delayed ACK 상한 500ms — Nagle 과 겹치면 교착성 지연, 대화형 앱은 TCP_NODELAY",
      "차세대: QUIC(RFC 9000) 크레딧 기반 스트림·연결 흐름제어"
    ],
    "sources": [
      "https://u20.freesoft.org/CIE/RFC/1122/100.htm",
      "https://courses.cs.washington.edu/courses/cse461/06wi/Lectures/L12-silliness/l12.pdf",
      "https://ftp.u-strasbg.fr/rfc/rfc813.txt"
    ]
  },
  "BGP(Border Gateway Protocol)": {
    "concTitle": "문제점과 해결방안",
    "kind": "프로토콜 동작·주소 체계",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "경로 하이재킹",
        "role": "출처 위조"
      },
      {
        "label": "RPKI ROV",
        "role": "출처 검증"
      },
      {
        "label": "ASPA",
        "role": "공급자 검증"
      },
      {
        "label": "BGPsec",
        "role": "홉 서명"
      }
    ],
    "hi": 0,
    "gloss": "하이재킹 위험, RPKI ROV로 경로 절반 이상 출처 보호",
    "diff": [
      "사고: 2008-02 Pakistan Telecom 의 YouTube 경로 하이재킹, 2021-10-04 Facebook 경로 철회로 약 6~7시간 장애",
      "표준: RFC 6811 출처 검증(Valid/Invalid/NotFound) — ROA 로 IPv4·IPv6 경로 절반 이상 보호",
      "후속: ASPA(공급자 관계 검증, IETF draft)·BGPsec(RFC 8205, 채택 미미)"
    ],
    "sources": [
      "https://www.noction.com/blog/aspa-rpki-cryptographic-upgrade-for-bgp-path-security",
      "https://www.sidn.nl/en/news-and-blogs/adoption-of-rpki-rov-security-protocol-progressing-very-quickly",
      "https://www.thousandeyes.com/blog/facebook-outage-analysis",
      "Pakistan Telecom 2008 — 일반 지식, 웹 미확인"
    ]
  },
  "IPv6": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "기존 기술의 개선판",
    "form": "도형",
    "pattern": "beforeAfter",
    "boxes": [
      {
        "label": "IPv4·NAT",
        "role": "주소 고갈"
      },
      {
        "label": "IPv6",
        "role": "주소 확장"
      },
      {
        "label": "SRv6",
        "role": "경로 제어"
      },
      {
        "label": "IPv6-only",
        "role": "단일 스택"
      }
    ],
    "hi": 1,
    "gloss": "NAT 의존 한계, Google 접속 IPv6 첫 과반 50.1%",
    "diff": [
      "수치: Google 접속 IPv6 비율 9.10%(2015-12) → 49.56%(2025-06) → 50.10%(2026-03) 첫 과반",
      "표준: SRv6 Network Programming RFC 8986 — 라우팅 확장 헤더로 경로 프로그래밍",
      "견해: 듀얼 스택 운영 부담 → IPv6-only + 464XLAT(RFC 6877) 전환"
    ],
    "sources": [
      "https://pulse.internetsociety.org/blog/18-years-later-ipv6-reaches-majority",
      "https://www.datacenterknowledge.com/business/ipv6-adoption-grows-to-10-percent-as-internet-protocol-turns-20",
      "RFC 8986·RFC 6877 — 일반 지식"
    ]
  },
  "선형 자료구조와 비선형 자료구조": {
    "concTitle": "하이브리드 기술",
    "kind": "「A와 B」 두 기법",
    "form": "도형",
    "pattern": "hybrid",
    "boxes": [
      {
        "label": "선형 자료구조",
        "role": "배열 버킷"
      },
      {
        "label": "비선형 자료구조",
        "role": "균형 트리"
      },
      {
        "label": "Java HashMap",
        "role": "충돌 체인"
      },
      {
        "label": "TREEIFY 8",
        "role": "트리 전환"
      }
    ],
    "hi": 2,
    "gloss": "체인 8개 이상 시 트리 전환, 최악 탐색 O(n)→O(log n)",
    "diff": [
      "실제 적용: Java 8 HashMap — 버킷 연결 리스트(선형)가 8개 이상이면 레드블랙 트리(비선형)로 전환(TREEIFY_THRESHOLD=8, UNTREEIFY_THRESHOLD=6, 테이블 64 이상)",
      "정량 수치: 충돌 버킷 최악 탐색 O(n) → O(log n)",
      "견해: 선형·비선형 결합이 실무 자료구조의 기본형"
    ],
    "sources": [
      "OpenJDK java.util.HashMap 소스(TREEIFY_THRESHOLD·UNTREEIFY_THRESHOLD·MIN_TREEIFY_CAPACITY)",
      "JEP 180: Handle Frequent HashMap Collisions with Balanced Trees (JDK 8)"
    ]
  },
  "링크드 리스트(Linked List)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "탐색 O(n)",
        "role": "순차 추적"
      },
      {
        "label": "Skip List",
        "role": "다층 색인"
      },
      {
        "label": "Unrolled List",
        "role": "캐시 지역성"
      },
      {
        "label": "LinkedHashMap",
        "role": "해시 색인"
      }
    ],
    "hi": 1,
    "gloss": "탐색 O(n) 한계, Skip List 색인으로 기대 O(log n)",
    "diff": [
      "최신 기술: Skip List(W. Pugh, CACM 1990) — 다층 연결 리스트로 기대 탐색 O(log n)",
      "실제 적용: Redis Sorted Set(ZSET)이 skiplist + 해시 테이블로 구현",
      "실제 적용: Java LinkedHashMap — 해시 색인 + 이중 연결 리스트로 O(1) 조회·LRU 순서 유지",
      "견해: 노드당 여러 원소를 담는 Unrolled List 로 포인터 추적·캐시 미스 완화"
    ],
    "sources": [
      "W. Pugh, Skip Lists: A Probabilistic Alternative to Balanced Trees, CACM 33(6), 1990",
      "Redis 소스 t_zset.c(zskiplist) / Redis Sorted Set 문서",
      "Java SE API LinkedHashMap Javadoc(removeEldestEntry, access-order)"
    ]
  },
  "Stack": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "beforeAfter",
    "boxes": [
      {
        "label": "레지스터 VM",
        "role": "주소 명시"
      },
      {
        "label": "Stack",
        "role": "0-주소 명령"
      },
      {
        "label": "WebAssembly",
        "role": "이식성 코드"
      },
      {
        "label": "JVM",
        "role": "연산 스택"
      }
    ],
    "hi": 1,
    "gloss": "0-주소 명령으로 주소 생략, WebAssembly·JVM 실행 기반",
    "diff": [
      "최신 표준: WebAssembly 명세(W3C 권고 2019)가 스택 머신 실행 모델 채택",
      "실제 적용: JVM 명세 — 프레임마다 operand stack 으로 바이트코드 실행",
      "실제 적용: Java Stack 클래스(Vector 상속) 대신 Deque/ArrayDeque 사용 권장(Javadoc)",
      "견해: 레지스터 VM 대비 명령이 단순해 이식·검증 용이"
    ],
    "sources": [
      "W3C WebAssembly Core Specification 1.0 (Recommendation, 2019-12-05) — Execution: stack machine",
      "The Java Virtual Machine Specification §2.6.2 Operand Stacks",
      "Java SE API java.util.Stack Javadoc(Deque 사용 권장)"
    ]
  },
  "Queue": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "Michael-Scott",
        "desc": "CAS 무잠금 연결 큐",
        "hi": true
      },
      {
        "kw": "LMAX Disruptor",
        "desc": "사전 할당 링 버퍼",
        "hi": false
      },
      {
        "kw": "Linux kfifo",
        "desc": "SPSC 무잠금 버퍼",
        "hi": false
      }
    ],
    "gloss": "다중 스레드 락 경합 한계, CAS 무잠금 큐로 처리량 확보",
    "diff": [
      "최신 기술: Michael-Scott 무잠금 큐(PODC 1996) — Java ConcurrentLinkedQueue 의 기반 알고리즘",
      "실제 적용: LMAX Disruptor — 미리 할당한 링 버퍼로 스레드 간 메시지 전달",
      "실제 적용: Linux kfifo — 단일 생산자·단일 소비자면 잠금 없이 사용, 크기 2의 거듭제곱",
      "견해: 다중 스레드 환경은 락 경합이 병목, CAS 기반 무잠금 큐로 극복 필요"
    ],
    "sources": [
      "M. Michael, M. Scott, Simple, Fast, and Practical Non-Blocking and Blocking Concurrent Queue Algorithms, PODC 1996",
      "Java SE API ConcurrentLinkedQueue Javadoc(Michael & Scott 알고리즘 기반 명시)",
      "LMAX Disruptor 기술 문서(Ring Buffer, pre-allocation)",
      "Linux kernel include/linux/kfifo.h 주석(one reader/one writer 잠금 불요, power of 2)"
    ]
  },
  "이진 탐색 트리(Binary Search Tree)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "노드 수 n",
      "y": "트리 높이",
      "series": [
        {
          "name": "편향 BST",
          "pts": [
            [
              1,
              1
            ],
            [
              15,
              15
            ],
            [
              31,
              31
            ],
            [
              63,
              63
            ],
            [
              127,
              127
            ]
          ]
        },
        {
          "name": "균형 트리",
          "pts": [
            [
              1,
              1
            ],
            [
              15,
              4
            ],
            [
              31,
              5
            ],
            [
              63,
              6
            ],
            [
              127,
              7
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "n=127 편향 높이 127",
        "균형 높이 7"
      ]
    },
    "gloss": "정렬 입력 시 편향 한계, Red-Black 균형으로 O(log n)",
    "diff": [
      "정량 수치: 정렬된 키 순서 삽입 시 높이 n(연결 리스트화), 완전 균형 시 ⌈log₂(n+1)⌉ — n=127 이면 127 대 7",
      "실제 적용: Red-Black Tree — Java TreeMap, Linux CFS 스케줄러 실행 큐(rbtree)",
      "견해: 삽입 순서에 성능이 좌우되는 한계, 자가 균형 트리로 극복 필요"
    ],
    "sources": [
      "수학적 계산(완전 이진 트리 높이 ⌈log₂(n+1)⌉)",
      "Java SE API TreeMap Javadoc(Red-Black tree 기반 명시)",
      "Linux kernel Documentation/scheduler/sched-design-CFS.rst(time-ordered rbtree)"
    ]
  },
  "AVL 트리": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "높이 상한",
        "desc": "1.44 log₂n 이하",
        "hi": true
      },
      {
        "kw": "Red-Black",
        "desc": "높이 2log₂n 이하",
        "hi": false
      },
      {
        "kw": "삭제 회전",
        "desc": "AVL O(log n)·RB 3회",
        "hi": false
      }
    ],
    "gloss": "높이 1.44log₂n 조회 우위, 삭제 회전 많아 갱신 위주는 RB",
    "diff": [
      "정량 수치: AVL 높이 < 1.4405·log₂(n+2) − 0.3277 (Knuth)",
      "정량 수치: Red-Black 높이 ≤ 2·log₂(n+1) — AVL 이 탐색 경로 짧음",
      "정량 수치: 삭제 시 RB 회전 최대 3회, AVL 은 최대 O(log n)회",
      "견해: 조회 위주는 AVL, 갱신 위주는 Red-Black 선택"
    ],
    "sources": [
      "D. Knuth, TAOCP Vol.3 §6.2.3 Balanced Trees",
      "Cormen et al., Introduction to Algorithms(CLRS) Lemma 13.1, §13.3~13.4"
    ]
  },
  "힙(Heap)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "Binary Heap",
        "desc": "병합 O(n) 한계",
        "hi": false
      },
      {
        "kw": "Fibonacci Heap",
        "desc": "키 감소 O(1)",
        "hi": true
      },
      {
        "kw": "Pairing Heap",
        "desc": "병합 O(1) 실용",
        "hi": false
      }
    ],
    "gloss": "이진 힙 키 감소 한계, 피보나치 힙 Dijkstra O(E+VlogV)",
    "diff": [
      "최신 기술: Fibonacci Heap(Fredman·Tarjan, JACM 1987) — 키 감소 분할상환 O(1)",
      "정량 수치: Dijkstra 최단 경로 O((V+E)logV) → O(E + V log V)",
      "실제 적용: Python heapq·Java PriorityQueue 는 이진 최소 힙",
      "견해: 피보나치 힙은 상수가 커 실무는 Pairing Heap 병행 검토"
    ],
    "sources": [
      "M. Fredman, R. Tarjan, Fibonacci heaps and their uses in improved network optimization algorithms, JACM 34(3), 1987",
      "Fredman, Sedgewick, Sleator, Tarjan, The pairing heap, Algorithmica 1986",
      "Python heapq 문서 / Java SE API PriorityQueue Javadoc(priority heap)"
    ]
  },
  "B-Tree(Balanced Tree)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "임의 쓰기 I/O",
        "role": "쓰기 병목"
      },
      {
        "label": "LSM-Tree",
        "role": "순차 쓰기"
      },
      {
        "label": "Bw-Tree",
        "role": "무잠금 갱신"
      },
      {
        "label": "RocksDB",
        "role": "LSM 엔진"
      }
    ],
    "hi": 1,
    "gloss": "제자리 갱신 임의 쓰기 한계, LSM-Tree 순차 쓰기로 처리량 확보",
    "diff": [
      "실제 적용: MySQL InnoDB 인덱스 = B+Tree, 기본 페이지 16KB",
      "최신 기술: LSM-Tree(O'Neil 등 1996) — RocksDB·Cassandra 가 쓰기 위주 저장 엔진으로 채택",
      "최신 기술: Bw-Tree — SQL Server Hekaton 의 무잠금(latch-free) B-tree, CAS·델타 갱신",
      "견해: 쓰기 위주 부하는 B-Tree 제자리 갱신이 병목, LSM 계열로 보완 필요"
    ],
    "sources": [
      "MySQL 8.0 Reference Manual — InnoDB 인덱스 물리 구조(B-tree), innodb_page_size 기본 16KB",
      "P. O'Neil et al., The Log-Structured Merge-Tree (LSM-Tree), Acta Informatica 33, 1996",
      "RocksDB 문서(LSM 기반 key-value 엔진)",
      "Lomet, Levandoski et al., Indexing on Modern Hardware: Hekaton and Beyond, SIGMOD 2014"
    ]
  },
  "방향성 비순환 그래프(DAG, Directed Acyclic Graph)": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "Apache Spark",
        "desc": "MapReduce 2단계 탈피",
        "hi": true
      },
      {
        "kw": "Airflow",
        "desc": "작업 의존 DAG 정의",
        "hi": false
      },
      {
        "kw": "IOTA Tangle",
        "desc": "블록 대신 DAG 원장",
        "hi": false
      }
    ],
    "gloss": "Map·Reduce 2단계 한계, DAG 다단계 실행으로 파이프라인화",
    "diff": [
      "실제 적용: Apache Spark DAGScheduler — 작업을 Stage DAG 로 나눠 메모리 파이프라인 실행",
      "실제 적용: Apache Airflow — 워크플로를 작업 의존 DAG 로 정의·스케줄",
      "최신 기술: IOTA Tangle — 블록 체인 대신 새 거래가 이전 거래 2건을 승인하는 DAG 원장",
      "견해: 선형 체인·2단계 고정 구조 대비 병렬 처리 여지 확대"
    ],
    "sources": [
      "M. Zaharia et al., Resilient Distributed Datasets, NSDI 2012 / Spark DAGScheduler 문서",
      "Apache Airflow 문서 Core Concepts — DAGs",
      "S. Popov, The Tangle (IOTA 백서)"
    ]
  },
  "알고리즘 성능평가": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "삽입 횟수 n",
      "y": "누적 복사 수",
      "series": [
        {
          "name": "1칸씩 확장",
          "pts": [
            [
              1,
              0
            ],
            [
              8,
              28
            ],
            [
              16,
              120
            ],
            [
              32,
              496
            ],
            [
              64,
              2016
            ]
          ]
        },
        {
          "name": "2배 확장",
          "pts": [
            [
              1,
              0
            ],
            [
              8,
              7
            ],
            [
              16,
              15
            ],
            [
              32,
              31
            ],
            [
              64,
              63
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "n=64 1칸씩 2,016회",
        "2배 확장 63회"
      ]
    },
    "gloss": "한 번의 최악만 보는 과대평가 한계, 분할상환 분석으로 O(1) 입증",
    "diff": [
      "최신 기법: 분할상환 분석(Tarjan, 1985) — 연산열 전체 비용의 평균으로 평가",
      "정량 수치: 동적 배열 64회 삽입 시 누적 복사 1칸씩 확장 n(n−1)/2=2,016회 vs 2배 확장 63회(<n)",
      "실제 적용: Java ArrayList 용량 1.5배 확장(oldCapacity >> 1) → add 분할상환 O(1)",
      "견해: 점근 분석에 실측(JMH 등 예열 반영 벤치마크) 병행 필요"
    ],
    "sources": [
      "R. Tarjan, Amortized Computational Complexity, SIAM J. Algebraic Discrete Methods 6(2), 1985",
      "수학적 계산(Σ(i−1)=n(n−1)/2, 1+2+…+32=63)",
      "OpenJDK java.util.ArrayList 소스(grow: oldCapacity >> 1) / ArrayList Javadoc(amortized constant time)"
    ]
  },
  "빅오 표기법(O-Notation)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "행렬 크기 n",
      "y": "곱셈 횟수",
      "series": [
        {
          "name": "일반 곱 n³",
          "pts": [
            [
              2,
              8
            ],
            [
              4,
              64
            ],
            [
              8,
              512
            ],
            [
              16,
              4096
            ],
            [
              32,
              32768
            ]
          ]
        },
        {
          "name": "Strassen",
          "pts": [
            [
              2,
              7
            ],
            [
              4,
              49
            ],
            [
              8,
              343
            ],
            [
              16,
              2401
            ],
            [
              32,
              16807
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "n=32 n³ 32,768회",
        "Strassen 16,807회"
      ]
    },
    "gloss": "O(n³) 한계, Strassen 7회 곱으로 O(n^2.81) 단축",
    "diff": [
      "최신 기법: Strassen(1969) — 2×2 블록 곱 8회 → 7회, O(n^log₂7) ≈ O(n^2.807)",
      "정량 수치: n=32 완전 재귀 시 스칼라 곱 32,768회 → 16,807회(7^5)",
      "견해: 빅오가 낮아도 상수 계수가 커 작은 n 에선 일반 곱이 유리, 빅오와 실측 병행 필요"
    ],
    "sources": [
      "V. Strassen, Gaussian Elimination is not Optimal, Numerische Mathematik 13, 1969",
      "수학적 계산(n=2^k 일 때 일반 곱 8^k, Strassen 7^k)"
    ]
  },
  "퀵 정렬(Quick Sort)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "정렬된 입력",
        "role": "분할 불균형"
      },
      {
        "label": "Introsort",
        "role": "힙정렬 전환"
      },
      {
        "label": "Dual-Pivot",
        "role": "3구간 분할"
      },
      {
        "label": "pdqsort",
        "role": "패턴 회피"
      }
    ],
    "hi": 1,
    "gloss": "Pivot 편향 한계, Introsort로 최악 O(n log n) 보장",
    "diff": [
      "실제 적용: C++ std::sort — Introsort(Musser 1997), 재귀 깊이 초과 시 힙 정렬 전환, C++11 부터 최악 O(N log N) 비교 요구",
      "실제 적용: Java 7 Arrays.sort(기본형) — Yaroslavskiy Dual-Pivot Quicksort",
      "실제 적용: Go 1.19 sort 패키지 — pattern-defeating quicksort(pdqsort)",
      "견해: 순수 퀵 정렬 대신 하이브리드로 최악 O(n²) 차단 필요"
    ],
    "sources": [
      "D. Musser, Introspective Sorting and Selection Algorithms, Software: Practice and Experience 27(8), 1997",
      "ISO/IEC 14882:2011 [alg.sort] Complexity: O(N log N) comparisons",
      "Java SE 7 API Arrays.sort(int[]) Javadoc(Dual-Pivot Quicksort by Yaroslavskiy, Bentley, Bloch)",
      "Go 1.19 Release Notes — sort: pattern-defeating quicksort / golang/go issue #50154"
    ]
  },
  "삽입 정렬(Insertion Sort)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "hybrid",
    "boxes": [
      {
        "label": "삽입 정렬",
        "role": "짧은 run"
      },
      {
        "label": "병합 정렬",
        "role": "run 병합"
      },
      {
        "label": "Timsort",
        "role": "적응형 정렬"
      },
      {
        "label": "Python·Java",
        "role": "표준 정렬"
      }
    ],
    "hi": 2,
    "gloss": "O(n²) 한계, 짧은 run 삽입·병합 결합한 Timsort로 극복",
    "diff": [
      "실제 적용: Timsort(Tim Peters 2002, Python 2.3) — minrun(32~64) 미만 run 은 이진 삽입 정렬, 이후 병합",
      "실제 적용: Java 7 Arrays.sort(Object[]) TimSort, V8 7.0/Chrome 70 Array.prototype.sort 도 Timsort",
      "정량 수치: 거의 정렬된 입력에서 삽입 정렬 O(n)",
      "견해: 소규모·부분 정렬 데이터는 삽입 정렬이 유리, 하이브리드로 대규모 보완"
    ],
    "sources": [
      "CPython Objects/listsort.txt(Tim Peters, minrun·binary insertion sort)",
      "Java SE 7 API Arrays.sort(Object[]) Javadoc(TimSort)",
      "v8.dev/blog/array-sort — Getting things sorted in V8 (Timsort, V8 v7.0 / Chrome 70)"
    ]
  },
  "버블 정렬(Bubble Sort)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "원소 수 n",
      "y": "비교 횟수",
      "series": [
        {
          "name": "버블 n(n−1)/2",
          "pts": [
            [
              10,
              45
            ],
            [
              20,
              190
            ],
            [
              40,
              780
            ],
            [
              80,
              3160
            ]
          ]
        },
        {
          "name": "n log₂n",
          "pts": [
            [
              10,
              33
            ],
            [
              20,
              86
            ],
            [
              40,
              213
            ],
            [
              80,
              506
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "n=80 버블 3,160회",
        "n log₂n 약 506회"
      ]
    },
    "gloss": "O(n²) 인접 교환 한계, 조기 종료·Comb Sort로 개선",
    "diff": [
      "정량 수치: 버블 비교 n(n−1)/2 — n=80 에서 3,160회 vs n log₂n ≈ 506회",
      "개선 기법: 교환 없는 회차에서 조기 종료 시 정렬된 입력 n−1회 비교",
      "최신 기법: Comb Sort(Lacey·Box, BYTE 1991) — 간격을 1.3 배씩 줄여 거북이 값 해소",
      "견해: 비교 정렬 하한 Ω(n log n) 대비 비효율, 교육·소규모 용도로 한정"
    ],
    "sources": [
      "수학적 계산(Σ(n−i)=n(n−1)/2, n·log₂n)",
      "D. Knuth, TAOCP Vol.3 §5.2.2(버블 정렬 분석), §5.3.1(비교 정렬 하한)",
      "S. Lacey, R. Box, A Fast, Easy Sort, BYTE 16(4), 1991 (shrink factor 1.3)"
    ]
  },
  "병합 정렬(Merge Sort)": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "데이터 수 n",
      "y": "최악 비교 횟수",
      "series": [
        {
          "name": "퀵 정렬 최악 n(n-1)/2",
          "pts": [
            [
              10,
              45
            ],
            [
              100,
              4950
            ],
            [
              1000,
              499500
            ]
          ]
        },
        {
          "name": "병합 정렬 최악",
          "pts": [
            [
              10,
              25
            ],
            [
              100,
              573
            ],
            [
              1000,
              8977
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "n=1000 퀵 499,500회",
        "병합 8,977회"
      ]
    },
    "gloss": "퀵 최악 n² 한계, 병합은 n log n 보장해 Timsort 토대",
    "diff": [
      "정량 수치: n=1000 최악 비교 횟수 퀵 정렬 499,500회 vs 병합 정렬 8,977회(n⌈lg n⌉−2^⌈lg n⌉+1, 직접 계산)",
      "실제 적용: 병합+삽입 하이브리드 Timsort 가 Python 2.3(2002)·Java 7 객체 정렬(Arrays.sort(Object[])) 표준",
      "견해: 안정 정렬·순차 접근이라 메모리 초과 대용량의 외부 정렬에 유리"
    ],
    "sources": [
      "Knuth, TAOCP Vol.3 §5.2.4 (병합 정렬 최악 비교 횟수)",
      "CPython Objects/listsort.txt (Tim Peters, Timsort)",
      "Java SE 7 API java.util.Arrays.sort(Object[]) — Tim Peters list sort 기반 안정 적응형 병합 정렬"
    ]
  },
  "해시 테이블": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "버킷 편중",
        "role": "O(n) 탐색"
      },
      {
        "label": "트리화 버킷",
        "role": "로그 탐색"
      },
      {
        "label": "SipHash",
        "role": "DoS 방어"
      },
      {
        "label": "동적 리사이징",
        "role": "적재율 유지"
      }
    ],
    "hi": 0,
    "gloss": "편중 시 O(n) 저하, 트리화·SipHash로 HashDoS 방어",
    "diff": [
      "최신 기술: Java 8 HashMap 은 한 버킷 노드 8개(TREEIFY_THRESHOLD, 테이블 64 이상) 도달 시 레드블랙 트리로 전환(JEP 180), 적재율 0.75 초과 시 2배 리사이징",
      "실제 사례: 2011년 28C3 HashDoS 공개 후 Python 3.4 가 SipHash 채택(PEP 456), Rust 기본 해셔도 SipHash"
    ],
    "sources": [
      "JEP 180: Handle Frequent HashMap Collisions with Balanced Trees",
      "OpenJDK java.util.HashMap (TREEIFY_THRESHOLD=8, DEFAULT_LOAD_FACTOR=0.75)",
      "PEP 456 – Secure and interchangeable hash algorithm",
      "Klink & Wälde, Efficient Denial of Service Attacks on Web Application Platforms, 28C3 (2011)"
    ]
  },
  "해싱과 충돌해결방법": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "일관성 해싱",
        "desc": "노드 증감 K/N 재배치",
        "hi": true
      },
      {
        "kw": "Swiss Table",
        "desc": "SIMD 메타 일괄 탐색",
        "hi": false
      },
      {
        "kw": "Cuckoo 해싱",
        "desc": "최악 O(1) 조회",
        "hi": false
      }
    ],
    "gloss": "mod N 분산은 전체 재배치 한계, 일관성 해싱은 K/N만 이동",
    "diff": [
      "정량: 일관성 해싱(Karger 1997)은 노드 증감 시 평균 K/N 키만 재배치 — Amazon Dynamo(2007)가 가상 노드와 함께 적용",
      "최신 기술: Swiss Table(Google Abseil, 2017) — 16슬롯 그룹 제어 바이트를 SIMD 로 한 번에 비교, Rust 1.36(2019)부터 std HashMap(hashbrown) 채택",
      "Cuckoo 해싱(Pagh·Rodler 2001) — 두 해시 함수로 최악 O(1) 조회 보장"
    ],
    "sources": [
      "Karger et al., Consistent Hashing and Random Trees, STOC 1997",
      "DeCandia et al., Dynamo: Amazon's Highly Available Key-value Store, SOSP 2007",
      "Abseil 'Swiss Tables Design Notes' / CppCon 2017 (M. Kulukundis)",
      "Rust 1.36.0 release notes (hashbrown 기반 HashMap)",
      "Pagh & Rodler, Cuckoo Hashing, ESA 2001"
    ]
  },
  "동적 계획법(Dynamic Programming)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "pairs",
    "boxes": [
      {
        "label": "상태 공간 폭발",
        "role": "차원의 저주"
      },
      {
        "label": "근사 DP·강화학습",
        "role": "가치 근사"
      },
      {
        "label": "O(nm) 테이블",
        "role": "메모리 과다"
      },
      {
        "label": "Hirschberg",
        "role": "선형 공간"
      }
    ],
    "hi": 1,
    "gloss": "상태 폭발·메모리 한계, 강화학습 근사·Hirschberg 선형 공간",
    "diff": [
      "Bellman(1957)이 '차원의 저주'로 상태 공간 폭발 한계 제시 → 벨만 방정식 기반 Q-learning(Watkins 1989) 등 강화학습이 가치 함수 근사로 극복",
      "Hirschberg(1975) — LCS·서열 정렬 DP 의 O(nm) 메모리를 선형 공간으로 축소",
      "적용 사례: 편집 거리·Viterbi 복호·RIP 거리 벡터(벨만-포드)"
    ],
    "sources": [
      "R. Bellman, Dynamic Programming, Princeton Univ. Press, 1957",
      "D. S. Hirschberg, A linear space algorithm for computing maximal common subsequences, CACM 18(6), 1975",
      "C. Watkins, Learning from Delayed Rewards, PhD thesis, 1989",
      "RFC 2453 RIP Version 2"
    ]
  },
  "그리디(탐욕) 알고리즘": {
    "concTitle": "기존 기술 대비 차별점",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "beforeAfter",
    "boxes": [
      {
        "label": "완전 탐색",
        "role": "지수 시간"
      },
      {
        "label": "그리디",
        "role": "순간 최적"
      },
      {
        "label": "매트로이드",
        "role": "최적 보장"
      },
      {
        "label": "집합 덮개",
        "role": "ln n 근사"
      }
    ],
    "hi": 1,
    "gloss": "매트로이드 구조면 최적 보장, 아니면 ln n배 근사로 활용",
    "diff": [
      "이론: Rado·Edmonds 정리 — 매트로이드 구조 문제에서 그리디가 항상 최적(크루스칼 MST 가 대표)",
      "정량: 집합 덮개 문제 그리디 근사비 H(n) ≤ ln n + 1 (Johnson 1974, Chvátal 1979)",
      "견해: 탐욕 선택 속성·최적 부분 구조 확인 후 적용, 아니면 DP 로 전환"
    ],
    "sources": [
      "J. Edmonds, Matroids and the greedy algorithm, Math. Programming 1, 1971",
      "V. Chvátal, A greedy heuristic for the set-covering problem, Math. of OR 4(3), 1979",
      "CLRS 3판 16장 (Greedy Algorithms, 16.4 Matroids)"
    ]
  },
  "허프만(Huffman) 코딩": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "2기호 우세 확률 p",
      "y": "기호당 비트",
      "series": [
        {
          "name": "허프만",
          "pts": [
            [
              0.5,
              1
            ],
            [
              0.7,
              1
            ],
            [
              0.9,
              1
            ],
            [
              0.99,
              1
            ]
          ]
        },
        {
          "name": "엔트로피(산술·ANS 도달 한계)",
          "pts": [
            [
              0.5,
              1
            ],
            [
              0.7,
              0.881
            ],
            [
              0.9,
              0.469
            ],
            [
              0.99,
              0.081
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "p=0.9 허프만 1bit",
        "엔트로피 0.47bit"
      ]
    },
    "gloss": "정수 비트 한계로 p=0.9에서 2배 낭비, 산술·ANS로 극복",
    "diff": [
      "정량: 2기호 p=0.9 엔트로피 0.469bit/기호인데 허프만은 최소 1bit(약 2.1배) — H(p)=−p·log₂p−(1−p)·log₂(1−p) 직접 계산",
      "최신 기술: H.264 CABAC·HEVC(CABAC 단독)는 산술 부호화로 대체, Zstandard(RFC 8878)는 리터럴 허프만 + 시퀀스 FSE(tANS) 병행"
    ],
    "sources": [
      "C. E. Shannon, A Mathematical Theory of Communication, 1948",
      "ITU-T H.264 / H.265 (엔트로피 부호화 CABAC)",
      "RFC 8878 Zstandard Compression (Huffman literals, FSE)",
      "J. Duda, Asymmetric numeral systems, arXiv:1311.2540"
    ]
  },
  "런랭스(Run Length) 코딩": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "변화 잦은 데이터",
        "role": "크기 팽창"
      },
      {
        "label": "PackBits",
        "role": "리터럴 구분"
      },
      {
        "label": "팩스 MH 부호화",
        "role": "허프만 결합"
      },
      {
        "label": "JPEG AC 계수",
        "role": "0 런 축약"
      }
    ],
    "hi": 0,
    "gloss": "변화 잦으면 팽창, 팩스 T.4·JPEG는 허프만 결합으로 보완",
    "diff": [
      "표준: ITU-T T.4 Group 3 팩스 MH(Modified Huffman) = 흑백 런 길이 + 허프만 부호",
      "실제 적용: JPEG(ITU-T T.81)는 지그재그 스캔 후 0 계수 런 길이 + 허프만, TIFF PackBits 는 헤더 바이트로 반복·리터럴 구간 구분, BMP BI_RLE8/RLE4"
    ],
    "sources": [
      "ITU-T T.4 (Group 3 facsimile, Modified Huffman)",
      "ITU-T T.81 | ISO/IEC 10918-1 (JPEG)",
      "TIFF Revision 6.0 Section 9 PackBits Compression",
      "Microsoft BITMAPINFOHEADER (BI_RLE8, BI_RLE4)"
    ]
  },
  "다익스트라(Dijkstra) 알고리즘": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "음수 가중치",
        "desc": "벨만-포드 대체",
        "hi": false
      },
      {
        "kw": "대규모 지도",
        "desc": "A* 휴리스틱 탐색",
        "hi": true
      },
      {
        "kw": "힙 연산",
        "desc": "피보나치 힙 적용",
        "hi": false
      }
    ],
    "gloss": "OSPF(RFC 2328) 핵심, 음수·대규모는 벨만-포드·A* 보완",
    "diff": [
      "실제 적용: OSPF(RFC 2328 16장)·IS-IS 라우터가 링크 상태 DB 로 최단 경로 트리 계산",
      "정량: 피보나치 힙 사용 시 O(E + V log V)(Fredman·Tarjan 1987)",
      "A*(Hart·Nilsson·Raphael 1968) — 허용 휴리스틱으로 탐색 노드 축소, 최단 경로 유지"
    ],
    "sources": [
      "RFC 2328 OSPF Version 2, Section 16",
      "ISO/IEC 10589 (IS-IS)",
      "Fredman & Tarjan, Fibonacci heaps, JACM 34(3), 1987",
      "Hart, Nilsson & Raphael, IEEE Trans. SSC 4(2), 1968"
    ]
  },
  "TF-IDF(Term Frequency - Inverse Document Frequency)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "그래프",
    "graph": {
      "x": "문서 내 단어 빈도 tf",
      "y": "TF 가중치",
      "series": [
        {
          "name": "TF 선형",
          "pts": [
            [
              1,
              1
            ],
            [
              2,
              2
            ],
            [
              5,
              5
            ],
            [
              10,
              10
            ],
            [
              20,
              20
            ]
          ]
        },
        {
          "name": "BM25 포화(k1=1.2, 평균 길이)",
          "pts": [
            [
              1,
              1.0
            ],
            [
              2,
              1.375
            ],
            [
              5,
              1.774
            ],
            [
              10,
              1.964
            ],
            [
              20,
              2.075
            ]
          ],
          "hi": true
        }
      ],
      "labels": [
        "tf=20 선형 20",
        "BM25 2.08 포화"
      ]
    },
    "gloss": "TF 선형 증가 한계, BM25는 k1=1.2 포화로 검색 표준",
    "diff": [
      "최신 기술: BM25(Okapi) — tf 포화 k1=1.2·문서 길이 정규화 b=0.75, Lucene 6·Elasticsearch 5.0 기본 유사도(BM25 값은 tf·2.2/(tf+1.2) 직접 계산)",
      "견해: 동의어·의미 미반영 한계는 임베딩 벡터 검색과 BM25 를 섞은 하이브리드 검색으로 보완 필요"
    ],
    "sources": [
      "Robertson & Zaragoza, The Probabilistic Relevance Framework: BM25 and Beyond, 2009",
      "Apache Lucene BM25Similarity (k1=1.2, b=0.75 기본값)",
      "Elasticsearch 5.0 — 기본 유사도 BM25 전환(2016)"
    ]
  },
  "최소 신장 트리(MST, Minimum Spanning Tree)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "순차 처리",
        "desc": "Borůvka 병렬 병합",
        "hi": true
      },
      {
        "kw": "NP-hard TSP",
        "desc": "MST 기반 1.5배 근사",
        "hi": false
      },
      {
        "kw": "군집 요구",
        "desc": "긴 간선 절단 군집",
        "hi": false
      }
    ],
    "gloss": "MST는 TSP 1.5배 근사 토대, Borůvka로 병렬 확장",
    "diff": [
      "Borůvka(1926, 모라비아 전력망 설계) — 성분마다 최소 간선 동시 선택, 병렬·분산 MST 의 기반",
      "정량: Christofides(1976) — MST + 최소 완전 매칭으로 메트릭 TSP 1.5배 근사",
      "Gower·Ross(1969) — MST 긴 간선 절단 = 단일 연결 군집"
    ],
    "sources": [
      "O. Borůvka, O jistém problému minimálním, 1926",
      "N. Christofides, Worst-case analysis of a new heuristic for the TSP, CMU Report 388, 1976",
      "Gower & Ross, Minimum Spanning Trees and Single Linkage Cluster Analysis, Applied Statistics 18(1), 1969"
    ]
  },
  "트리 순회(Tree Traversal)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "radialIn",
    "boxes": [
      {
        "label": "편향 트리 재귀",
        "role": "스택 O(n)"
      },
      {
        "label": "Morris 순회",
        "role": "상수 공간"
      },
      {
        "label": "스레드 이진 트리",
        "role": "빈 링크 활용"
      },
      {
        "label": "명시적 스택",
        "role": "반복 구현"
      }
    ],
    "hi": 0,
    "gloss": "편향 트리 재귀 O(n) 스택 한계, Morris 순회로 O(1) 공간",
    "diff": [
      "Morris(1979) 순회 — 임시 스레드 링크로 스택 없이 O(1) 추가 공간 중위 순회",
      "스레드 이진 트리(Perlis·Thornton 1960) — 빈 자식 링크를 선행·후속 노드 포인터로 활용",
      "견해: Morris 는 순회 중 트리를 잠시 바꾸므로 동시 접근 환경은 명시적 스택 반복 구현이 안전"
    ],
    "sources": [
      "J. M. Morris, Traversing binary trees simply and cheaply, IPL 9(5), 1979",
      "Perlis & Thornton, Symbol manipulation by threaded lists, CACM 3(4), 1960"
    ]
  },
  "그래프 순회(Graph Traversal)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "도형",
    "pattern": "flow",
    "boxes": [
      {
        "label": "큐 메모리 폭증",
        "role": "너비 한계"
      },
      {
        "label": "IDDFS",
        "role": "반복 심화"
      },
      {
        "label": "IDA*",
        "role": "비용 한도"
      },
      {
        "label": "15-퍼즐",
        "role": "최적해 탐색"
      }
    ],
    "hi": 1,
    "arrows": [
      "깊이 제한",
      "휴리스틱",
      "적용 사례"
    ],
    "gloss": "너비 탐색 O(b^d) 메모리 한계, IDDFS는 O(bd)로 최단 보장",
    "diff": [
      "Korf(1985) IDDFS — 메모리 O(bd)로 너비 우선 O(b^d) 대비 축소, 최단 깊이 해 보장",
      "실제 사례: IDA*(Korf 1985)로 15-퍼즐 무작위 100문제 최적해 첫 도출",
      "대규모 그래프: 방향 최적화 BFS(Beamer 2012) — Graph500 벤치마크 가속"
    ],
    "sources": [
      "R. E. Korf, Depth-first iterative-deepening: An optimal admissible tree search, Artificial Intelligence 27(1), 1985",
      "Beamer, Asanović & Patterson, Direction-Optimizing Breadth-First Search, SC 2012"
    ]
  },
  "빔 탐색(Beam Search)": {
    "concTitle": "문제점과 해결방안",
    "kind": "알고리즘·라우팅",
    "form": "리스트",
    "items": [
      {
        "kw": "길이 정규화",
        "desc": "단문 편향 억제 GNMT",
        "hi": false
      },
      {
        "kw": "Top-p 샘플링",
        "desc": "반복 퇴화 완화",
        "hi": true
      },
      {
        "kw": "Diverse Beam",
        "desc": "그룹별 다양성 확보",
        "hi": false
      }
    ],
    "gloss": "반복·단문 편향 한계, 길이 패널티·Top-p로 다양성 확보",
    "diff": [
      "GNMT(Wu et al. 2016) 길이 패널티 lp(Y)=(5+|Y|)^α/(5+1)^α 로 짧은 문장 편향 보정",
      "Holtzman et al.(ICLR 2020) — 빔 탐색의 반복 퇴화 지적, Nucleus(Top-p) 샘플링 제안",
      "Diverse Beam Search(Vijayakumar et al. 2016) — 빔 그룹 간 다양성 항 추가"
    ],
    "sources": [
      "Wu et al., Google's Neural Machine Translation System, arXiv:1609.08144",
      "Holtzman et al., The Curious Case of Neural Text Degeneration, arXiv:1904.09751",
      "Vijayakumar et al., Diverse Beam Search, arXiv:1610.02424"
    ]
  }
};

export const conclusionFor = (title?: string | null): AnswerConclusion | undefined =>
  title ? ANSWER_CONCLUSIONS[title] : undefined;
