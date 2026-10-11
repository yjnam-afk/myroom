/**
 * 답안 작성 지침(1교시 V31 · 2교시 4단락)을 토픽 답안지 템플릿에 옮긴 규칙.
 *
 * V31(2026-10-11): 3단락 = 차별화 단락 — 교재·2단락에 없는 차별화 요소(최신 기술·표준 / 정량 수치 /
 * 실제 적용 사례 / 수험자 견해) 2개 이상. 결론 제목 「고려사항」 금지 → 패턴 7은 「적용 사례」.
 *
 * 2026-10-11 "답안지 탬플릿은 전혀… 지침 고려 안 했네" — 템플릿이 I/II/III 로마 숫자, 정의를 표로,
 * 결론 없이 「끝」이었다. 지침은 1교시 26줄 「답. → 1. 정의(가. 정의 2줄/나. 특징 1줄) →
 * 2. 개념도와 ○○(가. 그림+간글/나. 표+간글) → 3. 결론 4박스 그림+결론 간글 → 끝 → 검증 줄 →
 * 결론 선택 줄」, 2교시 66~77줄 「Ⅰ 서론 → Ⅱ 본론1 → Ⅲ 본론2(승부처) → Ⅳ 결론(카드 표+4박스)」이다.
 *
 * 결론 그림의 칸 글은 지어 넣지 않는다 — 토픽 이름처럼 확실한 것만 채우고 나머지는 빈칸 안내다.
 */

/** 1교시 문제 유형(지침 2장) */
export type Shape1 = "기본형" | "2항목형" | "비교형";

export type ConcPattern = "hybrid" | "flow" | "radialIn" | "pairs" | "beforeAfter" | "radial" | "contain" | "link" | "branch";

/** 결론 제목·패턴 13종(지침 5-1) */
export type Conclusion = {
  no: number;
  title: string;
  pattern: ConcPattern;
  /** 박스 3~5개 라벨 — fill=false 는 빈칸 안내(회색), role 은 박스 아래 역할 키워드 */
  boxes: { text: string; fill: boolean; role?: string }[];
  /** flow 화살표 라벨(4~5자) */
  arrows?: string[];
  /** contain 패턴의 상위 체계 이름 */
  group?: string;
  /** 강조 박스 번호 */
  hi: number;
  /** 결론 선택 줄의 [토픽 유형] */
  kind: string;
};

const P = (text: string) => ({ text, fill: false });
const F = (text: string) => ({ text, fill: true });

const isCompare = (t: string) => /비교|\bvs\.?\b|VS|대비/.test(t);

export function shape1(title: string, pairCount: number): Shape1 {
  if (isCompare(title)) return "비교형";
  if (pairCount >= 2) return "2항목형";
  return "기본형";
}

/** 표 성격(지침 2장 항목 성격) — 근거형이면 개념도 없이 표 + 간글 */
export function isReasonTable(caption: string): boolean {
  return /필요|등장 ?배경|장단점|장점|단점|고려|효과|문제점|한계|활용 ?목적|기대/.test(caption);
}

/**
 * 결론 제목 고르기(지침 5-2). 문제 문구가 없으니 토픽 유형표 1순위 → 본론과 겹치면 2순위.
 * 토픽 유형은 제목·과목으로 가른다 — 애매하면 활용 방안(10)이고 발전 방향(13)은 AI 모델 계보만.
 */
