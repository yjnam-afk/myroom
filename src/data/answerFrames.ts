/**
 * 답안 틀(돌려막기) — 2026-11-09 "비슷한 토픽이라면 충분히 그루핑해서 일부만 갈아끼우는 식으로 답안지를 만들 수 있을 것 같아서".
 *
 * 사용자의 「토픽 그룹 돌려막기 시트(지침 V50)」를 옮긴 것이다.
 *  - FRAME_GROUPS: 개념도 그룹 11종 — 2단락 「가. 개념도」의 고정 틀·토픽마다 바꿀 슬롯·실패 신호.
 *  - PARA_TYPES: 3단락(차별화 단락) 유형 8종 — 제목 틀·형태·채울 슬롯·회전 풀.
 *  - TOPIC_FRAMES(topicFrames.json): 교재 서브노트 710개마다 그룹·유형·슬롯·3단락 대상 후보·짝 토픽·묶음(family).
 *    묶음 = 같은 그룹 + 같은 표 구조 + 같은 주제 계열이라 틀을 그대로 두고 이름·항목만 갈아끼울 수 있는 토픽들.
 * 원칙(시트 4-0): 배치 틀은 재사용, 논점·사례·수치는 토픽마다 새로 채운다. 같은 시험에서 같은 그룹 2문제를 풀면 3단락 형태를 바꾼다.
 */
import frames from "./topicFrames.json";

export type FrameCode = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C9" | "C10" | "C11";

export type FrameGroup = {
  code: FrameCode;
  name: string;
  /** NS 템플릿 번호(지침) */
  template: string;
  /** 고정 틀(재사용) */
  fixed: string;
  /** 토픽마다 바꿀 슬롯 */
  slots: string;
  /** 표 매칭 — 어느 열이 그림의 무엇이 되는지 */
  table: string;
  /** 실패 신호 */
  fail: string;
  /** 칩 색(지도) */
  cls: string;
};

