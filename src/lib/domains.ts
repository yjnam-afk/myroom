/**
 * 과목(도메인) 축 — 앱 전체가 이 목록 하나만 본다.
 *
 * 여기가 없던 시절의 문제:
 *  - 페이지마다 과목 이름을 따로 적어 "소프트웨어공학"(topics.json)과
 *    "SW공학"(지도·회독관리 상수)이 별개 분류로 갈라졌다. 같은 과목이
 *    칩 두 개로 보이고, 토픽 수도 586/96 으로 쪼개졌다.
 *  - 분류 칩 순서를 데이터 등장 순서로 만들어, 토픽이 적은 운영체제(32)·
 *    컴퓨터구조(23)가 맨 뒤로 밀려 화면 밖으로 나갔다. 정작 심화반 1주차가
 *    CA·OS 인데 지도에서 찾을 수 없었다.
 *
 * 그래서 순서는 데이터 분포가 아니라 **심화반 커리큘럼 진행 순서**로 고정한다.
 * 지금 배우는 과목이 항상 맨 앞에 온다.
 */

export type DomainCode =
  | "CA" | "OS" | "SE" | "PM" | "AI" | "ST"
  | "NW" | "AL" | "DS" | "DB" | "MG" | "SC" | "DX";

export type Domain = {
  code: DomainCode;
  /** 화면에 쓰는 정식 이름 — 데이터의 category 값도 이 문자열로 맞춘다. */
  label: string;
  /** 좁은 화면·배지용 줄임말 */
  short: string;
  /** 심화반에서 이 과목을 다루는 주차(스프린트 I 기준) */
  week: number;
};

/** 심화반 커리큘럼 진행 순서 그대로. */
export const DOMAINS: Domain[] = [
  { code: "CA", label: "컴퓨터구조", short: "CA", week: 1 },
  { code: "OS", label: "운영체제", short: "OS", week: 1 },
  { code: "SE", label: "소프트웨어공학", short: "SE", week: 2 },
  { code: "PM", label: "프로젝트관리", short: "PM", week: 2 },
  { code: "AI", label: "인공지능", short: "AI", week: 3 },
  { code: "ST", label: "확률·통계", short: "ST", week: 3 },
  { code: "NW", label: "네트워크", short: "NW", week: 4 },
  { code: "AL", label: "알고리즘", short: "AL", week: 4 },
  { code: "DS", label: "자료구조", short: "DS", week: 4 },
  { code: "DB", label: "데이터베이스", short: "DB", week: 5 },
  { code: "MG", label: "경영전략", short: "MG", week: 5 },
  { code: "SC", label: "보안", short: "SC", week: 6 },
  { code: "DX", label: "디지털서비스", short: "DX", week: 7 },
];

/** 과목 코드 → 정식 이름. 모르는 코드는 그대로 돌려준다. */
export const DOMAIN_LABEL: Record<string, string> = Object.fromEntries(
  DOMAINS.map((d) => [d.code, d.label]),
);

const BY_LABEL = new Map(DOMAINS.map((d) => [d.label, d]));

/**
 * 데이터에 섞여 있는 옛 이름·줄임말을 정식 이름으로 모은다.
 * 새 표기를 발견하면 여기에만 한 줄 추가하면 전 페이지가 같이 고쳐진다.
 */
const ALIAS: Record<string, string> = {
  "SW공학": "소프트웨어공학",
  "소프트웨어 공학": "소프트웨어공학",
  "소프트웨어공학(SE)": "소프트웨어공학",
  "확률통계": "확률·통계",
  "확률/통계": "확률·통계",
  "확률과 통계": "확률·통계",
  "컴퓨터 구조": "컴퓨터구조",
  "운영 체제": "운영체제",
  "프로젝트 관리": "프로젝트관리",
  "데이터 베이스": "데이터베이스",
  "디지털 서비스": "디지털서비스",
  "정보보안": "보안",
  "보안(SC)": "보안",
};

/** 과목 이름을 정식 이름으로 정규화한다(코드도 받는다). */
export function domainLabel(nameOrCode: string): string {
  const s = (nameOrCode || "").trim();
  if (!s) return s;
  if (DOMAIN_LABEL[s]) return DOMAIN_LABEL[s];
  return ALIAS[s] || s;
}

/**
 * 정렬 키 — 커리큘럼 순서. 목록에 없는 과목은 뒤로 보내되
 * 사라지지는 않게 큰 값을 준다.
 */
export function domainOrder(nameOrCode: string): number {
  const label = domainLabel(nameOrCode);
  const i = DOMAINS.findIndex((d) => d.label === label);
  return i < 0 ? DOMAINS.length : i;
}

/** 과목 이름 목록을 커리큘럼 순서로 정렬한다(같으면 이름순). */
export function sortDomains(names: string[]): string[] {
  return [...names].sort(
    (a, b) => domainOrder(a) - domainOrder(b) || a.localeCompare(b, "ko"),
  );
}

/** 과목 배지 색 — 페이지마다 다른 색을 쓰지 않도록 여기서 정한다. */
export const DOMAIN_STYLE: Record<string, string> = {
  컴퓨터구조: "border-sky-200 bg-sky-50 text-sky-700",
  운영체제: "border-sky-200 bg-sky-50 text-sky-700",
  소프트웨어공학: "border-violet-200 bg-violet-50 text-violet-700",
  프로젝트관리: "border-violet-200 bg-violet-50 text-violet-700",
  인공지능: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "확률·통계": "border-emerald-200 bg-emerald-50 text-emerald-700",
  네트워크: "border-amber-200 bg-amber-50 text-amber-700",
  알고리즘: "border-amber-200 bg-amber-50 text-amber-700",
  자료구조: "border-amber-200 bg-amber-50 text-amber-700",
  데이터베이스: "border-rose-200 bg-rose-50 text-rose-700",
  경영전략: "border-rose-200 bg-rose-50 text-rose-700",
  보안: "border-slate-300 bg-slate-100 text-slate-700",
  디지털서비스: "border-brand-200 bg-brand-50 text-brand-700",
};

export function domainStyle(nameOrCode: string): string {
  return (
    DOMAIN_STYLE[domainLabel(nameOrCode)] ||
    "border-slate-200 bg-slate-50 text-slate-500"
  );
}

/** 과목 이름이 우리가 아는 13과목인지. */
export function isKnownDomain(nameOrCode: string): boolean {
  return BY_LABEL.has(domainLabel(nameOrCode));
}