export function pickConclusion(opts: {
  title: string;
  bare: string;
  course: string;
  pairs: string[];
  /** 2단락(본론) 표 제목 — 동작원리면 「동작·변환 과정」을 피한다 */
  bodyCaption?: string;
}): Conclusion {
  const { title, bare, course, pairs } = opts;
  const t = title;
  const body = opts.bodyCaption ?? "";
  // [토픽 유형, 1순위, 2순위]
  let row: [string, number, number];
  if (isCompare(t)) row = ["비교형", 11, 9];
  else if (pairs.length >= 2) row = ["「A와 B」 두 기법", 1, 8];
  else if (/ISO|IEC|IEEE|RFC|3GPP|802\.|Wi-?Fi|표준|Release/i.test(t)) row = ["표준·규격 기술", 2, 9];
  else if (/LLM|VLM|GPT|트랜스포머|Transformer|GAN|VAE|Diffusion|파운데이션|언어 ?모델|멀티모달|옴니모달/i.test(t))
    row = ["AI 모델·서비스 계보", 13, 10];
  else if (/가이드|지침|법|제도|정책|전략|인증|매뉴얼|고시/.test(t)) row = ["정책·전략", 12, 5];
  else if (course === "MG" || course === "PM") row = ["경영·관리 기법", 12, 10];
  else if (/AI-RAN|NTN|비지상|O-RAN|특화망|위성|C-RAN|RAN Sharing/i.test(t)) row = ["국내외 상용화가 진행 중인 기술", 7, 2];
  else if (/HTTP\/3|IPv6|NewSQL|Wi-Fi|차세대|Hyper|Matter|TPU|CXL/i.test(t)) row = ["기존 기술의 개선판", 6, 9];
  else if (/6G|ISAC|NTN|양자|에이전|Agent|Physical AI|AX|소버린|디지털 트윈|메타버스|블록체인/i.test(t))
    row = ["6G·AI 등 신기술", 5, 6];
  else if (/QoS|보안|암호|인증|접근 ?통제|서명|DRM|워터마킹/.test(t) || course === "SC") row = ["QoS·보안 등 세부 기법", 8, 4];
  else if (/알고리즘|정렬|라우팅|해싱|탐색|순회|스케줄링|교체|트리|Tree|Sort|검증/i.test(t) || course === "AL" || course === "DS")
    row = ["알고리즘·라우팅", 4, 6];
  else if (/프로토콜|Protocol|TCP|UDP|IP|DNS|ARP|DHCP|SCTP|BGP|주소|CSMA|Handshak/i.test(t)) row = ["프로토콜 동작·주소 체계", 3, 4];
  else if (/SDN|CDN|SD-WAN|DRS|RAID|\bHA\b|클라우드|레이크|DB|데이터베이스|플랫폼|시스템/i.test(t) || course === "DB")
    row = ["인프라·솔루션 도입", 7, 12];
  else row = ["일반 기술", 10, 7];

  let pick = row[1];
  // 본론과 중복 금지(5-2 ⑤) — 2단락이 동작원리면 동작·변환 과정 대신 2순위
  if (pick === 3 && /동작|절차|과정|흐름|메커니즘|매커니즘/.test(body)) pick = row[2];
  return conclusionOf(pick, { bare, pairs, kind: row[0] });
}


/** 결론 번호(5-1) → 4박스 그림. 토픽 이름·두 개념 이름처럼 확실한 것만 채운다 */
export function conclusionOf(no: number, o: { bare: string; pairs: string[]; kind: string }): Conclusion {
  const { bare, pairs, kind } = o;
  const A = pairs[0] ? F(pairs[0]) : P("A");
  const B = pairs[1] ? F(pairs[1]) : P("B");
  const T = F(bare);

  switch (no) {
    case 1:
      return { no, kind, title: "하이브리드 기술", pattern: "hybrid", boxes: [A, B, P("결합 기술"), P("차세대 적용")], hi: 2 };
    case 2:
      return { no, kind, title: "표준화 동향", pattern: "flow", boxes: [P("이전 단계"), T, P("후속 Release"), P("차세대 표준")], hi: 1 };
    case 3:
      return { no, kind, title: "동작·변환 과정", pattern: "flow", boxes: [P("입력"), P("핵심 변환"), P("변환2"), P("출력")], hi: 1 };
    case 4:
      return { no, kind, title: "문제점과 해결방안", pattern: "radialIn", boxes: [P("문제"), P("해결책1"), P("해결책2"), P("해결책3")], hi: 0 };
    case 5:
      return { no, kind, title: "구현 과제와 해결방안", pattern: "pairs", boxes: [P("과제1"), P("해결1"), P("과제2"), P("해결2")], hi: 1 };
    case 6:
      return { no, kind, title: "기존 기술 대비 차별점", pattern: "beforeAfter", boxes: [P("기존 기술"), T, P("개선 효과 A"), P("개선 효과 B")], hi: 1 };
    case 7:
      // V31 — 「고려사항」 금지, 패턴 7은 적용 사례(사례 분기)
      return { no, kind, title: "적용 사례", pattern: "branch", boxes: [T, P("기업 사례 A"), P("기관 사례 B"), P("국가 전략 C")], hi: 0 };
    case 8:
      return { no, kind, title: "상위 체계 내 위치", pattern: "contain", boxes: [T, P("형제 기술"), P("형제 기술"), P("형제 기술")], hi: 0 };
    case 9:
      return { no, kind, title: "연계 시사점", pattern: "link", boxes: [T, P("연계 기술"), P("효과 A"), P("효과 B")], hi: 0 };
    case 10:
      return { no, kind, title: "활용 방안", pattern: "branch", boxes: [T, P("산업 A"), P("산업 B"), P("산업 C")], hi: 0 };
    case 11:
      return { no, kind, title: "융합 방안", pattern: "hybrid", boxes: [A, B, P("융합 결과"), P("비전")], hi: 2 };
    case 12:
      return { no, kind, title: "도입 시 제언", pattern: "flow", boxes: [P("도입"), P("정착"), P("확산"), P("목표")], hi: 0 };
    default:
      return { no: 13, kind, title: "발전 방향", pattern: "flow", boxes: [P("이전 기술"), T, P("차세대"), P("비전")], hi: 1 };
  }
}