export const FRAME_GROUPS: FrameGroup[] = [
  { code: "C1", name: "계층 스택", template: "③ 아키텍처 계층도", fixed: "좌측 세로 레이어 축(× 구분) + 층별 구성요소 박스, 층 사이 세로 화살표", slots: "층 이름 / 강조 층 1개 / 층 사이 화살표 라벨", table: "층 라벨=1열, 층 안 박스=2열", fail: "한 구분만 옆으로 떼어 둠, 층 사이 화살표 없는 적층 그림", cls: "border-sky-300 bg-sky-50 text-sky-900" },
  { code: "C2", name: "화이트박스", template: "④ 화이트박스 아키텍처", fixed: "입력(원) → <시스템> 실선 컨테이너 안 모듈 2~4개 흐름 → 출력", slots: "내부 모듈 / 차별 모듈 강조 / 입력·출력", table: "박스=1열(동작원리형)", fail: "컨테이너를 블랙박스 한 칸으로 그림", cls: "border-emerald-300 bg-emerald-50 text-emerald-900" },
  { code: "C3", name: "흐름+위협", template: "⑤ 시스템 흐름 + 위협", fixed: "시스템 흐름도 + 구성요소마다 바깥으로 위협 화살표", slots: "위협명 / 공격 지점", table: "구성요소=1열, 위협=2열", fail: "위협이 흐름과 떨어진 목록으로만 있음", cls: "border-rose-300 bg-rose-50 text-rose-900" },
  { code: "C4", name: "순환 제어", template: "순환(4-1)", fixed: "도는 대상 가운데 강조 + 감시 → 판단 → 조치 고리", slots: "대상 박스 / 지표·정책 라벨 / 되돌아가는 화살표", table: "단계 박스=1열(동작원리형)", fail: "PDCA처럼 토픽명 바꿔도 맞는 4박스 순환", cls: "border-amber-300 bg-amber-50 text-amber-900" },
  { code: "C5", name: "주체·구역", template: "② Client–Service / ⑦ ①~③ 단계", fixed: "하단 축 × 구역 + 범위 라벨, 구역 사이 꺾인 화살표", slots: "주체·구역 이름 / 주고받는 산출물", table: "범위 라벨=1열, 구역 안 박스=2열", fail: "주체 간 핵심 관계 화살표 누락, 대상을 주체 구역에 넣음", cls: "border-violet-300 bg-violet-50 text-violet-900" },
  { code: "C6", name: "2단 절차·체인", template: "⑧ 2단 절차 / ⑨ 기술단계 체인", fixed: "위 쉐브론 메인 단계 + 아래 하위 단계(또는 번호 원 + 하단 축 그룹)", slots: "단계명 / 그룹 축 라벨 / 핵심 단계 강조", table: "메인=1열, 하위=2열", fail: "그림 4줄 초과, 하위 단계 과다", cls: "border-orange-300 bg-orange-50 text-orange-900" },
  { code: "C7", name: "플랫폼 중개", template: "① 3단계 구성도", fixed: "공급 측 ↔ <플랫폼>(쉐브론 처리 + 지원 모듈) ↔ 수요 측", slots: "공급·수요 주체 / 처리 흐름 / 인터페이스 라벨", table: "공급·플랫폼·수요=1열", fail: "플랫폼 내부 모듈이 안 보임", cls: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900" },
  { code: "C8", name: "행위자 시퀀스", template: "⑩(b) 순서도", fixed: "양쪽 행위자 + 가운데 시스템, 번호 화살표 ①②③", slots: "메시지·단계명 / 번호 순서", table: "단계=1열(동작원리형)", fail: "번호 없는 화살표, 응답 방향 누락", cls: "border-cyan-300 bg-cyan-50 text-cyan-900" },
  { code: "C9", name: "내·외부 스택", template: "⑥ 내·외부 기술스택", fixed: "세로 실선으로 내부·외부 구분, 내부는 계층 스택, 경계에 연결 기술 라벨", slots: "내부 계층 / 외부 연계 대상 / 경계 기술", table: "내부·외부=1열(기술요소형)", fail: "경계 연결 기술 라벨 누락", cls: "border-teal-300 bg-teal-50 text-teal-900" },
  { code: "C10", name: "결합·유형", template: "결합 관계 / 유형형 표", fixed: "유형들이 맞물리는 전체 관계도(분기·결합 화살표 라벨=유형명)", slots: "유형명 / 결합 대상 / 미니 개념도", table: "유형명=1열", fail: "유형 박스 나열만 있는 분류도", cls: "border-lime-300 bg-lime-50 text-lime-900" },
  { code: "C11", name: "그래프", template: "그래프(4-1)", fixed: "가로·세로 축 + 곡선·막대, 주제만 강조", slots: "축 이름 / 비교 곡선 / 값 라벨 2~3개", table: "곡선 구간=1열", fail: "출처 없는 수치", cls: "border-slate-300 bg-slate-100 text-slate-900" },
];
export const FRAME_BY_CODE: Record<string, FrameGroup> = Object.fromEntries(FRAME_GROUPS.map((g) => [g.code, g]));

export type ParaType = {
  name: string;
  /** 제목 틀 — [주제]·[대상] 자리 */
  title: string;
  /** 형태(도형·리스트·비교표·타임라인) */
  form: string;
  /** 채울 슬롯 */
  slots: string;
  /** 회전 풀 / 조건 */
  pool: string;
};

export const PARA_TYPES: ParaType[] = [
  { name: "연계 강화", title: "[주제]와 [연계 기술] [효과]", form: "도형: [주제]·[연계 기술] 합류 → [결과]", slots: "연계 기술 1개(2단락에 없는 것) / 효과 박스", pool: "AI·ML / 5G·MEC / 양자내성(PQC) / 블록체인 / SASE" },
  { name: "활용 사례", title: "[주제] 활용 사례 / 기업 사례", form: "사례 분기 도형 또는 번호 리스트", slots: "실명 사례 3개 + 수치 1개", pool: "토픽마다 사례 카드에 미리 3개 확보" },
  { name: "적용 분야", title: "[분야] [주제] 활용방안", form: "도형 흐름: 주제 기술 → 분야 시스템 → 성과", slots: "분야(팩토리·의료·금융·공공) / 분야 시스템", pool: "분야를 돌려 씀: 스마트 팩토리 → 의료 → 금융" },
  { name: "연관 비교", title: "[주제]와 [연관 토픽] 비교", form: "비교표 헤더 + 3행(개념·차이·사례/법제)", slots: "짝 토픽 / 마지막 행 실명·법령", pool: "짝 토픽 열 참고, 비교형 문제엔 금지" },
  { name: "로드맵", title: "[주제] [목표] 로드맵", form: "타임라인: 연도 축 + 단계 박스 3~4", slots: "확인된 연도·Release·시행일", pool: "표준(3GPP Rel, IEEE) / 법령 시행일만" },
  { name: "실무 도구", title: "[주제]와 [실무 방식]", form: "흐름: 입력 → 도구 → 사람 검증(HITL) 고리", slots: "도구명 / 검증 고리", pool: "도구가 흐름의 한 단계일 때만" },
  { name: "성공 전략", title: "[주제] 성공 전략·우선순위", form: "번호 리스트 ①②③", slots: "예방 / 진단 / 적용 원칙 + 도구명", pool: "절차형 관리 기법 전용(패턴 14)" },
  { name: "문제-해결", title: "[주제] 문제점과 해결방안", form: "가운데 [문제] ← 해결책 3개", slots: "문제 1 / 해결 기법 3", pool: "약점이 알려진 알고리즘·프로토콜(패턴 4)" },
];
export const PARA_BY_NAME: Record<string, ParaType> = Object.fromEntries(PARA_TYPES.map((t) => [t.name, t]));

export type TopicFrame = {
  /** 개념도 그룹 코드 */
  group: FrameCode;
  /** 3단락 유형 이름 */
  type: string;
  /** 이 토픽에서 그룹의 바꿀 슬롯에 들어갈 것(교재 표 항목) */
  slot: string;
  /** 3단락 대상 후보 — 연계 기술·사례·비교 짝·분야 */
  target: string;
  /** 짝·충돌 토픽(교재 제목) */
  pair: string;
  /** 돌려막기 묶음 이름(같은 틀로 일부만 바꿔 쓰는 토픽끼리) */
  family: string;
  /** 과목 코드 */
  course: string;
};

export const TOPIC_FRAMES = frames as Record<string, TopicFrame>;

export const frameOf = (title?: string | null): TopicFrame | undefined => (title ? TOPIC_FRAMES[title] : undefined);

/** 같은 묶음의 다른 토픽(같은 과목) — 돌려막기 후보 */
export function familyOf(title: string): string[] {
  const f = TOPIC_FRAMES[title];
  if (!f?.family) return [];
  return Object.entries(TOPIC_FRAMES)
    .filter(([t, x]) => t !== title && x.family === f.family && x.course === f.course)
    .map(([t]) => t);
}

/** 같은 개념도 그룹의 토픽(과목 안) */
export function sameGroup(title: string): string[] {
  const f = TOPIC_FRAMES[title];
  if (!f) return [];
  return Object.entries(TOPIC_FRAMES)
    .filter(([t, x]) => t !== title && x.group === f.group && x.course === f.course)
    .map(([t]) => t);
}

/** 과목의 묶음 목록 — 이름 → 토픽들(2개 이상만) */
export function familiesOf(course: string): { name: string; topics: string[]; group: FrameCode }[] {
  const m = new Map<string, { topics: string[]; group: FrameCode }>();
  for (const [t, x] of Object.entries(TOPIC_FRAMES)) {
    if (x.course !== course || !x.family) continue;
    const e = m.get(x.family) ?? { topics: [], group: x.group };
    e.topics.push(t);
    m.set(x.family, e);
  }
  return [...m.entries()].filter(([, e]) => e.topics.length >= 2).map(([name, e]) => ({ name, ...e })).sort((a, b) => b.topics.length - a.topics.length);
}
