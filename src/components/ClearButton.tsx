"use client";

/**
 * 입력칸 전체 지우기 ✕ — 칸을 감싼 `relative` 상자 오른쪽 위에 뜬다(2026-10-18 "입력필드에는 전체 지우기 기능이 있어야지").
 * 값이 비어 있으면 숨는다. 긴 글(답안·교재 붙여넣기)은 실수로 날리지 않게 한 번 묻는다(confirm).
 * 입력칸에는 ✕ 자리만큼 오른쪽 여백(pr-9)을 준다.
 */
export default function ClearButton({
  value,
  onClear,
  confirmOver = 0,
  className = "",
}: {
  value: string;
  onClear: () => void;
  /** 이 글자 수를 넘으면 지우기 전에 묻는다 — 0 이면 묻지 않는다 */
  confirmOver?: number;
  className?: string;
}) {
  if (!value) return null;
  return (
    <button
      type="button"
      aria-label="전체 지우기"
      title="전체 지우기"
      // 자동완성 목록이 blur 로 닫히기 전에 눌리도록 mousedown 에서 막는다
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (confirmOver && value.length > confirmOver && !window.confirm(`입력한 ${value.length.toLocaleString()}자를 모두 지울까요?`)) return;
        onClear();
      }}
      className={`absolute right-2 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[12px] leading-none text-slate-600 hover:bg-slate-300 hover:text-slate-900 ${className}`}
    >
      ✕
    </button>
  );
}
