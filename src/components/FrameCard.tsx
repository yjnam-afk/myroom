import Link from "next/link";
import { FRAME_BY_CODE, PARA_BY_NAME, frameOf, familyOf, sameGroup } from "@/data/answerFrames";

/**
 * 🧩 답안 틀(돌려막기) — 토픽 화면 답안지 템플릿 아래.
 * 이 토픽의 개념도 그룹(고정 틀·바꿀 슬롯·실패 신호), 3단락 유형(제목 틀·형태·대상 후보), 짝 토픽,
 * 그리고 같은 틀로 이름·항목만 갈아끼울 수 있는 묶음 토픽(돌려막기 후보)을 보여 준다(2026-11-09).
 */
export default function FrameCard({ title, compact }: { title: string; compact?: boolean }) {
  const f = frameOf(title);
  if (!f) return null;
  const g = FRAME_BY_CODE[f.group];
  const p = PARA_BY_NAME[f.type];
  const fam = familyOf(title);
  const same = sameGroup(title);
  const href = (t: string) => `/explain?topic=${encodeURIComponent(t)}`;
  const chip = (t: string, cls: string) => (
    <Link key={t} href={href(t)} className={`rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {t.replace(/\s*[(（][^)）]*[)）]\s*$/, "")}
    </Link>
  );
  return (
    <div className={`${compact ? "mt-3" : "mx-5 mb-4"} rounded-xl border border-slate-200 bg-white`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <p className="text-sm font-bold text-slate-900">🧩 답안 틀</p>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${g.cls}`}>
          {g.code} {g.name}
        </span>
        <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
          3단락 · {f.type}
        </span>
        {!compact && (
          <span className="ml-auto text-[11px] text-slate-400">틀은 재사용, 논점·사례·수치는 토픽마다 새로</span>
        )}
      </div>
      <div className={`grid gap-3 px-4 py-3 text-[12px] leading-relaxed text-slate-700 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <p className="font-semibold text-slate-800">가. 개념도 — {g.template}</p>
          <p className="mt-0.5">
            <span className="text-slate-400">고정 틀 </span>
            {g.fixed}
          </p>
          <p className="mt-0.5">
            <span className="text-slate-400">이 토픽의 슬롯 </span>
            <b>{f.slot}</b>
          </p>
          {!compact && (
            <p className="mt-0.5 text-slate-500">
              <span className="text-slate-400">표 매칭 </span>
              {g.table} · <span className="text-rose-600">실패 신호: {g.fail}</span>
            </p>
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-800">3단락 — {p?.title ?? f.type}</p>
          {p && (
            <p className="mt-0.5">
              <span className="text-slate-400">형태 </span>
              {p.form}
            </p>
          )}
          <p className="mt-0.5">
            <span className="text-slate-400">대상 후보 </span>
            <b>{f.target || "—"}</b>
          </p>
          {f.pair && (
            <p className="mt-0.5 flex flex-wrap items-center gap-1">
              <span className="text-slate-400">짝·충돌 토픽 </span>
              {chip(f.pair, "border-indigo-200 bg-indigo-50 text-indigo-700")}
              <span className="text-[10px] text-slate-400">같은 시험에 함께 나오면 하나만 비교</span>
            </p>
          )}
          {!compact && p && <p className="mt-0.5 text-slate-500">회전 풀 · {p.pool}</p>}
        </div>
      </div>
      {(fam.length > 0 || same.length > 0) && (
        <div className="border-t border-slate-100 px-4 py-2.5 text-[12px]">
          {fam.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700">🔁 돌려막기 묶음 · {f.family}</span>
              {fam.map((t) => chip(t, g.cls))}
              <span className="text-[10px] text-slate-400">같은 틀 — 이름·항목만 갈아끼운다</span>
            </div>
          )}
          {!compact && same.length > 0 && (
            <details className="mt-1.5">
              <summary className="cursor-pointer text-[11px] text-slate-500">
                같은 개념도 그룹({g.code})의 다른 토픽 {same.length}개
              </summary>
              <div className="mt-1 flex flex-wrap gap-1">{same.map((t) => chip(t, "border-slate-200 bg-slate-50 text-slate-600"))}</div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
