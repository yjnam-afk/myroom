/**
 * 배지 색·차례 — 자료를 import 하지 않는 순수 상수라 서버·클라이언트 어디서나 싸게 쓴다.
 * (화면 파일마다 같은 표를 복사해 두었던 것을 2026-11-15 에 모았다.)
 */

/** 중요도 정렬 차례 — 상 → 중 → 하 → 출제예상 */
export const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

/** 교재 Priority 배지 — ★★★=상(빨강), ★★=중(파랑), ★=하(회색), ◎=출제예상 */
export const PRIORITY_STYLE: Record<string, { cls: string; star: string }> = {
  상: { cls: "bg-red-100 text-red-700 ring-red-200", star: "★★★" },
  중: { cls: "bg-blue-100 text-blue-700 ring-blue-200", star: "★★" },
  하: { cls: "bg-slate-100 text-slate-600 ring-slate-200", star: "★" },
  출제예상: { cls: "bg-brand-50 text-brand-700 ring-brand-200", star: "◎" },
};

/** 레벨(암기·숙지·점검·참고) 배지 색 — 페이지마다 다르게 칠하지 않도록 여기서 정한다. */
export const LEVEL_STYLE: Record<string, string> = {
  암기: "border-rose-300 bg-rose-50 text-rose-700",
  숙지: "border-amber-300 bg-amber-50 text-amber-700",
  점검: "border-sky-300 bg-sky-50 text-sky-700",
  참고: "border-slate-200 bg-slate-50 text-slate-400",
};

/** 레벨이 무슨 뜻인지 — 배지 title 속성에 넣어 마우스로 확인할 수 있게. */
export const LEVEL_HINT: Record<string, string> = {
  암기: "통째로 외운다 — 정의·유형·조건까지 그대로",
  숙지: "개념과 구조를 이해해 둔다 — 설명할 수 있으면 된다",
  점검: "출제 공백이 길거나 기억이 흔들려 한 번 훑어야 한다",
  참고: "당분간 출제 가능성이 낮다 — 시간 남을 때",
};