/** 2교시 문제 유형 판별(2교시 지침 §11.1) — 문제 문구가 없어 토픽 제목·표로 가른다 */
export type Shape2 = { no: 1 | 2 | 3 | 4 | 6; name: string; intro: string; close: string; card: { name: string; headers: string[] } };

export function shape2(title: string, course: string, captions: string[]): Shape2 {
  const caps = captions.join(" ");
  if (isCompare(title))
    return { no: 3, name: "비교형", intro: "Ⅰ. 1교시 상속·확장", close: "융합 방안", card: { name: "융합·하이브리드", headers: ["융합", "구성", "활용 효과"] } };
  if (course === "SC" || /보안|위협|취약점|공격/.test(title))
    return { no: 6, name: "보안·대응방안형", intro: "Ⅲ. Why 관점", close: "대응방안 종합", card: { name: "법·표준 근거", headers: ["분야", "근거", "요구사항"] } };
  if (/절차|단계|발전|프로세스|라이프 ?사이클|생명 ?주기|방법론/.test(title) || /절차|단계|프로세스/.test(captions[0] ?? ""))
    return { no: 4, name: "절차·발전단계형", intro: "Ⅵ. 발전단계", close: "적용 시 고려사항", card: { name: "단계별 성숙도", headers: ["단계", "수준", "핵심 활동"] } };
  if (/구성|유형|종류|분류|요소/.test(caps))
    return { no: 2, name: "구성요소·유형형", intro: "Ⅰ. 1교시 상속·확장", close: "적용 전략", card: { name: "CSF + 위험요인", headers: ["구분", "성공 요인", "실패 위험"] } };
  return { no: 1, name: "정의·개념 설명형", intro: "Ⅰ. 1교시 상속·확장", close: "발전 방향", card: { name: "역사적 발전 흐름", headers: ["세대", "기술", "진화 특징"] } };
}

/** 표 소제목 이름 — 교재 표 2열 머리글을 따른다(지침 4장 「나. FEC 기법」) */
export function tableSubject(headers: string[], caption: string): string {
  const h = (headers[1] ?? "").replace(/\s*\([^)]*\)/g, "").trim();
  if (headers.length >= 3 && h && !/^(설명|내용|비고|특징|정의)$/.test(h)) return h;
  const c = caption.split(" — ")[0].replace(/\s*\([^)]*\)/g, "").trim();
  return c || "구성요소";
}

/** 결론 표현 형태(1교시 지침 V34 5-00) — 도형·그래프·리스트 중 토픽에 맞는 것 */
export type ConclusionForm = "도형" | "그래프" | "리스트";

/**
 * 기본 형태 고르기 — 성능·규모·추이를 수치로 견줄 토픽은 그래프, 전략·사례·제언처럼
 * 서로 독립된 항목이면 리스트, 흐름·결합·포함·분기 관계면 도형.
 */
export function pickForm(c: Conclusion, title: string): ConclusionForm {
  if (/혼잡제어|빅오|복잡도|성능|처리량|지연|Wi-?Fi|세대|HTTP\/3|5G|6G|분포|확률|시계열|회귀|정렬/i.test(title)) return "그래프";
  if ([7, 10, 12].includes(c.no) || /전략|정책|가이드|지침|법|제도/.test(title)) return "리스트";
  return "도형";
}

/** 표 열별 글자 수 상한(V32) — 3열 표: 2열 5자·3열 6자 / 비교표(항목|A|B): A·B 6자. 1열은 재지 않는다 */
export function cellLimits(headers: string[]): (number | undefined)[] {
  // 2열 표는 마지막 열이 설명 자리라 3열 기준(5~6자)으로 잰다
  if (headers.length === 2) return [undefined, 6];
  if (headers.length !== 3) return [];
  // 2열이 교재 이름 열(구성요소·기법·유형…)이면 이름이라 글자 수 예외(V32 2열 예외)
  if (/^(항목|기술 ?요소|유형|방식|기법|핵심 ?기술|종류|구성 ?요소|분류|기반 기술|핵심 ?요소|주요 기술|핵심|핵심 기능)$/.test((headers[1] ?? "").trim()))
    return [undefined, undefined, 6];
  const compare = !/^(설명|내용|비고)$/.test((headers[2] ?? "").trim()) && /항목|구분|비교/.test(headers[0] ?? "") && !/구성|기법|요소|기술|단계|동작|유형|종류/.test(headers[1] ?? "");
  return compare ? [undefined, 6, 6] : [undefined, 5, 6];
}
